# Project Structure

```
ipo-management-platform/
│
├── 📁 backend/                          # Backend Node.js/Express application
│   ├── 📁 config/
│   │   └── database.js                  # MongoDB connection configuration
│   │
│   ├── 📁 controllers/                  # Request handlers (business logic)
│   │   ├── applicationController.js     # IPO application operations
│   │   ├── authController.js            # Authentication operations
│   │   ├── ipoController.js             # IPO CRUD operations
│   │   ├── marketDataController.js      # External API data fetching
│   │   └── transactionController.js     # Transaction management
│   │
│   ├── 📁 middleware/                   # Express middleware
│   │   ├── auth.js                      # JWT authentication & authorization
│   │   ├── errorHandler.js              # Global error handling
│   │   ├── rateLimiter.js               # API rate limiting
│   │   └── validator.js                 # Input validation rules
│   │
│   ├── 📁 models/                       # MongoDB schemas (Mongoose)
│   │   ├── Application.js               # IPO application schema
│   │   ├── IPO.js                       # IPO listing schema
│   │   ├── Transaction.js               # Transaction schema
│   │   └── User.js                      # User account schema
│   │
│   ├── 📁 routes/                       # API route definitions
│   │   ├── applicationRoutes.js         # /api/applications/*
│   │   ├── authRoutes.js                # /api/auth/*
│   │   ├── ipoRoutes.js                 # /api/ipos/*
│   │   ├── marketDataRoutes.js          # /api/market-data/*
│   │   └── transactionRoutes.js         # /api/transactions/*
│   │
│   ├── 📁 services/                     # External service integrations
│   │   └── marketDataService.js         # Alpha Vantage, Finnhub, Polygon APIs
│   │
│   ├── 📁 utils/                        # Helper utilities
│   │   └── jwt.js                       # JWT token generation/verification
│   │
│   └── server.js                        # Express app entry point
│
├── 📁 frontend/                         # React frontend application
│   ├── 📁 public/
│   │   └── index.html                   # HTML template
│   │
│   ├── 📁 src/
│   │   ├── 📁 components/               # Reusable React components
│   │   │   └── Navbar.js                # Navigation bar component
│   │   │
│   │   ├── 📁 context/                  # React Context API
│   │   │   └── AuthContext.js           # Authentication state management
│   │   │
│   │   ├── 📁 pages/                    # Page components (routes)
│   │   │   ├── Applications.js          # My applications page
│   │   │   ├── Dashboard.js             # User dashboard
│   │   │   ├── IPODetails.js            # Single IPO detail & apply
│   │   │   ├── IPOList.js               # Browse all IPOs
│   │   │   ├── Login.js                 # Login page
│   │   │   ├── MarketData.js            # Real-time market data
│   │   │   └── Register.js              # Registration page
│   │   │
│   │   ├── 📁 services/                 # API client services
│   │   │   └── api.js                   # Axios instance & API methods
│   │   │
│   │   ├── App.js                       # Main app component & routing
│   │   ├── index.css                    # Global styles (Tailwind)
│   │   └── index.js                     # React entry point
│   │
│   ├── Dockerfile                       # Frontend container config
│   ├── package.json                     # Frontend dependencies
│   ├── postcss.config.js                # PostCSS configuration
│   └── tailwind.config.js               # TailwindCSS configuration
│
├── 📁 tests/                            # Test files
│   ├── auth.test.js                     # Authentication API tests
│   └── ipo.test.js                      # IPO API tests
│
├── 📄 .env.example                      # Environment variables template
├── 📄 .gitignore                        # Git ignore rules
├── 📄 API_DOCUMENTATION.md              # Complete API reference
├── 📄 DATABASE_SCHEMA.md                # Database structure documentation
├── 📄 docker-compose.yml                # Multi-container Docker setup
├── 📄 Dockerfile                        # Backend container config
├── 📄 jest.config.js                    # Jest testing configuration
├── 📄 package.json                      # Backend dependencies
├── 📄 postman_collection.json           # Postman API collection
├── 📄 PROJECT_STRUCTURE.md              # This file
├── 📄 PROJECT_SUMMARY.md                # Comprehensive project overview
├── 📄 QUICK_START.md                    # 5-minute setup guide
├── 📄 README.md                         # Main project documentation
└── 📄 SETUP_GUIDE.md                    # Detailed setup instructions
```

## File Count Summary

### Backend
- **Controllers:** 5 files
- **Middleware:** 4 files
- **Models:** 4 files
- **Routes:** 5 files
- **Services:** 1 file
- **Utils:** 1 file
- **Config:** 1 file
- **Entry:** 1 file (server.js)
- **Total Backend:** 22 files

### Frontend
- **Components:** 1 file
- **Context:** 1 file
- **Pages:** 7 files
- **Services:** 1 file
- **Core:** 3 files (App.js, index.js, index.css)
- **Config:** 3 files
- **Total Frontend:** 16 files

### Tests
- **Test Files:** 2 files

### Documentation
- **Docs:** 7 markdown files
- **Config:** 5 files (.env.example, .gitignore, jest.config.js, package.json, postman_collection.json)
- **Docker:** 3 files (Dockerfile, frontend/Dockerfile, docker-compose.yml)
- **Total Root:** 15 files

### Grand Total
**55+ files** organized in a clean, scalable structure

## Key Directories Explained

### `/backend`
Contains all server-side code including API endpoints, database models, authentication logic, and external service integrations.

### `/frontend`
React application with components, pages, routing, and API client. Uses TailwindCSS for styling.

### `/tests`
Automated tests for backend APIs using Jest and Supertest.

## Architecture Pattern

The project follows the **MVC (Model-View-Controller)** pattern with additional layers:

```
Request Flow:
Client → Routes → Middleware → Controllers → Services → Models → Database
                     ↓
                 Response
```

### Layers:
1. **Routes** - Define API endpoints
2. **Middleware** - Authentication, validation, rate limiting
3. **Controllers** - Business logic and request handling
4. **Services** - External API integrations
5. **Models** - Database schema and operations
6. **Utils** - Helper functions

## Technology Stack by Directory

### Backend Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcryptjs
- **Validation:** express-validator
- **Security:** Helmet, CORS, Rate Limiting
- **Testing:** Jest, Supertest

### Frontend Stack
- **Framework:** React 18
- **Styling:** TailwindCSS
- **Routing:** React Router v6
- **HTTP:** Axios
- **State:** React Query + Context API
- **UI:** React Hot Toast, Recharts

## Scalability Considerations

### Horizontal Scaling
- Stateless API design (JWT tokens)
- No server-side sessions
- Docker containerization
- Load balancer ready

### Vertical Scaling
- Efficient database queries
- Indexed collections
- Compression middleware
- Optimized bundle sizes

### Microservices Ready
- Modular architecture
- Service-based structure
- Independent deployability
- API gateway compatible

## Security Layers

```
Security Stack:
├── Rate Limiting (API level)
├── Helmet (HTTP headers)
├── CORS (Cross-origin)
├── JWT Authentication (Route level)
├── Role Authorization (Controller level)
├── Input Validation (Middleware)
└── Password Hashing (Model level)
```

## Development Workflow

```
Development:
1. Edit code in /backend or /frontend
2. Auto-reload with nodemon/react-scripts
3. Test with Jest or manual testing
4. Commit changes

Production:
1. Build frontend: npm run build
2. Set NODE_ENV=production
3. Deploy with Docker or traditional hosting
4. Monitor logs and performance
```

## Best Practices Implemented

✅ Separation of concerns
✅ DRY (Don't Repeat Yourself)
✅ SOLID principles
✅ RESTful API design
✅ Error handling at all levels
✅ Input validation
✅ Security best practices
✅ Performance optimization
✅ Comprehensive documentation
✅ Clean code structure

This structure supports easy maintenance, testing, and scaling as the application grows.
