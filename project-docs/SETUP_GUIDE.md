# Complete Setup Guide

## Prerequisites

Before starting, ensure you have the following installed:

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version`

2. **MongoDB** (v5 or higher)
   - Download from: https://www.mongodb.com/try/download/community
   - Verify: `mongod --version`

3. **npm** (comes with Node.js)
   - Verify: `npm --version`

4. **Git** (optional, for version control)
   - Download from: https://git-scm.com/

## Step 1: Clone or Download the Project

```bash
# If using Git
git clone <repository-url>
cd ipo-management-platform

# Or download and extract the ZIP file
```

## Step 2: Backend Setup

### 2.1 Install Backend Dependencies

```bash
npm install
```

### 2.2 Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` file with your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ipo_platform
JWT_SECRET=your_super_secret_jwt_key_here_change_this
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here_change_this
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# External API Keys (Get free keys from these services)
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
FINNHUB_API_KEY=your_finnhub_key
POLYGON_API_KEY=your_polygon_key

NODE_ENV=development
```

### 2.3 Get API Keys (Free)

1. **Alpha Vantage** (Stock Market Data)
   - Visit: https://www.alphavantage.co/support/#api-key
   - Click "Get Your Free API Key Today"
   - Fill the form and get your key

2. **Finnhub** (Company Profiles & IPO Calendar)
   - Visit: https://finnhub.io/register
   - Sign up for free account
   - Get API key from dashboard

3. **Polygon.io** (Market Status)
   - Visit: https://polygon.io/
   - Sign up for free account
   - Get API key from dashboard

### 2.4 Start MongoDB

```bash
# On Windows
mongod

# On macOS/Linux
sudo systemctl start mongod
# or
brew services start mongodb-community
```

### 2.5 Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Backend should now be running on `http://localhost:5000`

## Step 3: Frontend Setup

### 3.1 Navigate to Frontend Directory

```bash
cd frontend
```

### 3.2 Install Frontend Dependencies

```bash
npm install
```

### 3.3 Configure Frontend Environment (Optional)

Create `frontend/.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3.4 Start Frontend Development Server

```bash
npm start
```

Frontend should now be running on `http://localhost:3000`

## Step 4: Verify Installation

### 4.1 Test Backend API

Open browser or use curl:

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"success": true, "message": "Server is running"}
```

### 4.2 Test Frontend

Open browser and navigate to:
```
http://localhost:3000
```

You should see the IPO Platform login page.

## Step 5: Create Admin User (Optional)

To create an admin user, you can either:

### Option 1: Using MongoDB Shell

```bash
mongosh
use ipo_platform

db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWEHaSuu", // password123
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Option 2: Register via API and Update Role

1. Register a new user via the frontend or API
2. Update the user's role in MongoDB:

```bash
mongosh
use ipo_platform
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

## Step 6: Seed Sample Data (Optional)

Create a seed script or manually add IPOs via MongoDB:

```javascript
// In MongoDB shell
use ipo_platform

db.ipos.insertMany([
  {
    companyName: "Tech Innovations Ltd",
    symbol: "TECH",
    priceRange: { min: 100, max: 120 },
    lotSize: 100,
    openDate: new Date("2024-01-15"),
    closeDate: new Date("2024-01-20"),
    listingDate: new Date("2024-01-25"),
    status: "active",
    totalShares: 1000000,
    minInvestment: 10000,
    description: "Leading technology company",
    sector: "Technology",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    companyName: "Green Energy Corp",
    symbol: "GREEN",
    priceRange: { min: 200, max: 250 },
    lotSize: 50,
    openDate: new Date("2024-02-01"),
    closeDate: new Date("2024-02-05"),
    status: "upcoming",
    totalShares: 500000,
    minInvestment: 10000,
    description: "Renewable energy solutions",
    sector: "Energy",
    createdAt: new Date(),
    updatedAt: new Date()
  }
])
```

## Step 7: Running Tests

### Backend Tests

```bash
# From root directory
npm test

# With coverage
npm test -- --coverage
```

### Frontend Tests

```bash
# From frontend directory
cd frontend
npm test
```

## Step 8: Docker Setup (Alternative)

If you prefer using Docker:

### 8.1 Install Docker

- Download from: https://www.docker.com/get-started

### 8.2 Build and Run with Docker Compose

```bash
# From root directory
docker-compose up --build
```

This will start:
- MongoDB on port 27017
- Backend on port 5000
- Frontend on port 3000

## Troubleshooting

### MongoDB Connection Error

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
1. Ensure MongoDB is running: `mongod`
2. Check MongoDB URI in `.env` file
3. Try: `mongodb://127.0.0.1:27017/ipo_platform`

### Port Already in Use

**Error:** `EADDRINUSE: address already in use`

**Solution:**
1. Change port in `.env` (backend) or `package.json` (frontend)
2. Or kill the process using the port:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -ti:5000 | xargs kill -9
   ```

### API Key Errors

**Error:** API returns 401 or 403

**Solution:**
1. Verify API keys are correct in `.env`
2. Check API key limits (free tiers have rate limits)
3. Ensure no extra spaces in `.env` file

### Module Not Found

**Error:** `Cannot find module`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Default Credentials

After setup, you can create a test account:

- Email: test@example.com
- Password: password123

Or use the admin account if you created one.

## Next Steps

1. Explore the API documentation: `API_DOCUMENTATION.md`
2. Review database schema: `DATABASE_SCHEMA.md`
3. Import Postman collection: `postman_collection.json`
4. Start building features!

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review error logs in terminal
3. Check MongoDB logs
4. Verify all environment variables are set correctly

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in `.env`
2. Use strong JWT secrets
3. Enable HTTPS
4. Use MongoDB Atlas or managed database
5. Set up proper CORS configuration
6. Enable rate limiting
7. Set up monitoring and logging
8. Use environment-specific API keys

Enjoy building with the IPO Management Platform! 🚀
