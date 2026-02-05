import type { Database } from "@/types/database";
import {
  MOCK_PAYMENTS,
  MOCK_TEACHER_EARNINGS,
  MOCK_TRANSACTIONS,
  generateMockStripeChargeId,
} from "@/lib/mock-data";

// A lightweight in-memory Supabase mock for offline/dev E2E.
// It only implements the subset of the Supabase JS client that SacredChain uses.

type TableName = keyof Database["public"]["Tables"] | string;

type AnyRow = Record<string, any>;

type QueryResult<T> = Promise<{ data: T | null; error: any | null }>;

function nowIso() {
  return new Date().toISOString();
}

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

function genId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
}

// Shared in-memory tables (persist for the lifetime of the JS runtime)
const memory = {
  payments: clone(MOCK_PAYMENTS),
  teacher_earnings: clone(MOCK_TEACHER_EARNINGS),
  transactions: clone(MOCK_TRANSACTIONS),
};

// Expose for Playwright E2E assertions in offline mode.
// (Only exists in the browser bundle when VITE_USE_MOCK_DATA=true.)
(globalThis as any).__SACREDCHAIN_MOCK_DB__ = memory;

type Filter = { col: string; op: "eq" | "neq"; value: any };

function applyFilters<T extends AnyRow>(rows: T[], filters: Filter[]): T[] {
  return rows.filter((r) =>
    filters.every((f) => {
      if (f.op === "eq") return r[f.col] === f.value;
      if (f.op === "neq") return r[f.col] !== f.value;
      return true;
    })
  );
}

function applyOrder<T extends AnyRow>(rows: T[], order: { col: string; ascending: boolean } | null) {
  if (!order) return rows;
  const { col, ascending } = order;
  return [...rows].sort((a, b) => {
    const av = a[col];
    const bv = b[col];
    if (av === bv) return 0;
    // Handle ISO timestamps + strings
    return (av > bv ? 1 : -1) * (ascending ? 1 : -1);
  });
}

function enhanceSelect(table: string, rows: AnyRow[], selectStr?: string | null) {
  if (!selectStr) return rows;

  // Very small heuristic parser: if the select string requests aliased joins,
  // attach related objects if we can.
  const wantsStudent = selectStr.includes("student:");
  const wantsTeacher = selectStr.includes("teacher:");
  const wantsPayment = selectStr.includes("payment:");

  return rows.map((r) => {
    const out: AnyRow = { ...r };

    if (table === "payments") {
      if (wantsStudent) {
        out.student = {
          id: r.user_id ?? r.student_id,
          full_name: "Mock Student",
          email: "student@example.com",
        };
      }
      if (wantsTeacher) {
        out.teacher = {
          id: r.teacher_id,
          full_name: "Mock Teacher",
          email: "teacher@example.com",
        };
      }
    }

    if (table === "teacher_earnings" && wantsPayment) {
      out.payment = memory.payments.find((p) => p.stripe_charge_id === r.stripe_charge_id) ?? null;
    }

    return out;
  });
}

class MockQueryBuilder {
  private table: string;
  private filters: Filter[] = [];
  private orderBy: { col: string; ascending: boolean } | null = null;
  private pendingInsert: AnyRow | AnyRow[] | null = null;
  private pendingUpdate: AnyRow | null = null;
  private selectStr: string | null = null;

  constructor(table: string) {
    this.table = table;
  }

  select(selectStr = "*") {
    this.selectStr = selectStr;
    return this;
  }

  insert(values: AnyRow | AnyRow[]) {
    this.pendingInsert = values;
    return this;
  }

  update(values: AnyRow) {
    this.pendingUpdate = values;
    return this;
  }

  eq(col: string, value: any) {
    this.filters.push({ col, op: "eq", value });
    return this;
  }

  neq(col: string, value: any) {
    this.filters.push({ col, op: "neq", value });
    return this;
  }

  order(col: string, opts?: { ascending?: boolean }) {
    this.orderBy = { col, ascending: opts?.ascending ?? true };
    return this;
  }

  async maybeSingle(): QueryResult<any> {
    const { data, error } = await this.execute();
    if (error) return { data: null, error };
    const arr = Array.isArray(data) ? data : data ? [data] : [];
    return { data: arr[0] ?? null, error: null };
  }

  async single(): QueryResult<any> {
    const { data, error } = await this.execute();
    if (error) return { data: null, error };
    const arr = Array.isArray(data) ? data : data ? [data] : [];
    if (arr.length !== 1) {
      return { data: null, error: new Error(`Mock single() expected 1 row, got ${arr.length}`) };
    }
    return { data: arr[0], error: null };
  }

  then(resolve: any, reject: any) {
    return this.execute().then(resolve, reject);
  }

  private async execute(): QueryResult<any> {
    const t = this.table;
    if (!(t in memory)) {
      return { data: null, error: new Error(`[MockSupabase] Table not mocked: ${t}`) };
    }

    // INSERT
    if (this.pendingInsert) {
      const rows = Array.isArray(this.pendingInsert)
        ? this.pendingInsert
        : [this.pendingInsert];

      const inserted = rows.map((r) => {
        const created_at = r.created_at ?? nowIso();
        const base: AnyRow = {
          id: r.id ?? genId(t),
          created_at,
          ...r,
        };
        return base;
      });

      // Persist
      (memory as any)[t].push(...inserted);

      const out = enhanceSelect(t, inserted, this.selectStr);
      return { data: (Array.isArray(this.pendingInsert) ? out : out[0]) as any, error: null };
    }

    // UPDATE
    if (this.pendingUpdate) {
      const current = (memory as any)[t] as AnyRow[];
      const matches = applyFilters(current, this.filters);
      matches.forEach((row) => Object.assign(row, this.pendingUpdate));
      const out = enhanceSelect(t, matches, this.selectStr);
      return { data: out as any, error: null };
    }

    // SELECT
    const current = (memory as any)[t] as AnyRow[];
    const filtered = applyFilters(current, this.filters);
    const ordered = applyOrder(filtered, this.orderBy);
    const out = enhanceSelect(t, ordered, this.selectStr);
    return { data: out as any, error: null };
  }
}

export function createMockSupabaseClient() {
  return {
    from(table: TableName) {
      return new MockQueryBuilder(String(table));
    },

    // Minimal RPC stubs used by the earnings dashboard
    rpc(fn: string, _args?: any) {
      if (fn === "get_teacher_available_balance") return Promise.resolve({ data: 0, error: null });
      if (fn === "get_teacher_pending_balance") return Promise.resolve({ data: 0, error: null });
      return Promise.resolve({ data: null, error: new Error(`[MockSupabase] RPC not mocked: ${fn}`) });
    },

    functions: {
      async invoke(name: string, opts?: any) {
        // Offline flow: synthesize a successful "checkout" and persist records.
        if (name === "create-checkout-session") {
          const body = opts?.body ?? {};
          const teacherId = body.teacher_id ?? "mock-teacher";
          const userId = "mock-student-1";
          const amount = 5000;
          const stripe_charge_id = generateMockStripeChargeId();

          // Persist payment + earning + transaction
          memory.payments.push({
            id: genId("pay"),
            user_id: userId,
            teacher_id: teacherId,
            session_id: body.scheduled_at ? genId("sess") : null,
            amount,
            status: "held",
            stripe_charge_id,
            created_at: nowIso(),
          });

          memory.teacher_earnings.push({
            id: genId("earn"),
            teacher_id: teacherId,
            amount: Math.round(amount * 0.85),
            status: "pending",
            stripe_charge_id,
            teacher_name: "Mock Teacher",
            teacher_email: "teacher@example.com",
          });

          memory.transactions.push({
            id: genId("txn"),
            user_id: userId,
            teacher_id: teacherId,
            session_id: null,
            amount_paid: amount,
            timestamp: nowIso(),
            status: "succeeded",
          });

          const successUrl = body.success_url ?? `${globalThis.location?.origin ?? ""}/?checkout=success`;
          const url = `${successUrl}${successUrl.includes("?") ? "&" : "?"}mockStripe=1`;

          return { data: { url, session_id: genId("cs_mock") }, error: null };
        }

        if (name === "request-payout") {
          return { data: { status: "ok" }, error: null };
        }

        if (name === "create-connect-link" || name === "create-connect-account") {
          const returnUrl = opts?.body?.return_url ?? `${globalThis.location?.origin ?? ""}/dashboard/teacher/earnings`;
          return { data: { url: returnUrl }, error: null };
        }

        return { data: null, error: new Error(`[MockSupabase] Function not mocked: ${name}`) };
      },
    },
  };
}

export type MockSupabaseClient = ReturnType<typeof createMockSupabaseClient>;
