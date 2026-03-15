# Deployment

Push to deploy:

```bash
git push deploy master
```

The post-receive hook builds and restarts containers automatically.

## First-time setup

1. Push to create `.env` from `.env.example` if missing.
2. On the server, edit `/srv/oefflinger/.env` and set strong passwords.
3. Redeploy: `git push deploy master`

## URLs

- Frontend: http://91.98.112.186:4000
- WordPress: http://91.98.112.186:4001
- Admin: http://91.98.112.186:4001/wp-admin

## Custom domain

If using a custom domain (e.g. https://oefflinger.de), add to `.env` before building:

- `NEXT_PUBLIC_WC_STORE_API`
- `NEXT_PUBLIC_WP_URL`
- `CORS_ALLOWED_ORIGINS`
