# Food Delivery Frontend

This folder contains the React client for the food delivery application. It provides food browsing, authentication, cart management, and order history views.

## Requirements

- Node.js 18 or newer
- The backend API running locally or an accessible deployed API

## Setup

From this folder, install the dependencies:

```bash
npm install
```

The client defaults to the local backend at `http://localhost:10000`. To use another API URL, create a `.env` file in the `frontend` folder:

```env
REACT_APP_API_URL=https://your-api.example.com
```

## Available Scripts

```bash
npm start
```

Runs the development server at [http://localhost:3000](http://localhost:3000).

```bash
npm test
```

Runs the test suite in interactive watch mode.

```bash
npm run build
```

Creates an optimized production build in the `build` folder.

## Application Routes

| Route | View |
| --- | --- |
| `/` | Food catalog and home page |
| `/Login` | User login |
| `/Register` | User registration |
| `/Myorder` | Order history |

Cart state is shared through the `CartProvider` context. API requests use Axios and the backend URL configured in `src/Apipath.js`.

## Project Structure

```text
frontend/
├── public/                 # Static files and HTML template
├── src/
│   ├── components/         # Navbar, footer, cards, and cart context
│   ├── pages/              # Home, login, registration, cart, and orders
│   ├── Apipath.js          # Backend API URL configuration
│   ├── App.js              # Application routes and providers
│   └── index.js            # React entry point
├── build/                  # Production output
└── package.json
```

## Running With the Backend

1. Start the backend from `backend` with `npm start`.
2. Start the frontend from `frontend` with `npm start`.
3. Open `http://localhost:3000` in a browser.
