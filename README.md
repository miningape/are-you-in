# RUN / Are You In?

`RUN` is a phonetic acronymn based on the phrase "Are You In?" in reference to the question commonly asked by co-workers to see if they should be in the office today.

## Running locally

You will need:

1. Auth0 Account (https://auth0.com/)[https://auth0.com/]
2. Postgres database (Set up a local database)[https://www.sqlshack.com/setting-up-a-postgresql-database-on-mac/]

Then copy the file `.env.example` and rename it to `.env.local`. Fill in the entries for the Auth0 credentials and the database/postgres URL.

Instructions:

1. Run these commands to start the server

```bash
pnpm install        # Install dependencies
pnpm prisma db push # Migrate database schema
pnpm dev            # Start the server on `http://localhost:3000`
```

2. (Optional) After logging in, put your email into (`prisma/seed.ts`) and run the seed script `pnpm ts-node prisma/seed.ts`. This will add a bit of data to your workspace, making it easier to test.

# Todo

## MVP

- [x] Are you in?
  - [x] Are you in today?
  - [x] Overview
- [x] Workspace settings
- [x] Members settings
- [x] User settings
- [x] Make today view nicer
- [x] Auto-deny at
  - [x] Authentication
  - [x] Set status
- [ ] Mobile
  - [ ] Test / Update all components to be mobile friendly
  - [ ] PWA integration
  - [ ] Push notifications
- [ ] Verify /setup after nextui introduction
- [ ] Invite flow
  - [x] Create auth entry
  - [x] Invite user modal
  - [ ] Send invite email
  - [ ] Set user name / role in modal
- [ ] Deploy!
  - [x] Github Repo
  - [ ] Vercel
    - [ ] Postgres
    - [ ] App Hosting / Link to repo
  - [ ] Configure auth0
  - [ ] Domain

## V1

- [ ] Sorting and improving user experience for larger orgs
  - [ ] Departments / Titles / Teams
- [ ] Integrations
  - [ ] Slack
    - [ ] Daily message
    - [ ] Report from app
  - [ ] Teams
    - [ ] Daily message
    - [ ] Report from app
- [ ] Upload photos
- [ ] Metrics and graphs
