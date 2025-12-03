# Quick Start Guide

Get the IPO Management Platform running in 5 minutes!

## Prerequisites Check

```bash
node --version    # Should be v16+
npm --version     # Should be v8+
mongod --version  # Should be v5+
```

If any command fails, install the missing software first.

## 1. Install Backend Dependencies (30 seconds)

```bash
npm install
```

## 2. Setup Environment (1 minute)

```bash
# Copy environment template
cp .env.example .env
```

Edit `.env` and add your API keys:
- Get Alpha Vantage key: https://www.alphavantage.co/support/#api-key
- Get Finnhub key: https://finnhub.io/register
- Get Polygon key: https://polygon.io/

**Minimum required .env:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ipo_platform
JWT_SECRET=my_super_secret_jwt_key_12345
JWT_REFRESH_SECRET=my_super_secret_refresh_key_12345
```

## 3. Start MongoDB (10 seconds)

```bash
# Windows
mongod

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

## 4. Start Backend (10 seconds)

```bash
npm run dev
```

✅ Backend running at http://localhost:5000

## 5. Setup Frontend (1 minute)

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

✅ Frontend running at http://localhost:3000

## 6. Create Your Account

1. Open http://localhost:3000
2. Click "Sign Up"
3. Fill in your details
4. Start exploring!

## Test the Platform

### Create a Test IPO (Admin Only)

First, make yourself an admin:

```bash
# In MongoDB shell
mongosh
use ipo_platform
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
exit
```

Then create an IPO via the API or MongoDB:

```javascript
// In MongoDB shell
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
  description: "Leading technology company",
  sector: "Technology",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Apply for an IPO

1. Go to "IPOs" page
2. Click on an active IPO
3. Fill in quantity and bid price
4. Submit application
5. Check "My Applications" to see status

## Docker Quick Start (Alternative)

If you have Docker installed:

```bash
docker-compose up --build
```

That's it! Everything runs automatically.

## Troubleshooting

### MongoDB not starting?
```bash
# Check if MongoDB is already running
ps aux | grep mongod

# Or try connecting
mongosh
```

### Port already in use?
```bash
# Change PORT in .env to 5001 or any available port
```

### Can't connect to backend?
- Check if backend is running on http://localhost:5000/api/health
- Verify MongoDB is running
- Check .env file has correct MONGODB_URI

## Next Steps

1. ✅ Explore the dashboard
2. ✅ Browse IPOs
3. ✅ Apply for IPOs
4. ✅ Check market data
5. ✅ View your applications

## Need Help?

- 📖 Full setup guide: `SETUP_GUIDE.md`
- 📚 API documentation: `API_DOCUMENTATION.md`
- 🗄️ Database schema: `DATABASE_SCHEMA.md`
- 📦 Postman collection: `postman_collection.json`

## Default Test Credentials

After registration, you can create a test account:
- Email: test@example.com
- Password: password123

Enjoy! 🚀
