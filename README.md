# Marketplace

A production-grade, responsive e-commerce marketplace built with **Angular 22** (standalone components, signals) and **Angular Material** (Material 3), ready to deploy on **Azure Static Web Apps**.

## Features

- Home page with hero banner, category grid, featured products and promo banner
- Product catalog with search, category/price/rating filters and sorting
- Product detail page with image gallery, quantity selector, tabs and related products
- Persistent shopping cart (localStorage) with live totals, tax and free-shipping threshold
- Multi-step checkout (shipping → payment → review) using Angular Reactive Forms
- Mock authentication (sign up / sign in) and order history, stored locally
- Fully responsive layout, custom Material 3 theme, sticky header with search & cart badge

## Tech stack

- Angular 22 (standalone APIs, signals, new `@if`/`@for` control flow)
- Angular Material 3 theming (`violet`/`orange` palette)
- RxJS + Angular Signals for state (cart, auth, orders, product filters)
- SCSS with a shared design system (`src/styles.scss`)

## Getting started

```bash
npm install
npm start        # ng serve, http://localhost:4200
npm run build    # production build to dist/marketplace/browser
npm test         # unit tests (Vitest)
```

## Project structure

```
src/app/
  core/
    data/        # mock product & category data
    models/      # TypeScript interfaces
    services/    # ProductService, CartService, AuthService, OrderService, NotificationService
  shared/
    components/  # header, footer, product-card, star-rating
  features/
    home/, products/, cart/, checkout/, auth/, account/, not-found/
```

All routes are lazy-loaded via `loadComponent` in [src/app/app.routes.ts](src/app/app.routes.ts).

## Deploying to Azure

This repo is pre-configured for **Azure Static Web Apps** (the recommended, low-cost hosting option for an Angular SPA), including:

- [public/staticwebapp.config.json](public/staticwebapp.config.json) — SPA fallback routing + security headers
- [.github/workflows/azure-static-web-apps.yml](.github/workflows/azure-static-web-apps.yml) — CI/CD pipeline

### Option A — Azure Portal (recommended, auto-wires GitHub Actions)

1. Push this repository to GitHub.
2. In the [Azure Portal](https://portal.azure.com), create a new **Static Web App** resource.
3. Choose the **Free** or **Standard** plan, select your GitHub repo/branch.
4. Build details:
   - Build preset: `Angular`
   - App location: `/`
   - Output location: `dist/marketplace/browser`
5. Azure automatically commits a GitHub Actions workflow and injects `AZURE_STATIC_WEB_APPS_API_TOKEN` as a repo secret. Every push to the branch triggers a build & deploy.
6. If you prefer to reuse the workflow already included in this repo, just add the `AZURE_STATIC_WEB_APPS_API_TOKEN` secret manually (from the Static Web App's "Manage deployment token" blade) and delete the auto-generated duplicate workflow.

### Option B — Azure CLI

```bash
az login
az group create --name rg-marketplace --location eastus2

az staticwebapp create \
  --name swa-marketplace \
  --resource-group rg-marketplace \
  --source https://github.com/<your-org>/<your-repo> \
  --branch main \
  --app-location "/" \
  --output-location "dist/marketplace/browser" \
  --login-with-github
```

This provisions the Static Web App and wires up the same GitHub Actions deployment automatically.

### Option C — SWA CLI (manual/one-off deploy, no GitHub integration)

```bash
npm install -g @azure/static-web-apps-cli
npm run build
swa deploy dist/marketplace/browser --deployment-token <token-from-portal>
```

## Notes

- Product images are placeholder images from `picsum.photos` — swap `src/app/core/data/products.data.ts` for a real product API when ready.
- Auth/orders currently persist to `localStorage` for demo purposes; replace `AuthService`/`OrderService` with real API calls (e.g. Azure Functions/App Service backend) for production use.
