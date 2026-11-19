# StudioSpace

**Live site:** https://your-studiospace.vercel.app (replace this with the deployed client URL)

StudioSpace is a peer-to-peer marketplace for creators to discover, list, and reserve photography studios, film stages, podcast lounges, music suites, and creative workshops.

## Features

- Discover and search creative studios with category filters, studio details, host information, amenities, and featured listings.
- Register and sign in with Better Auth email/password or Google OAuth; passwords are validated for uppercase, lowercase, and minimum length.
- Create, edit, and delete host-owned studio listings with image URL or ImgBB upload support.
- Request studio bookings, prevent overlapping confirmed reservations, manage host confirmations, and cancel pending reservations.
- Save favorite studios to a MongoDB wishlist and switch between persistent light and dark themes.
- Responsive Next.js App Router interface with branded loading states, toast feedback, empty states, and a custom 404 page.

## Tech stack

- Next.js App Router, React, TypeScript, Tailwind CSS, Lucide icons, Swiper.
- Better Auth with MongoDB adapter and Google OAuth.
- Express 5 REST API, MongoDB, signed JWTs in HTTPOnly cookies.
- React Hot Toast for action feedback; ImgBB for image uploads.

## Local setup

1. Clone the client and server repositories into sibling folders.
2. In `studiospace-server`, run `npm install`, copy `.env.example` to `.env`, and fill in MongoDB, Better Auth, JWT, and optional Google/ImgBB credentials.
3. In `studiospace-client`, run `npm install`, copy `.env.example` to `.env.local`, and set `NEXT_PUBLIC_API_URL=http://localhost:5000`.
4. Start the API with `npm run dev` in the server folder.
5. Start Next.js with `npm run dev` in the client folder, then open http://localhost:3000.
6. For the examiner account, set `EXAMINER_EMAIL` and `EXAMINER_PASSWORD` in the server `.env`, then run `npm run seed:examiner`. Default demo values: `examiner@studiospace.test` / `StudioSpace#2026`. Change the password before using a public production database.

## Environment variables

Server: `MONGODB_URL`, `MONGODB_DB`, `PORT`, `CLIENT_URL`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `JWT_SECRET`, optional `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `IMGBB_API_KEY`, `EXAMINER_EMAIL`, and `EXAMINER_PASSWORD`.

Client: `NEXT_PUBLIC_API_URL`.

## Deployment

- Deploy `studiospace-server` to Render (start command: `npm start`) and configure all server environment variables.
- Deploy `studiospace-client` to Vercel and set `NEXT_PUBLIC_API_URL` to the deployed API origin.
- Set `CLIENT_URL` on the API to the exact Vercel origin. Use HTTPS in production so the API can set the secure, cross-site HTTPOnly session token cookie.
- Configure the Google OAuth redirect URI to the Better Auth callback URL for the deployed API.
- Never commit `.env`, `.env.local`, API keys, database credentials, or production secrets.
