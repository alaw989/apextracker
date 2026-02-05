# Integrations: Apex Tracker

**Analyzed:** 2026-02-04

## External APIs

### Apex Legends API (Tracker.gg)

**Base URL:** `https://public-api.tracker.gg/v2/apex/standard/profile/`

**Purpose:** Fetch player statistics, rank, and legend data

**Authentication:** Header-based API key
```javascript
myHeaders.append("TRN-Api-Key", "05e6eb8f-3e95-4fbb-a2b5-b0f4dbb124c9");
```

**Endpoints Used:**
- `/{platformCode}/{username}` - Get player profile data

**Platform Codes:**
- `1` - XBOX
- `2` - PSN
- `5` - Origin/PC

### CORS Proxy

**URL:** `https://fathomless-mesa-94824.herokuapp.com/`

**Purpose:** Proxy requests to Tracker.gg API to bypass CORS restrictions

**Implementation:** `src/App.js:47-53`
```javascript
const proxy_url = "https://fathomless-mesa-94824.herokuapp.com/";
const apiUrlWithCode =
  "https://public-api.tracker.gg/v2/apex/standard/profile/" +
  platformCode +
  "/";
const url = proxy_url + apiUrlWithCode;
```

## Static Assets

**External Image Source:** `https://d6d90m6b4vcx.cloudfront.net/` - Apex Legends rank icons and other game assets

**Local Images:** `src/images/` - Legend character backgrounds (pathfinder.jpg, bangalore.png, etc.)

## Data Flow

1. User enters username + selects platform
2. App constructs URL: `proxy_url + "apex/standard/profile/" + platformCode + "/" + username`
3. Fetch with TRN-Api-Key header
4. Response includes: player info, segments (legends), stats
5. Data transformed and displayed in StatCard and FavCard components

## Security Notes

- API key is hardcoded in `src/App.js:20` - should be moved to environment variable
- Heroku proxy is a third-party dependency with unknown uptime SLA
