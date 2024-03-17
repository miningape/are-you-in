# RUN / Are You In?

`RUN` is a phonetic acronymn based on the question "Are You In?", which is commonly asked by co-workers to see if they should be in the office today.

This service is designed to provide a centralised answer to the question "Are you in?" allowing co-workers and managers to see who else is in the office today. The app is built as a [PWA](https://web.dev/explore/progressive-web-apps), allowing users to quickly and easily set their status for the day from their mobile devices, as well as providing push notifications. There will be automated slack and teams integrations, allowing user's to set and view statuses, as well as providing daily updates to shared channels. We plan on providing metrics and analytics on a team/employee/office level, allowing managers to gain a comprehensive overview of the usage of their coworking spaces.

## Running locally

You will need:

1. Auth0 Account ([https://auth0.com/](https://auth0.com/))
2. Postgres database ([Set up a local database](https://www.sqlshack.com/setting-up-a-postgresql-database-on-mac/))

Then copy the file `.env.example` and rename it to `.env.local`. Fill in the entries for the Auth0 credentials and the database/postgres URL.

Instructions:

1. Run these commands to start the server

```bash
pnpm install        # Install dependencies
pnpm prisma db push # Migrate database schema
pnpm dev            # Start the server on `http://localhost:3000`
```

2. (Optional) After logging in, put your email into (`prisma/seed.ts`) and run the seed script `pnpm ts-node prisma/seed.ts`. This will add a bit of data to your workspace, making it easier to test.

## Cron jobs

Cron jobs are run on 5 minute intervals to auto-deny and push notifications based on user settings.

They are currently hosted on [cron-job.org](cron-job.org).

The routes are:

```
GET /api/jobs/auto-deny
GET /api/jobs/push-notifications
```

Authentication scheme:

```
Authorization: Bearer <env.CRON_API_KEY>
```

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
- [x] Mobile
  - [x] Test / Update all components to be mobile friendly
  - [x] PWA integration
  - [x] Push notifications
- [x] Verify /setup after nextui introduction
- [ ] Invite flow
  - [x] Create auth entry
  - [x] Invite user modal
  - [ ] Send invite email
  - [ ] Set user name / role in modal
- [ ] Deploy!
  - [x] Github Repo
  - [x] Vercel
    - [x] Postgres
    - [x] App Hosting / Link to repo
  - [x] Configure auth0
  - [ ] Domain

## V1

- [ ] Landing Page
- [ ] Sorting and improving user experience for larger orgs
  - [ ] Departments / Titles / Teams
- [ ] Integrations
  - [ ] Slack
    - [ ] Daily message
    - [ ] Report from app
    - [ ] Set status
    - [ ] Backlink
  - [ ] Teams
    - [ ] Daily message
    - [ ] Report from app
    - [ ] Set status
    - [ ] Backlink
- [ ] Upload photos
- [ ] Metrics and graphs
- [ ] Mass invite users
  - [ ] By email
  - [ ] By domain

## Go-To-Market

- [ ] Marketing Materials
