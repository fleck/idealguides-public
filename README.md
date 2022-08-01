# Making better how to's and buying guides

### Migrating production database

- Add production database connection string to .env.production.local
- run `NODE_ENV=production blitz prisma migrate deploy`
- Disable DATABASE_URL in .env.production.local to ensure no accidental modification of production DB happens!
