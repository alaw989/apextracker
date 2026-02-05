# Testing: Apex Tracker

**Analyzed:** 2026-02-04

## Test Framework

**Framework:** Create React App default (Jest + React Testing Library)
**Script:** `npm test`

## Test Coverage

| Component | Test File | Coverage |
|-----------|-----------|----------|
| App | `src/App.test.js` | Default CRA test only |
| All other components | None | No tests |

## Existing Tests

**App.test.js:** Default CRA placeholder test
```javascript
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
```

## Testing Gaps

**No tests for:**
- Component rendering
- User interactions (search, platform selection)
- API fetching/mocking
- Error handling
- Animation behavior
- Responsive behavior
- State changes

## Recommendations

1. **Add component tests** for:
   - Input component (platform selection, username entry)
   - StatCard rendering
   - FavCard rendering
   - Error display

2. **Mock API calls** for:
   - `getData()` function
   - Error scenarios
   - Loading states

3. **Test user flows:**
   - Complete search flow
   - Platform switching
   - Error recovery

4. **Consider adding:**
   - Integration tests for full search flow
   - Snapshot tests for component output
   - Accessibility tests (a11y)

## Mocking Strategy

For API testing, mock:
- `global.fetch` or use MSW (Mock Service Worker)
- Tracker.gg API responses
- Error responses
