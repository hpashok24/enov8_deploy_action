# Enov8 – Send Environment Instance Info (GitHub Action)

Send **System + Environment + Version** details to the **Enov8 Environment Instance API** from your GitHub workflows — securely via repository or environment-scoped secrets.

> This Action mirrors the “service connection” concept from Azure DevOps using **GitHub Secrets**.

---

## What it does

- Calls: `ENOV8_BASE_URL/api/environmentinstance`
- Payload:
  ```json
  {
    "System": "…",
    "Environment": "…",
    "Version": "…"
  }
  ```
- Auth headers:
  ```
  app-id:  <ENOV8_APP_ID>
  app-key: <ENOV8_APP_KEY>
  ```

---

## Inputs

| Name          | Required | Description                                                |
|---------------|----------|------------------------------------------------------------|
| `version`     | ✅       | Version string to record (e.g., `18.0.1`)                  |
| `system`      | ✅       | System name (e.g., `GDW`)                                  |
| `environment` | ✅       | Environment name (e.g., `Dev`, `UAT`, `Prod`)              |
| `app_id`      | ✅       | Enov8 App ID (store as a secret)                           |
| `app_key`     | ✅       | Enov8 App Key (store as a secret)                          |
| `enov8_url`   | ✅       | Base URL to your Enov8 instance (e.g., `https://…`)        |

> If your Enov8 endpoint also requires a `user-id` header for audit, add a `user_id` input and forward it in the request headers.

---

## Setup (Secrets)

Create secrets in your repository (or in an Environment like **production**):
- `ENOV8_APP_ID`
- `ENOV8_APP_KEY`
- `ENOV8_BASE_URL` (e.g., `https://enov8.mycompany.com`)

---

## Usage

### Minimal example

```yaml
name: Send Enov8 Update
on:
  workflow_dispatch:

jobs:
  notify-enov8:
    runs-on: ubuntu-latest
    steps:
      - name: Send Env Instance to Enov8
        uses: hpashok24/enov8-send-instance@v1
        with:
          version: "18.0.0"
          system: "GDW"
          environment: "Dev"
          app_id:  ${{ secrets.ENOV8_APP_ID }}
          app_key: ${{ secrets.ENOV8_APP_KEY }}
          enov8_url: ${{ secrets.ENOV8_BASE_URL }}
```

### Environment-scoped secrets (recommended for Prod)

```yaml
name: Send Enov8 Update (Prod)
on:
  workflow_dispatch:

jobs:
  notify-enov8:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Send Env Instance to Enov8
        uses: hpashok24/enov8-send-instance@v1
        with:
          version: "18.0.0"
          system: "GDW"
          environment: "Prod"
          app_id:  ${{ secrets.ENOV8_APP_ID }}
          app_key: ${{ secrets.ENOV8_APP_KEY }}
          enov8_url: ${{ secrets.ENOV8_BASE_URL }}
```

### Matrix example

```yaml
name: Enov8 Multi-Env Notify
on: { workflow_dispatch: {} }

jobs:
  notify:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        env: [Dev, UAT, Prod]
    steps:
      - name: Send ${{ matrix.env }} to Enov8
        uses: hpashok24/enov8-send-instance@v1
        with:
          version: ${{ github.sha }}
          system: "GDW"
          environment: ${{ matrix.env }}
          app_id:  ${{ secrets.ENOV8_APP_ID }}
          app_key: ${{ secrets.ENOV8_APP_KEY }}
          enov8_url: ${{ secrets.ENOV8_BASE_URL }}
```

---

## Troubleshooting

- **No response**: Verify `ENOV8_BASE_URL` and runner network access.
- **401/403**: Check credentials and that secrets are correctly referenced.
- **Request setup error**: Ensure all inputs are provided and names are correct (`environment` not `enivronment`).

---

## Development

```bash
npm install
npx @vercel/ncc build index.js -o dist
```

Commit the `dist/` output when updating the action.

---

## License

See [LICENSE](./LICENSE).
