# Specification

## Summary
**Goal:** Let users quickly toggle the Gallery view between only usable creations and all creation records, while keeping navigation consistent via a URL-persisted filter state.

**Planned changes:**
- Add a clearly labeled usability filter control (English text, e.g., “Usable only”) to the Gallery page.
- Update the Gallery grid to immediately reflect the filter state (show only `record.usable === true` when enabled; otherwise show all records from `useGetAllCreationRecords()`), without a full page reload.
- Persist the filter state in the URL as a query parameter (e.g., `?usableOnly=1`) and preserve it when navigating from Gallery to Creation Detail.
- On Creation Detail, use the same URL filter state when resolving the record index so the opened record matches the clicked Gallery item; show the existing “Creation Not Found” empty-state if the index is out of range under the selected filter.

**User-visible outcome:** Users can toggle “Usable only” on the Gallery to filter creations instantly, and when opening a creation and navigating details, the selected filter remains applied via the URL so the correct item is shown.
