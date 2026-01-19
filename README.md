# Hotelio - Premium Hotel Booking Platform

A modern, full-stack hotel booking platform built with MongoDB, Express, React, and Node.js - Hotelio offers a seamless hotel reservation experience.

## Features

- 🔍 **Hotel Search & Filtering**: Search hotels by city, filter by price, rating, and amenities
- 📅 **Date Selection**: Easy check-in/check-out date picker
- 👥 **Guest Management**: Select number of adults, children, and rooms
- 🏨 **Hotel Details**: Comprehensive hotel information with images, amenities, and policies
- 📝 **Booking System**: Complete booking flow with guest information
- 👤 **User Authentication**: Secure user registration and login
- 📋 **My Bookings**: View and manage all your bookings
- ❌ **Booking Cancellation**: Cancel bookings with automatic room availability update
- 🎨 **Modern UI**: Beautiful, responsive design with smooth animations

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation

### Frontend
- **React** 18
- **React Router** for navigation
- **Axios** for API calls
- **React DatePicker** for date selection
- **React Icons** for icons
- **React Toastify** for notifications

## Project Structure

```
hotelio/
├── server/
│   ├── models/
│   │   ├── Hotel.js
│   │   ├── Booking.js
│   │   └── User.js
│   ├── routes/
│   │   ├── hotels.js
│   │   ├── bookings.js
│   │   └── auth.js
│   ├── middleware/
│   │   └── auth.js
│   ├── index.js
│   └── package.json
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Step 1: Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Step 2: Environment Setup

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hotel-reservation
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### Step 3: Start MongoDB

Make sure MongoDB is running on your system. If using MongoDB Atlas, update the `MONGODB_URI` in `.env`.

### Step 4: Run the Application

#### Option 1: Run Both Server and Client Together
```bash
# From root directory
npm run dev
```

#### Option 2: Run Separately

Terminal 1 (Server):
```bash
cd server
npm run dev
```

Terminal 2 (Client):
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Hotels
- `GET /api/hotels` - Get all hotels with filters
- `GET /api/hotels/:id` - Get single hotel details
- `GET /api/hotels/cities/list` - Get list of cities

### Bookings
- `POST /api/bookings` - Create a new booking (protected)
- `GET /api/bookings` - Get user's bookings (protected)
- `GET /api/bookings/:id` - Get single booking (protected)
- `PUT /api/bookings/:id/cancel` - Cancel a booking (protected)

## Sample Data

You can add sample hotels to MongoDB using the following structure:

```javascript
{
  name: "Grand Hotel",
  description: "A luxurious hotel in the heart of the city",
  address: {
    street: "123 Main Street",
    city: "Mumbai",
    state: "Maharashtra",
    zipCode: "400001",
    country: "India"
  },
  images: [
    { url: "https://example.com/image1.jpg", alt: "Hotel exterior" }
  ],
  rating: 4.5,
  reviewCount: 120,
  amenities: ["WiFi", "Parking", "Pool", "Restaurant", "Gym"],
  rooms: [
    {
      type: "Deluxe",
      price: 5000,
      available: 10,
      maxGuests: 2,
      amenities: ["AC", "TV", "Mini Bar"]
    }
  ],
  policies: {
    checkIn: "14:00",
    checkOut: "11:00",
    cancellation: "Free cancellation until 24 hours before check-in"
  }
}
```

## Features in Detail

### Search & Filter
- Search by city or hotel name
- Filter by price range
- Filter by minimum rating
- Sort by rating, price, or name

### Booking Flow
1. Search for hotels
2. View hotel details
3. Select room type and dates
4. Enter guest information
5. Confirm booking
6. View booking in "My Bookings"

### User Management
- Secure registration with password hashing
- JWT-based authentication
- Protected routes for bookings
- User profile management

## Development

### Adding New Features

1. **Backend**: Add routes in `server/routes/`, models in `server/models/`
2. **Frontend**: Add components in `client/src/components/`, pages in `client/src/pages/`

### Code Style
- Use ES6+ features
- Follow React best practices
- Use async/await for API calls
- Implement proper error handling

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access for MongoDB Atlas

### Port Already in Use
- Change PORT in `.env` for server
- Change port in `client/package.json` for React (default: 3000)

### CORS Issues
- CORS is enabled in the server
- Ensure proxy is set in `client/package.json`

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

