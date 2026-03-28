# plsrv-config

Modern server configurator web app for primeLine test deployments.

## What the app does

- Configure server components (CPU, memory, storage, PCIe, network, service)
- Show a live BOM summary and pricing totals
- Export configuration as JSON and PDF
- Admin area for manual price management
- Admin area for server image management (front/rear)
- Dark/light theme support

## Tech stack

- React + TypeScript
- Vite
- Tailwind CSS
- React Router

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Azure Static Web Apps settings

Use these values in Azure:

- Build preset: React (or Custom)
- App location: `.`
- API location: (empty)
- Output location: `dist`

## Notes

- Admin and pricing/image data are currently stored in browser localStorage.
- This is good for testing, but not shared across users.
- For shared multi-user data, add a backend (for example Azure Functions + storage/database).
