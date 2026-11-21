# StudioSpace

**Live Site:** https: https://studiospace-client-nine-neon.vercel.app

StudioSpace is a peer-to-peer marketplace for creators to discover, list, and reserve creative spaces, including photography studios, film stages, podcast lounges, music suites, and creative workshops.

## Features

- **Explore Studios:** Discover and search creative spaces with category filters, detailed descriptions, host information, amenities, and featured listings.
- **User Authentication:** Register and sign in using Better Auth with email/password or Google OAuth.
- **Studio Management:** Create, edit, and delete your own studio listings with image URL or ImgBB image upload support.
- **Booking System:** Request studio reservations, manage booking requests, confirm reservations as a host, and cancel pending bookings.
- **Booking Conflict Prevention:** Prevent overlapping confirmed reservations for the same studio.
- **Wishlist:** Save favorite studios to a MongoDB-powered wishlist.
- **Dark & Light Mode:** Switch between persistent light and dark themes.
- **Responsive Design:** Fully responsive interface for desktop, tablet, and mobile devices.
- **User Experience:** Custom loading states, toast notifications, empty states, and a custom 404 page.

## Tech Stack

**Frontend:**
- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Lucide React Icons
- Swiper

**Backend & Database:**
- Node.js
- Express.js 5
- MongoDB
- Better Auth
- JSON Web Token (JWT)
- HTTPOnly Cookie Authentication

**Additional Tools:**
- React Hot Toast
- ImgBB API
- Google OAuth

## Local Installation & Setup

### Prerequisites

- Node.js installed
- MongoDB database
- Git

### 1. Clone the Repositories

Clone both client and server repositories into sibling folders.

```bash
git clone YOUR_CLIENT_GITHUB_REPOSITORY_URL studiospace-client
git clone YOUR_SERVER_GITHUB_REPOSITORY_URL studiospace-server
```

### 2. Setup Backend

Navigate to the server folder:

```bash
cd studiospace-server
npm install
```

Create a `.env` file from `.env.example` and configure your environment variables.

```env
PORT=5000
MONGODB_URL=your_mongodb_connection_string
MONGODB_DB=studiospace
CLIENT_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:5000
BETTER_AUTH_SECRET=your_better_auth_secret
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
IMGBB_API_KEY=your_imgbb_api_key
EXAMINER_EMAIL=examiner@studiospace.test
EXAMINER_PASSWORD=your_examiner_password
```

Start the backend development server:

```bash
npm run dev
```

### 3. Setup Frontend

Open another terminal and navigate to the client folder:

```bash
cd studiospace-client
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the Next.js development server:

```bash
npm run dev
```

Open your browser and visit:

http://localhost:3000

### 4. Examiner Test Credentials

To create the examiner account, configure `EXAMINER_EMAIL` and `EXAMINER_PASSWORD` in the server `.env` file and run:

```bash
npm run seed:examiner
```

**Demo Credentials:**

| Field | Value |
|---|---|
| Email | `examiner@studiospace.test` |
| Password | `StudioSpace#2026` |

**Note:** Change the example password before using a public production database.

## Environment Variables

**Server:**
- `MONGODB_URL`
- `MONGODB_DB`
- `PORT`
- `CLIENT_URL`
- `BETTER_AUTH_URL`
- `BETTER_AUTH_SECRET`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `IMGBB_API_KEY`
- `EXAMINER_EMAIL`
- `EXAMINER_PASSWORD`

**Client:**
- `NEXT_PUBLIC_API_URL`

## Deployment

- **Backend:** Deployed on Render using `npm start`.
- **Frontend:** Deployed on Vercel.
- Configure all required environment variables on the respective deployment platforms.
- Set the server's `CLIENT_URL` to the exact deployed Vercel origin.
- Set the client's `NEXT_PUBLIC_API_URL` to the deployed backend API URL.
- Configure the Google OAuth redirect URI for the deployed Better Auth server.
- Use HTTPS in production for secure HTTPOnly session cookies.

## Security

- Never commit `.env` or `.env.local` files.
- Never expose MongoDB credentials, API keys, or authentication secrets.
- Use strong production secrets and secure cookie settings.

## Author

Developed as part of the StudioSpace project.
