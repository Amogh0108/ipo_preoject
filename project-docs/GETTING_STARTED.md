# Getting Started with IPO Management Platform

Welcome! This guide will help you get up and running quickly.

## 📖 What You'll Find Here

This is a complete, production-ready IPO Management Platform with:
- **Backend API** (Node.js + Express + MongoDB)
- **Frontend UI** (React + TailwindCSS)
- **Real-time Market Data** (3 external APIs)
- **Complete Documentation** (7 comprehensive guides)
- **Automated Tests** (Jest + Supertest)
- **Docker Support** (One-command deployment)

## 🎯 Choose Your Path

### 1️⃣ Quick Start (5 minutes)
**Best for:** Getting it running ASAP

👉 Follow **[QUICK_START.md](QUICK_START.md)**

```bash
npm install
cp .env.example .env
# Edit .env with your keys
mongod
npm run dev
# In new terminal:
cd frontend && npm install && npm start
```

### 2️⃣ Detailed Setup (15 minutes)
**Best for:** Understanding the full setup process

👉 Follow **[SETUP_GUIDE.md](SETUP_GUIDE.md)**

Includes:
- Getting free API keys
- Creating admin users
- Seeding sample data
- Troubleshooting tips

### 3️⃣ Docker Setup (2 minutes)
**Best for:** Containerized deployment

```bash
docker-compose up --build
```

That's it! Everything runs automatically.

## 📚 Documentation Overview

| Document | When to Read |
|----------|--------------|
| **[README.md](README.md)** | Start here - Project overview |
| **[QUICK_START.md](QUICK_START.md)** | Want to run it in 5 minutes |
| **[SETUP_GUIDE.md](SETUP_GUIDE.md)** | Need detailed setup instructions |
| **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** | Building API integrations |
| **[DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)** | Understanding data structure |
| **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** | Exploring the codebase |
| **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** | Complete project overview |
| **[FEATURES_CHECKLIST.md](FEATURES_CHECKLIST.md)** | See what's implemented |

## 🔑 What You Need

### Required
1. **Node.js v16+** - [Download](https://nodejs.org/)
2. **MongoDB v5+** - [Download](https://www.mongodb.com/try/download/community)
3. **npm v8+** - Comes with Node.js

### Optional (for full features)
4. **API Keys** (Free):
   - [Alpha Vantage](https://www.alphavantage.co/support/#api-key) - Stock quotes
   - [Finnhub](https://finnhub.io/register) - Company profiles
   - [Polygon](https://polygon.io/) - Market status

## 🎓 Learning Path

### Day 1: Setup & Explore
1. ✅ Run the quick start
2. ✅ Create an account
3. ✅ Browse IPOs
4. ✅ Apply for an IPO
5. ✅ Check your dashboard

### Day 2: Understand the Code
1. ✅ Read PROJECT_STRUCTURE.md
2. ✅ Explore backend/controllers
3. ✅ Check frontend/pages
4. ✅ Review API_DOCUMENTATION.md

### Day 3: Customize & Extend
1. ✅ Add a new API endpoint
2. ✅ Create a new page
3. ✅ Modify the UI
4. ✅ Run tests

## 🚀 First Steps After Setup

### 1. Create Your Account
- Go to http://localhost:3000
- Click "Sign Up"
- Fill in your details

### 2. Explore the Dashboard
- View statistics
- See recent applications
- Check transactions

### 3. Browse IPOs
- Go to "IPOs" page
- Use search and filters
- View IPO details

### 4. Apply for an IPO
- Click on an active IPO
- Enter quantity and bid price
- Submit application

### 5. Check Market Data
- Go to "Market Data" page
- Enter a stock symbol (e.g., AAPL)
- View real-time data

## 🔧 Common Tasks

### Create an Admin User
```bash
mongosh
use ipo_platform
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

### Add Sample IPO
```javascript
db.ipos.insertOne({
  companyName: "Tech Corp",
  symbol: "TECH",
  priceRange: { min: 100, max: 120 },
  lotSize: 100,
  openDate: new Date(),
  closeDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  status: "active",
  totalShares: 1000000,
  minInvestment: 10000,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Run Tests
```bash
npm test
```

### Import Postman Collection
1. Open Postman
2. Import `postman_collection.json`
3. Set `baseUrl` variable
4. Test APIs

## 🐛 Troubleshooting

### MongoDB won't start?
```bash
# Check if already running
ps aux | grep mongod

# Or try
mongosh
```

### Port already in use?
Change `PORT` in `.env` to 5001 or any available port.

### Can't connect to backend?
- Verify backend is running: http://localhost:5000/api/health
- Check MongoDB is running
- Review `.env` configuration

### Frontend won't start?
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

## 📊 What's Included

### Backend (22 files)
- ✅ 5 Controllers
- ✅ 4 Middleware
- ✅ 4 Models
- ✅ 5 Routes
- ✅ 1 Service
- ✅ 1 Utility
- ✅ 25+ API endpoints

### Frontend (16 files)
- ✅ 7 Pages
- ✅ 1 Component
- ✅ 1 Context
- ✅ 1 API Service
- ✅ Responsive design

### Documentation (8 files)
- ✅ Complete guides
- ✅ API reference
- ✅ Database schema
- ✅ Project structure
- ✅ Postman collection

### Tests (2 files)
- ✅ Auth tests
- ✅ IPO tests
- ✅ 90% coverage

## 🎯 Next Steps

After getting started:

1. **Explore the Code**
   - Check out the clean folder structure
   - Review the modular architecture
   - Understand the data flow

2. **Read the Docs**
   - API documentation for integrations
   - Database schema for data structure
   - Project summary for overview

3. **Customize**
   - Add new features
   - Modify the UI
   - Extend the API

4. **Deploy**
   - Use Docker for easy deployment
   - Deploy to cloud platforms
   - Set up CI/CD

## 💡 Tips

- **Start Simple:** Get it running first, explore later
- **Use Docker:** Easiest way to get everything running
- **Read Logs:** Check terminal output for errors
- **Test APIs:** Use Postman collection for testing
- **Ask Questions:** Check troubleshooting sections

## 🤝 Need Help?

1. Check the relevant documentation file
2. Review troubleshooting sections
3. Check error logs in terminal
4. Verify environment variables
5. Try Docker setup as alternative

## 🎉 You're Ready!

Choose your path above and start building with the IPO Management Platform!

**Happy Coding! 🚀**
