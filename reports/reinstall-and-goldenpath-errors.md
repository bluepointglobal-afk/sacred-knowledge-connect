# SacredChain — Clean reinstall + dev + golden path (Feb 2, 2026)

Repo: `/Users/architect/.openclaw/workspace/03_REPOS/Sacredchain/sacred1`
Node: `v25.5.0` (darwin arm64)

## 1) Clean reinstall (as requested)
Command:
```bash
rm -rf node_modules package-lock.json && npm install --foreground-scripts
```

### Remaining install-time errors (exact stack trace)
During install, `fsevents` postinstall ran twice (2.3.2 and 2.3.3) and failed both times:

```
> fsevents@2.3.2 install
> node-gyp rebuild

...
gyp: binding.gyp not found (cwd: /Users/architect/.openclaw/workspace/03_REPOS/Sacredchain/sacred1/node_modules/fsevents) while trying to load binding.gyp
gyp ERR! configure error 
gyp ERR! stack Error: `gyp` failed with exit code: 1
gyp ERR! stack at ChildProcess.<anonymous> (/opt/homebrew/lib/node_modules/npm/node_modules/node-gyp/lib/configure.js:317:18)
gyp ERR! stack at ChildProcess.emit (node:events:508:20)
gyp ERR! stack at ChildProcess._handle.onexit (node:internal/child_process:293:12)
gyp ERR! System Darwin 24.3.0
gyp ERR! command "/opt/homebrew/Cellar/node/25.5.0/bin/node" "/opt/homebrew/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js" "rebuild"
gyp ERR! cwd /Users/architect/.openclaw/workspace/03_REPOS/Sacredchain/sacred1/node_modules/fsevents
gyp ERR! node -v v25.5.0
gyp ERR! node-gyp -v v12.1.0
gyp ERR! not ok

> fsevents@2.3.3 install
> node-gyp rebuild

...
gyp: binding.gyp not found (cwd: /Users/architect/.openclaw/workspace/03_REPOS/Sacredchain/sacred1/node_modules/vite/node_modules/fsevents) while trying to load binding.gyp
gyp ERR! configure error 
gyp ERR! stack Error: `gyp` failed with exit code: 1
gyp ERR! stack at ChildProcess.<anonymous> (/opt/homebrew/lib/node_modules/npm/node_modules/node-gyp/lib/configure.js:317:18)
gyp ERR! stack at ChildProcess.emit (node:events:508:20)
gyp ERR! stack at ChildProcess._handle.onexit (node:internal/child_process:293:12)
gyp ERR! System Darwin 24.3.0
gyp ERR! command "/opt/homebrew/Cellar/node/25.5.0/bin/node" "/opt/homebrew/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js" "rebuild"
gyp ERR! cwd /Users/architect/.openclaw/workspace/03_REPOS/Sacredchain/sacred1/node_modules/vite/node_modules/fsevents
gyp ERR! node -v v25.5.0
gyp ERR! node-gyp -v v12.1.0
gyp ERR! not ok
```

Despite that, `npm install` completed and the app runs.

## 2) Rerun dev server
Command:
```bash
npm run dev
```
Output:
```
VITE v5.4.21  ready in 391 ms

➜  Local:   http://localhost:8080/
➜  Network: http://192.168.31.161:8080/
```

## 3) Golden path (user perspective)
### Landing
- OK

### Browse teachers
URL: `/teachers`
- UI result: **Failed to load teachers**
- Browser console errors:
  - `Failed to load resource: net::ERR_NAME_NOT_RESOLVED`
  - URL: `https://wmhieeqtuewvagwrphte.supabase.co/rest/v1/teacher_profiles?...`

### Browse bundles
URL: `/bundles`
- UI result: **Failed to load bundles**
- Browser console errors:
  - `Failed to load resource: net::ERR_NAME_NOT_RESOLVED`
  - URL: `https://wmhieeqtuewvagwrphte.supabase.co/rest/v1/bundles?...`

### Signup / login
- `/login` UI loads, but end-to-end auth can’t be validated with Supabase unreachable.

## 4) Summary of remaining blockers
1) **Supabase hostname not resolvable** from this environment (`ERR_NAME_NOT_RESOLVED`). This blocks teachers/bundles/auth and therefore booking and checkout.
2) Install-time **fsevents node-gyp** failures (non-fatal here, but noisy and suggests Node 25 / dependency mismatch).

