# MongoDB Connection Guide

This guide will help you set up and connect MongoDB to your Hotel Reservation Platform.

## MongoDB Connection Status

✅ **Your MongoDB is already connected!** The seed script successfully connected to MongoDB. The error you saw was just a validation issue with room types, which we've now fixed.

## Connection Methods

### Option 1: Local MongoDB (Recommended for Development)

#### Step 1: Install MongoDB

**Windows:**
1. Download MongoDB Community Server from [mongodb.com/download](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the setup wizard
3. MongoDB will install as a Windows service

**macOS (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install -y mongodb
```

#### Step 2: Start MongoDB Service

**Windows:**
```powershell
# Start MongoDB service
net start MongoDB

# Or if installed manually:
mongod --dbpath "C:\data\db"
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

#### Step 3: Verify MongoDB is Running

Open a new terminal and run:
```bash
mongosh
```

If you see the MongoDB shell prompt, you're connected!

#### Step 4: Configure Your .env File

Create `server/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hotel-reservation
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### Option 2: MongoDB Atlas (Cloud - Free Tier Available)

MongoDB Atlas is a cloud-hosted MongoDB service with a free tier perfect for development.

#### Step 1: Create MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (choose the FREE tier)

#### Step 2: Create Database User

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and password (save these!)
5. Set user privileges to "Atlas admin" or "Read and write to any database"

#### Step 3: Whitelist Your IP Address

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development) or add your specific IP
4. Click "Confirm"

#### Step 4: Get Connection String

1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

#### Step 5: Update Your .env File

Create `server/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/hotel-reservation?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

**Important:** Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your actual database user credentials.

## Testing the Connection

### Test 1: Run the Seed Script

```bash
cd server
npm run seed
```

You should see:
```
Connected to MongoDB
Cleared existing hotels
Inserted 5 hotels
Database connection closed
```

### Test 2: Start the Server

```bash
cd server
npm run dev
```

You should see:
```
MongoDB Connected
Server running on port 5000
```

### Test 3: Verify Data in MongoDB

**Using MongoDB Shell (mongosh):**
```bash
mongosh
use hotel-reservation
db.hotels.find().pretty()
```

**Using MongoDB Compass (GUI):**
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using your connection string
3. Browse to `hotel-reservation` database
4. View the `hotels` collection

## Common Connection Issues

### Issue 1: "MongoServerError: Authentication failed"

**Solution:**
- Check your username and password in the connection string
- Ensure the database user has proper permissions
- For Atlas: Make sure your IP is whitelisted

### Issue 2: "MongooseServerSelectionError: connect ECONNREFUSED"

**Solution:**
- Ensure MongoDB service is running
- Check if MongoDB is running on the default port (27017)
- Verify the connection string is correct

### Issue 3: "MongoNetworkError: getaddrinfo ENOTFOUND"

**Solution:**
- Check your internet connection (for Atlas)
- Verify the cluster hostname in the connection string
- Ensure DNS resolution is working

### Issue 4: Connection Timeout

**Solution:**
- Check firewall settings
- For Atlas: Verify IP whitelist includes your current IP
- Try connecting from a different network

## Connection String Formats

### Local MongoDB
```
mongodb://localhost:27017/hotel-reservation
```

### MongoDB Atlas
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hotel-reservation?retryWrites=true&w=majority
```

### MongoDB with Authentication (Local)
```
mongodb://username:password@localhost:27017/hotel-reservation
```

## Environment Variables

Your `server/.env` file should contain:

```env
# Server Port
PORT=5000

# MongoDB Connection String
# Local: mongodb://localhost:27017/hotel-reservation
# Atlas: mongodb+srv://user:pass@cluster.mongodb.net/hotel-reservation
MONGODB_URI=mongodb://localhost:27017/hotel-reservation

# JWT Secret (change this to a random string in production)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Environment
NODE_ENV=development
```

## Next Steps

1. ✅ Create `server/.env` file with your MongoDB connection string
2. ✅ Run `npm run seed` to populate sample data
3. ✅ Start your server with `npm run dev`
4. ✅ Verify connection in server logs

## Need Help?

- **MongoDB Documentation:** [docs.mongodb.com](https://docs.mongodb.com/)
- **Mongoose Documentation:** [mongoosejs.com](https://mongoosejs.com/)
- **MongoDB Atlas Docs:** [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com/)

Your MongoDB connection is working! The previous error was just a data validation issue, which is now fixed. 🎉

