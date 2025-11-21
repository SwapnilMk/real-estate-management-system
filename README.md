# Real Estate Management System

- **Frontend Live URL:** [https://real-estate-management-web.vercel.app/](https://real-estate-management-web.vercel.app/)
- **Backend Live URL:** [https://real-estate-management-system-n0p9.onrender.com/api/v1/](https://real-estate-management-system-n0p9.onrender.com/api/v1/)

## Project Description

A comprehensive web application for a real estate agency, built using the MERN stack (MongoDB, Express.js, React, Node.js). This application facilitates property management for agents and property discovery for clients, featuring secure authentication, real-time updates, and a responsive design.

## Features

### 1. Agent Management

- **Authentication**: Secure sign-up and login functionality.
- **Property Management**: Create, edit, and delete property listings with image uploads.
- **Dashboard**: View comprehensive statistics and a list of managed properties.
- **Client Insights**: View a list of clients who have favorited or expressed interest in properties.

### 2. Client Management

- **Authentication**: Secure sign-up and login functionality.
- **Property Search**: Advanced search filters for location, price, and property type.
- **Wishlist**: Save properties to a personal wishlist.
- **Interests**: Express interest in specific properties and track inquiry status.
- **Profile**: Manage personal profile and password.

### 3. General Features

- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Property Details**: Detailed views with images, descriptions, and agent contact info.
- **Similar Properties**: Recommendations based on the current property view.
- **Contact Form**: General inquiry form for users to contact the agency.

## Tech Stack

- **Frontend**: React (Vite), TypeScript, Redux Toolkit (State Management), Tailwind CSS (Styling), Shadcn UI (Components).
- **Backend**: Node.js, Express.js, TypeScript.
- **Database**: MongoDB (with Mongoose ODM).
- **Authentication**: JWT (JSON Web Tokens) with Refresh Token rotation.
- **Image Storage**: Cloudinary.
- **Email Service**: Nodemailer (SMTP).

## Folder Structure

```
real-estate-management-system/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── assets/         # Static assets
│   │   ├── components/     # Reusable UI components
│   │   ├── features/       # Redux slices (auth, etc.)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Application pages (Agent, Client, Public)
│   │   ├── services/       # RTK Query API definitions
│   │   ├── store/          # Redux store configuration
│   │   ├── types/          # TypeScript type definitions
│   │   ├── App.tsx         # Main App component
│   │   └── main.tsx        # Entry point
│   ├── .env                # Environment variables (gitignored)
│   └── vite.config.ts      # Vite configuration
│
├── server/                 # Backend application
│   ├── src/
│   │   ├── config/         # Configuration (DB, CORS, Env)
│   │   ├── controllers/    # Request handlers
│   │   ├── middlewares/    # Auth, Upload, Error handling
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   ├── app.ts          # Express app setup
│   │   └── server.ts       # Server entry point
│   ├── .env                # Environment variables (gitignored)
│   └── package.json        # Backend dependencies
│
└── README.md               # Project documentation
```

## Installation Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (Local or Atlas URI)
- Cloudinary Account (for image uploads)
- SMTP Server Details (for emails)

### 1. Clone the Repository

```bash
git clone https://github.com/SwapnilMk/real-estate-management-system.git
cd real-estate-management-system
```

### 2. Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with the following variables:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/real-estate # Or your Atlas URI
FRONTEND_URL=http://localhost:5173
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password
EMAIL_FROM=noreply@example.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run the server:

```bash
npm run dev
```

### 3. Frontend Setup

Navigate to the client directory and install dependencies:

```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_BASE_URL=/api/v1
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

Run the client:

```bash
npm run dev
```

Access the application at `http://localhost:5173`.

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password/:token` - Reset password

### Properties

- `GET /api/v1/properties` - Get all properties (Public)
- `GET /api/v1/properties/:id` - Get property details (Public)
- `GET /api/v1/properties/similar/:id` - Get similar properties (Public)
- `GET /api/v1/properties/saved` - Get user's saved properties (Client)
- `POST /api/v1/properties/wishlist/:id` - Add to wishlist (Client)
- `DELETE /api/v1/properties/wishlist/:id` - Remove from wishlist (Client)
- `POST /api/v1/properties` - Create property (Agent)
- `PUT /api/v1/properties/:id` - Update property (Agent)
- `DELETE /api/v1/properties/:id` - Delete property (Agent)
- `DELETE /api/v1/properties/bulk` - Bulk delete properties (Agent)
- `GET /api/v1/properties/agent/stats` - Get dashboard stats (Agent)
- `GET /api/v1/properties/agent/properties` - Get agent's properties (Agent)
- `GET /api/v1/agent/favorites` - Get properties favorited by clients (Agent)

### Interests

- `POST /api/v1/properties/:id/interest` - Express interest in a property (Client)
- `GET /api/v1/client/interests` - Get client's interests (Client)
- `GET /api/v1/agent/interests` - Get interests on agent's properties (Agent)
- `PATCH /api/v1/agent/interests/:id` - Update interest status (Agent)
- `DELETE /api/v1/interests/:id` - Delete an interest (Shared)

### Users

- `GET /api/v1/users` - Get all users (Agent)
- `PUT /api/v1/users/profile` - Update profile
- `POST /api/v1/users/change-password` - Change password

### Contact

- `POST /api/v1/contact` - Submit contact form (Public)
- `GET /api/v1/contacts` - Get contact messages (Agent)
