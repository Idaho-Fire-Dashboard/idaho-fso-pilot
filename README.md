# Idaho FSO Resource Coordination (pilot)

Web front end for the Idaho FSO Resource Coordination pilot, maintained by the Idaho Department of Lands, Bureau of Fire Management (ESF-4).

- **Site:** https://idaho-fire-dashboard.github.io/idaho-fso-pilot/
- **Simulation workspace:** add `?workspace=simulation` (default). **Operational records:** `?workspace=operational`.
- **Sign-in:** Google account approved by a System Admin. Access is checked on the server for every request.

## How it fits together

| Piece | Where | Notes |
|---|---|---|
| `index.html` | This repo (GitHub Pages) | The app. Contains no agency contacts, personnel or apparatus data. |
| `config.js` | This repo | Holds the backend address (`FSO_BACKEND_URL`). Change this file only if the backend is redeployed to a new URL. |
| Backend | Google Apps Script web app (private project) | Verifies Google sign-in, enforces roles, saves the shared workspaces, serves reference data after sign-in, and calls OpenRouteService for road routes. |
| Data | Google Drive folder owned by the backend account | `workspace-pilot.json`, `workspace-simulation.json`, `users.json`. Not shared. |

Migrated from the Cloudflare Worker pilot (`idaho-fso-pilot.terrygammel.workers.dev`) in November 2026 with the same functions, roles and data.

Contact: Terry Gammel, Fire Emergency Support Program Manager and ESF-4 Coordinator, Idaho Department of Lands.
