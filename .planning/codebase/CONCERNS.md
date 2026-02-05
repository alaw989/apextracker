# Concerns: Apex Tracker

**Analyzed:** 2026-02-04

## Critical Issues

### Security

**Hardcoded API Key** - `src/App.js:20`
```javascript
myHeaders.append("TRN-Api-Key", "05e6eb8f-3e95-4fbb-a2b5-b0f4dbb124c9");
```
- API key exposed in client-side code
- Should use environment variable (`process.env.REACT_APP_API_KEY`)
- Key may be revoked/abused

**CORS Proxy Dependency** - `src/App.js:47`
- Relies on third-party Heroku app (`fathomless-mesa-94824.herokuapp.com`)
- No control over proxy uptime/availability
- Potential security risk (all traffic through unknown proxy)

## Technical Debt

### Outdated Dependencies

| Package | Current | Latest | Status |
|---------|---------|--------|--------|
| React | 16.11.0 | 18.x+ | Major versions behind |
| React DOM | 16.11.0 | 18.x+ | Major versions behind |
| Bootstrap | 4.3.1 | 5.x+ | Major version behind |
| styled-components | 4.4.0 | 6.x+ | Major versions behind |

**Risks:** Security vulnerabilities, missing features, deprecated APIs

### Code Quality

**Global Window Access** - `src/App.js:140, 145`
```javascript
getData(window.input_search.value);
```
- Direct DOM manipulation breaks React patterns
- Should use `useState` for input value
- Fragile to DOM structure changes

**Magic Numbers** - `src/App.js:159-164`
```javascript
index === 1 ? setplatformCode(5)
  : index === 0 ? setplatformCode(1)
  : index === 2 ? setplatformCode(2)
```
- Platform codes should be constants
- No mapping between icon index and platform

**Console.log in Production** - Multiple locations
- Debugging statements left in code
- Should use proper logging library or remove

**Commented-out Code** - `src/App.js:134-136`
```javascript
// useEffect(() => {
//   getData();
// }, []);
```

### Error Handling

**Generic Error Message** - `src/components/Error.js`
- No specific error details shown to user
- Console-only error logging
- No retry mechanism
- No distinction between network errors, not found, etc.

**Empty Catch Block** - `src/App.js:127-131`
```javascript
.catch(function() {
  console.log("error");
  setError("1");
  setLoading(false);
});
```

## Performance

**Unconditional Re-renders** - Animation logic
- `animateCount` triggers full re-render animation
- May cause unnecessary DOM updates

**Image Assets**
- Large legend background images in source
- No optimization or lazy loading
- Could use WebP format

## Maintainability

**No Tests**
- Only default CRA test exists
- No component tests, integration tests, or E2E tests
- Risk of regressions during changes

**Mixed Responsibilities**
- `App.js` is 275 lines with multiple concerns
- Data fetching, state management, UI, animation all mixed

**No TypeScript**
- Plain JavaScript with no type checking
- Props not validated (PropTypes not used)
- Risk of runtime errors from undefined props

## Accessibility

**No ARIA Labels** - Platform icons, search button lack labels

**Keyboard Navigation** - Limited keyboard support (only Enter key on input)

**Color Contrast** - Red overlay may have contrast issues

## Architecture Concerns

**Single File State** - All state in `App.js`
- Difficult to scale
- No state management library for complex flows
- Props drilling deeply nested

**No Routing** - Single page only
- Can't bookmark player profiles
- Can't share links to specific stats

**Caching**
- No client-side caching of API responses
- Every search hits the API
- Could use localStorage or React Query
