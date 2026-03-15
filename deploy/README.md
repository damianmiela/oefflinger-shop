# Oefflinger Deployment

## Migrate WordPress (local → production)

If production has a fresh WordPress and you want to copy products, plugins, and content from local:

```powershell
.\deploy\migrate-wordpress.ps1
```

Requires: local Docker running (mysql + wordpress), SSH access to server, `.env` with MySQL passwords.

### Fix product descriptions (encoding corruption)

If descriptions got corrupted during migration (artifacts, truncated text):

```powershell
.\deploy\sync-product-descriptions.ps1
```

Re-syncs only `post_content` and `post_excerpt` from local products to production.

---

## Initial Server Setup (one-time)

1. Deploy (first push creates `.env` from `.env.example` if missing):
   ```bash
   git push deploy master
   ```

2. **Important**: After first deploy, set strong passwords:
   ```bash
   ssh root@91.98.112.186
   nano /srv/oefflinger/.env   # Set MYSQL_ROOT_PASSWORD, MYSQL_PASSWORD, WP_ADMIN_PASSWORD
   chmod 600 /srv/oefflinger/.env
   cd /srv/oefflinger/docker && docker compose -f docker-compose.prod.yml up -d --build
   ```

## Deploy (after initial setup)

```bash
git push deploy master
```

The post-receive hook will build and restart the containers.

## Access

- Frontend: http://91.98.112.186:4000
- WordPress: http://91.98.112.186:4001
- WordPress Admin: http://91.98.112.186:4001/wp-admin
