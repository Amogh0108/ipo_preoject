# 🚀 Starting the IPO Management Platform

## ✅ Dependencies Installed Successfully!

Both backend and frontend dependencies have been installed.

## 📋 Before Starting

### 1. Start MongoDB

**You need MongoDB running first!**

Open a **new terminal** and run:

```bash
# Windows
mongod

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

To verify MongoDB is running:
```bash
mongosh
# If it connects, MongoDB is running!
# Type 'exit' to close
```

### 2. Configure Environment Variables

Edit the `.env` file (already created from .env.example):

**Minimum required:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ipo_platform
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production
```

**Optional (for market data features):**
- Get free API keys:
  - Alpha Vantage: https://www.alphavantage.co/support/#api-key
  - Finnhub: https://finnhub.io/register
  - Polygon: https://polygon.io/

## 🎯 Start the Servers

### Option 1: Manual Start (Recommended for Development)

**Terminal 1 - Backend:**
```bash
npm run dev
```
✅ Backend will run on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
✅ Frontend will run on http://localhost:3000

### Option 2: Docker (Easiest)

If you have Docker installed:
```bash
docker-compose up --build
```
✅ Everything starts automatically!

## 🌐 Access the Application

Once both servers are running:

1. **Open your browser:** http://localhost:3000
2. **Create an account:** Click "Sign Up"
3. **Start exploring!**

## 🔍 Verify Everything is Working

### Check Backend Health
Open: http://localhost:5000/api/health

Should return:
```json
{"success": true, "message": "Server is running"}
```

### Check Frontend
Open: http://localhost:3000

You should see the login page.

## 🎨 What You Can Do

### As a User:
1. ✅ Register/Login
2. ✅ Browse IPOs
3. ✅ Apply for IPOs
4. ✅ Track applications
5. ✅ View market data
6. ✅ Check dashboard

### As an Admin:
First, make yourself an admin:

```bash
mongosh
use ipo_platform
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
exit
```

Then you can:
1. ✅ Create IPOs
2. ✅ Update IPOs
3. ✅ Delete IPOs
4. ✅ Manage applications
5. ✅ View all transactions

## 📊 Add Sample Data

To test the platform, add a sample IPO:

```bash
mongosh
use ipo_platform

db.ipos.insertOne({
  companyName: "Tech Innovations Ltd",
  symbol: "TECH",
  priceRange: { min: 100, max: 120 },
  lotSize: 100,
  openDate: new Date(),
  closeDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  status: "active",
  totalShares: 1000000,
  minInvestment: 10000,
  description: "Leading technology company specializing in AI and cloud solutions",
  sector: "Technology",
  createdAt: new Date(),
  updatedAt: new Date()
})

exit
```

Refresh the IPOs page to see it!

## 🐛 Troubleshooting

### MongoDB Connection Error
**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
1. Make sure MongoDB is running: `mongod`
2. Check if MongoDB is already running: `ps aux | grep mongod` (Mac/Linux) or Task Manager (Windows)
3. Try connecting: `mongosh`

### Port Already in Use
**Error:** `EADDRINUSE: address already in use`

**Solution:**
1. Change PORT in `.env` to 5001
2. Or kill the process:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:5000 | xargs kill -9
   ```

### Frontend Won't Start
**Error:** Various npm errors

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Can't See Any IPOs
**Solution:**
1. Add sample data (see above)
2. Or create IPO via admin panel (make yourself admin first)

## 📱 Test the Platform

### Quick Test Flow:
1. ✅ Register a new account
2. ✅ Go to IPOs page
3. ✅ Click on an IPO
4. ✅ Apply for it
5. ✅ Check "My Applications"
6. ✅ View Dashboard
7. ✅ Try Market Data (enter: AAPL)

## 🧪 Run Tests

In a new terminal:
```bash
npm test
```

## 📚 Next Steps

- **API Testing:** Import `postman_collection.json` into Postman
- **Documentation:** Read `API_DOCUMENTATION.md`
- **Database:** Check `DATABASE_SCHEMA.md`
- **Features:** Review `FEATURES_CHECKLIST.md`

## 🎉 You're All Set!

The platform is now running. Enjoy exploring!

**Need help?** Check `SETUP_GUIDE.md` for detailed troubleshooting.

---

**Quick Links:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health
