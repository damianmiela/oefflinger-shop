# Oefflinger Deployment

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
