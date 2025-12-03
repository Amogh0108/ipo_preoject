# Database Schema

## Collections

### users
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed, min: 6),
  role: String (enum: ['user', 'admin'], default: 'user'),
  refreshToken: String,
  createdAt: Date,
  updatedAt: Date
}

Indexes:
- email: 1 (unique)
```

### ipos
```javascript
{
  _id: ObjectId,
  companyName: String (required),
  symbol: String (required, unique, uppercase),
  priceRange: {
    min: Number (required),
    max: Number (required)
  },
  lotSize: Number (required),
  openDate: Date (required),
  closeDate: Date (required),
  listingDate: Date,
  status: String (enum: ['upcoming', 'active', 'closed', 'listed'], default: 'upcoming'),
  totalShares: Number (required),
  minInvestment: Number (required),
  description: String,
  sector: String,
  createdAt: Date,
  updatedAt: Date
}

Indexes:
- symbol: 1 (unique)
- status: 1
- openDate: 1, closeDate: 1
```

### applications
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  ipo: ObjectId (ref: 'IPO', required),
  quantity: Number (required, min: 1),
  bidPrice: Number (required),
  totalAmount: Number (required),
  status: String (enum: ['pending', 'approved', 'rejected', 'allotted', 'not_allotted'], default: 'pending'),
  allottedQuantity: Number (default: 0),
  applicationNumber: String (unique, auto-generated),
  createdAt: Date,
  updatedAt: Date
}

Indexes:
- user: 1, ipo: 1
- applicationNumber: 1 (unique)
- status: 1
```

### transactions
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  application: ObjectId (ref: 'Application'),
  type: String (enum: ['application', 'refund', 'allotment'], required),
  amount: Number (required),
  status: String (enum: ['pending', 'completed', 'failed'], default: 'pending'),
  transactionId: String (unique, auto-generated),
  createdAt: Date,
  updatedAt: Date
}

Indexes:
- user: 1
- transactionId: 1 (unique)
- createdAt: -1
```

## Relationships

### User ↔ Applications
- One user can have many applications
- Each application belongs to one user
- Relationship: `applications.user` references `users._id`

### User ↔ Transactions
- One user can have many transactions
- Each transaction belongs to one user
- Relationship: `transactions.user` references `users._id`

### IPO ↔ Applications
- One IPO can have many applications
- Each application is for one IPO
- Relationship: `applications.ipo` references `ipos._id`

### Application ↔ Transactions
- One application can have multiple transactions (application, refund, allotment)
- Each transaction can be linked to one application
- Relationship: `transactions.application` references `applications._id`

## Auto-Generated Fields

### Application Number
Format: `APP{timestamp}{random3digits}`
Example: `APP1704067200123`

### Transaction ID
Format: `TXN{timestamp}{random4digits}`
Example: `TXN17040672001234`

## Query Optimization

All collections have appropriate indexes for:
- Fast lookups by ID
- Filtering by status
- User-specific queries
- Date range queries
- Search functionality

Expected query performance: <100ms for most operations with 10K+ records.
