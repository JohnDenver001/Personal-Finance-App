# ADR-001: Derived-Data State Management and Re-render Elimination

**Status:** Accepted  
**Date:** 2025  
**Domain:** Frontend / State Management

---

## Context

The Pulse frontend uses Zustand for global state across four stores
(`budget`, `transaction`, `auth`, `insight`).  During an architectural
review the following performance and correctness issues were identified:

### Issue 1 — Dual-store sync cascade (Critical)

`totalSpent` was stored in *both* `transactionStore` (computed via
`useTotalSpent`) and `budgetStore` (written via `setTotalSpent`).  The
Dashboard screen contained:

```tsx
useEffect(() => {
  setTotalSpent(totalSpent);
}, [totalSpent, setTotalSpent]);
```

This created a **re-render cascade** on every transaction mutation:

```
addTransaction()
  → transactionStore.transactions changes
  → useTotalSpent() recomputes
  → useEffect fires
  → budgetStore.setTotalSpent()
  → ALL budgetStore subscribers re-render
    (dashboard, profile, budget widgets)
```

Additionally, `add.tsx` independently called `addSpending(amount)`,
writing a *second* potentially inconsistent copy of the same value.

### Issue 2 — `useBudgetDerived()` unstable object reference (Critical)

```typescript
// Before — new object on every render call, no memoization
export const useBudgetDerived = (): BudgetDerived => {
  const { monthlyBudgetLimit, totalSpent } = useBudgetStore(); // full store
  return { remainingBudget, dailySafeToSpend, ... };           // new obj
};
```

Because the return value is always a new object reference, every
consumer re-renders on *any* store change, even unrelated ones (e.g.,
`isLoading` toggling).

### Issue 3 — Derived selectors without `useMemo` (High)

`useTotalSpent`, `useRecentTransactions`, and `useSpendingByCategory`
all subscribed to the full `transactions` array and ran O(n) filter/
reduce on **every render**, not just when transactions changed.
`monthStart` was also re-created as a `new Date()` inside the filter
predicate on every element.

### Issue 4 — Inline category lookup on every render (Medium)

`RecentTransactions` used `categories.find()` inside the render loop
(O(n×m)), creating a new closure on every render.

### Issue 5 — Missing `useCallback` on event handlers (Medium)

`profile.tsx` defined `handleSaveIncome`, `handleSaveBudget`, and
`handleAddCategory` as plain inline functions, guaranteeing new
references on every render and preventing child component memoization.

### Issue 6 — `getDisciplineScore` called with hardcoded values (Low)

The score was always partially `0.8 withinCategoryBudgets` and
`0.7 loggingConsistency`, making the score meaningless for real users.

---

## Decision Drivers

- Minimize unnecessary re-renders with zero behaviour change
- Single source of truth for all state
- Stable object references so `React.memo` and `useCallback` can work
- Keep store surface area small and easy to reason about

---

## Options Considered

### Option A: Keep `totalSpent` in `budgetStore`, add `useMemo` in `useBudgetDerived`
- ❌ Dual-source-of-truth problem remains
- ❌ Two write paths (`addSpending` + `setTotalSpent`) can diverge

### Option B: Remove `totalSpent` from `budgetStore` entirely; treat it as derived data ✅ (Chosen)
- ✅ Single source of truth: `transactionStore.transactions`
- ✅ Eliminates `useEffect` sync and cascade
- ✅ `budgetStore` becomes narrow: only `monthlyIncome` + `monthlyBudgetLimit`
- ✅ `useBudgetDerived(totalSpent)` accepts `totalSpent` explicitly → easy to test

### Option C: Zustand `subscribeWithSelector` middleware to cross-subscribe
- ❌ Adds middleware complexity without fixing the dual-state root cause

---

## Decision

Implement **Option B** with the following concrete changes:

### `src/stores/budget-store.ts`
- Remove `totalSpent` field from `BudgetState`
- Remove `setTotalSpent`, `addSpending`, `recalculate`, `resetMonthly` actions
- Change signature: `useBudgetDerived(totalSpent: number): BudgetDerived`
- Wrap body with `useMemo([totalSpent, monthlyBudgetLimit])` for stable reference
- Subscribe to `monthlyBudgetLimit` with a fine-grained selector, not full store

### `src/stores/transaction-store.ts`
- Wrap `useTotalSpent`, `useRecentTransactions`, `useSpendingByCategory` with `useMemo`
- Compute `monthStart` once inside the memo, not inside the filter predicate

### `app/(tabs)/index.tsx` (Dashboard)
- Delete the `useEffect` sync block
- Call `useTotalSpent()` and pass to `useBudgetDerived(totalSpent)`
- Use fine-grained selector: `useBudgetStore((s) => s.monthlyBudgetLimit)` instead of destructuring

### `app/(tabs)/add.tsx`
- Remove `addSpending` call and `useBudgetStore` import

### `src/hooks/use-budget.ts`
- Call `useTotalSpent()` for `totalSpent`
- Pass to `useBudgetDerived(totalSpent)` explicitly

### `src/components/dashboard/recent-transactions.tsx`
- Replace `categories.find()` per row with a `Map` built via `useMemo([categories])`
- O(n) build once per categories change, O(1) lookup per row

### `app/(tabs)/profile.tsx`
- Wrap `handleSaveIncome`, `handleSaveBudget`, `handleAddCategory` in `useCallback`

---

## Consequences

### Positive
- ✅ Adding a transaction now causes **exactly one** re-render cycle (transactionStore subscribers only)
- ✅ Budget widgets only re-render when `monthlyBudgetLimit` or computed `totalSpent` changes
- ✅ `RecentTransactions` category lookup: O(n) once on mount → O(1) per row
- ✅ `budgetStore` surface shrinks from 9 fields/actions to 4, making it easier to audit

### Negative / Trade-offs
- `useBudgetDerived` now requires a `totalSpent` argument — callers must
  obtain it from `useTotalSpent()` first.  This is an intentional API
  boundary that makes the data dependency explicit.

### Post-MVP work items
- Wire real `withinCategoryBudgets` ratio from per-category spending data
- Wire real `loggingConsistency` from `transactions` count vs days in month
- Implement `resetMonthly` logic in a monthly cron/background task when
  a real backend is introduced

---

## Re-render Impact Summary

| Scenario | Before | After |
|---|---|---|  
| Add transaction | transactionStore → useEffect → budgetStore → all budget widgets | transactionStore only |
| Change budget limit (Profile) | budgetStore (correct) | budgetStore (correct) |
| `useBudgetDerived` consumer render | New object every call | Stable ref; skips if inputs unchanged |
| `useRecentTransactions` render | filter+reduce every render | Cached until transactions changes |
| Category lookup (RecentTransactions) | O(n) find per row per render | O(1) Map lookup per row |
