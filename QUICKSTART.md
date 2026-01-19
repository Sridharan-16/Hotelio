# Quick Start Guide

Get your Hotel Reservation Platform up and running in minutes!

## Prerequisites

- Node.js (v14 or higher) - [Download](https://nodejs.org/)
- MongoDB (local installation or MongoDB Atlas account)

## Installation Steps

### 1. Install Dependencies

```bash
# Install all dependencies (root, server, and client)
npm run install-all
```

Or install separately:
```bash
# Root dependencies
npm install

# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the `server` directory:

```bash
cd server
touch .env
```

Add the following content to `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hotel-reservation
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**For MongoDB Atlas users:**
Replace `MONGODB_URI` with your Atlas connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hotel-reservation
```

### 3. Start MongoDB

**Local MongoDB:**
```bash
# Windows
net start MongoDB

# macOS (using Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**MongoDB Atlas:**
- No local setup needed! Just use your connection string in `.env`

### 4. Seed Sample Data (Optional)

Populate your database with sample hotels:

```bash
cd server
npm run seed
```

This will add 5 sample hotels to your database.

### 5. Start the Application

**Option 1: Run Both Together (Recommended)**
```bash
# From root directory
npm run dev
```

**Option 2: Run Separately**

Terminal 1 - Backend Server:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend Client:
```bash
cd client
npm start
```

### 6. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## First Steps

1. **Register an Account**
   - Click "Sign Up" in the navigation
   - Fill in your details
   - You'll be automatically logged in

2. **Search for Hotels**
   - Use the search bar on the home page
   - Enter a city (e.g., "Mumbai", "Goa", "Bangalore")
   - Select check-in and check-out dates
   - Click "Search"

3. **View Hotel Details**
   - Click on any hotel card
   - Browse amenities, images, and room types
   - Select a room type

4. **Make a Booking**
   - Click "Book Now" on the hotel detail page
   - Fill in guest information
   - Confirm your booking

5. **View Your Bookings**
   - Click "My Bookings" in the navigation
   - View all your reservations
   - Cancel bookings if needed

## Troubleshooting

### MongoDB Connection Error
- **Local MongoDB:** Ensure MongoDB service is running
- **MongoDB Atlas:** Check your connection string and network access settings
- Verify your `.env` file has the correct `MONGODB_URI`

### Port Already in Use
- **Port 5000 (Backend):** Change `PORT` in `server/.env`
- **Port 3000 (Frontend):** React will prompt to use a different port, or set it in `client/package.json`

### CORS Errors
- CORS is already configured in the server
- Ensure the proxy is set in `client/package.json` (already done)

### Module Not Found Errors
- Run `npm install` in the respective directory (server or client)
- Delete `node_modules` and `package-lock.json`, then reinstall

## Next Steps

- Add more hotels using the seed script or MongoDB directly
- Customize the UI colors and styling
- Add payment integration
- Implement email notifications
- Add hotel reviews and ratings system
- Implement admin panel for hotel management

## Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Review the API endpoints in the README
- Check the code comments for implementation details

Happy Booking! 🏨

