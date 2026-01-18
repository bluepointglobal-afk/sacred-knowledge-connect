# Claude Debug Prompts for Navigation Issues

Use these prompts when working with Claude in VS Code to debug navigation problems.

---

## PROMPT 1: Initial Test Failure Analysis

```
I'm running navigation tests on SacredChain and getting failures. Here's the test output:

[PASTE TEST OUTPUT]

And here's my USER_FLOWS.md that defines expected behavior:

[PASTE RELEVANT SECTION FROM USER_FLOWS.md]

Please:
1. Identify which specific navigation step is failing
2. List the files that likely need to be checked (router, page components, auth context)
3. Don't fix yet - first let's trace through the code to understand what's happening
```

---

## PROMPT 2: Trace the Navigation Path

```
Let's trace the navigation from [START_PAGE] to [END_PAGE].

Expected flow: [DESCRIBE EXPECTED]
Actual behavior: [DESCRIBE WHAT HAPPENS]

Please:
1. Show me the router configuration for these routes
2. Check if there are any redirects or guards in between
3. Verify the Link/navigate calls in the components
4. Check if auth state could be affecting this
```

---

## PROMPT 3: Fix and Verify

```
We identified the issue: [DESCRIBE ISSUE]

Please:
1. Implement the fix
2. Explain what was wrong
3. Run the navigation test to verify: npm run test:nav
4. If it fails again, let's look at the new error
```

---

## PROMPT 4: After Making Changes

```
I just made changes to [FILE]. Before I test manually, please:

1. Check if these changes could break any other navigation paths in USER_FLOWS.md
2. Run the full navigation test suite
3. If anything fails, tell me before I waste time manually testing
```

---

## PROMPT 5: Pre-Commit Check

```
I'm about to commit. Please:

1. Run: npm run test:nav
2. If all pass, I'm good to commit
3. If any fail, show me which flow is broken and let's fix before committing
```

---

## PROMPT 6: Add Test for New Feature

```
I'm adding a new feature: [DESCRIBE FEATURE]

The navigation flow should be:
[DESCRIBE NEW FLOW]

Please:
1. Add this to USER_FLOWS.md
2. Create a new test in the appropriate spec file
3. Run the test to see if current implementation supports it
4. If it fails, help me implement the navigation
```

---

## PROMPT 7: Debug Redirect Loop

```
I'm getting a redirect loop. The browser keeps bouncing between [URL1] and [URL2].

Please check:
1. Auth context - is the auth state stable or flickering?
2. Protected route logic - what condition triggers the redirect?
3. Any useEffect hooks that might be causing re-renders
4. React Query invalidation that might reset auth state
```

---

## PROMPT 8: Element Not Found

```
Test says it can't find element: [SELECTOR]

The test expects this element on page: [PAGE]

Please:
1. Check if the component renders this element
2. Check if it's conditional (loading state, auth state, data state)
3. Check if the selector/testId matches what's in the code
4. Suggest the correct selector if it changed
```
