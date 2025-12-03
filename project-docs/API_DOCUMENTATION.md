# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication Endpoints

### Register User
```
POST /auth/register
Content-Type: application/json

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "user": { "id", "name", "email", "role" },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### Login
```
POST /auth/login
Content-Type: application/json

Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "user": { "id", "name", "email", "role" },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### Refresh Token
```
POST /auth/refresh
Content-Type: application/json

Body:
{
  "refreshToken": "refresh_token"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_token"
  }
}
```

### Logout
```
POST /auth/logout
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Get Current User
```
GET /auth/me
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "success": true,
  "data": { "id", "name", "email", "role" }
}
```

## IPO Endpoints

### Get All IPOs
```
GET /ipos?status=active&page=1&limit=10&search=company
Response: 200 OK
{
  "success": true,
  "data": [...],
  "pagination": { "page", "limit", "total", "pages" }
}
```

### Get IPO by ID
```
GET /ipos/:id
Response: 200 OK
{
  "success": true,
  "data": { IPO object }
}
```

### Get Active IPOs
```
GET /ipos/active
Response: 200 OK
{
  "success": true,
  "data": [...]
}
```

### Get Upcoming IPOs
```
GET /ipos/upcoming
Response: 200 OK
{
  "success": true,
  "data": [...]
}
```

### Create IPO (Admin Only)
```
POST /ipos
Authorization: Bearer {accessToken}
Content-Type: application/json

Body:
{
  "companyName": "Tech Corp",
  "symbol": "TECH",
  "priceRange": { "min": 100, "max": 120 },
  "lotSize": 100,
  "openDate": "2024-01-01",
  "closeDate": "2024-01-07",
  "totalShares": 1000000,
  "minInvestment": 10000,
  "status": "active"
}

Response: 201 Created
```

### Update IPO (Admin Only)
```
PUT /ipos/:id
Authorization: Bearer {accessToken}
Content-Type: application/json

Body: { fields to update }
Response: 200 OK
```

### Delete IPO (Admin Only)
```
DELETE /ipos/:id
Authorization: Bearer {accessToken}
Response: 200 OK
```

## Application Endpoints

### Create Application
```
POST /applications
Authorization: Bearer {accessToken}
Content-Type: application/json

Body:
{
  "ipoId": "ipo_id",
  "quantity": 10,
  "bidPrice": 110
}

Response: 201 Created
{
  "success": true,
  "data": { application object }
}
```

### Get My Applications
```
GET /applications/my-applications?status=pending&page=1&limit=10
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "success": true,
  "data": [...],
  "pagination": { "page", "limit", "total", "pages" }
}
```

### Get Application by ID
```
GET /applications/:id
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "success": true,
  "data": { application object }
}
```

### Get All Applications (Admin Only)
```
GET /applications?status=pending&page=1&limit=10
Authorization: Bearer {accessToken}

Response: 200 OK
```

### Update Application Status (Admin Only)
```
PUT /applications/:id/status
Authorization: Bearer {accessToken}
Content-Type: application/json

Body:
{
  "status": "allotted",
  "allottedQuantity": 5
}

Response: 200 OK
```

## Transaction Endpoints

### Get My Transactions
```
GET /transactions/my-transactions?type=application&status=completed&page=1&limit=10
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "success": true,
  "data": [...],
  "pagination": { "page", "limit", "total", "pages" }
}
```

### Get Transaction by ID
```
GET /transactions/:id
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "success": true,
  "data": { transaction object }
}
```

### Get All Transactions (Admin Only)
```
GET /transactions?type=application&status=completed&page=1&limit=10
Authorization: Bearer {accessToken}

Response: 200 OK
```

## Market Data Endpoints

### Get Stock Quote
```
GET /market-data/quote/:symbol
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "success": true,
  "data": { quote data from Alpha Vantage }
}
```

### Get Company Profile
```
GET /market-data/profile/:symbol
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "success": true,
  "data": { profile data from Finnhub }
}
```

### Get Market Status
```
GET /market-data/market-status
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "success": true,
  "data": { market status from Polygon }
}
```

### Get IPO Calendar
```
GET /market-data/ipo-calendar?from=2024-01-01&to=2024-12-31
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "success": true,
  "data": { IPO calendar from Finnhub }
}
```

### Get Aggregated Market Data
```
GET /market-data/aggregated/:symbol
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "success": true,
  "data": {
    "quote": { data from Alpha Vantage },
    "profile": { data from Finnhub },
    "marketStatus": { data from Polygon },
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

## Error Responses

All endpoints may return the following error responses:

```
400 Bad Request
{
  "success": false,
  "error": "Error message"
}

401 Unauthorized
{
  "success": false,
  "message": "Not authorized to access this route"
}

403 Forbidden
{
  "success": false,
  "message": "User role is not authorized"
}

404 Not Found
{
  "success": false,
  "message": "Resource not found"
}

500 Internal Server Error
{
  "success": false,
  "error": "Server Error"
}
```

## Rate Limiting

- General API endpoints: 100 requests per 15 minutes
- Authentication endpoints: 5 requests per 15 minutes

## Authentication

Most endpoints require JWT authentication. Include the access token in the Authorization header:

```
Authorization: Bearer {accessToken}
```

Access tokens expire after 15 minutes. Use the refresh token endpoint to get a new access token.
