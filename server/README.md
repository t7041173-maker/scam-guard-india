# ScamDex 2.0 Backend Server

A comprehensive backend API for ScamDex 2.0 - Smart Scam Search Engine for India. Built with Node.js, Express, and MongoDB.

## 🚀 Features

### 🔍 Core Functionality
- **Search & Filter Scams**: Advanced search with keywords, tags, severity filters
- **Scam Reporting**: Intuitive form with severity slider, tags, screenshots
- **AI-Powered Detection**: LLM integration for real-time scam analysis
- **Image Upload**: Cloudinary integration for evidence uploads
- **Statistics & Analytics**: Comprehensive scam statistics and trends

### 🛡️ Security Features
- Rate limiting and request throttling
- Input validation and sanitization
- CORS protection
- Helmet.js security headers
- Error handling and logging

## 🏗️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **AI Integration**: OpenAI GPT-4
- **File Storage**: Cloudinary
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate limiting

## 📁 Project Structure

```
server/
├── index.js                 # Main server entry point
├── package.json            # Dependencies and scripts
├── env.example             # Environment variables template
├── models/
│   └── ScamReport.js       # MongoDB schema and methods
├── routes/
│   ├── scamRoutes.js       # Scam CRUD operations
│   ├── llmRoutes.js        # AI scam detection
│   └── uploadRoutes.js     # Image upload handling
├── utils/
│   └── seedData.js         # Database seeding
└── README.md               # This file
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
```bash
cp env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/scamdex
OPENAI_API_KEY=your_openai_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Seed Database (Optional)
```bash
node utils/seedData.js
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### 🔍 Scam Routes (`/api/scams`)

#### GET `/api/scams` - Get all scams
**Query Parameters:**
- `q` - Search query
- `tags` - Comma-separated tags
- `severityMin` - Minimum severity (1-10)
- `severityMax` - Maximum severity (1-10)
- `platform` - Comma-separated platforms
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `sort` - Sort field (createdAt, severity, viewCount, reportCount)

**Example:**
```bash
GET /api/scams?q=WhatsApp&tags=LoanFraud,UPIFraud&severityMin=7&page=1&limit=10
```

#### GET `/api/scams/trending` - Get trending scams
```bash
GET /api/scams/trending?limit=10
```

#### GET `/api/scams/tags` - Get all tags with counts
```bash
GET /api/scams/tags
```

#### GET `/api/scams/stats` - Get scam statistics
```bash
GET /api/scams/stats
```

#### GET `/api/scams/:id` - Get specific scam
```bash
GET /api/scams/64f1a2b3c4d5e6f7g8h9i0j1
```

#### POST `/api/scams` - Create new scam report
```json
{
  "title": "Fake Investment App",
  "description": "Scam description...",
  "tags": ["CryptoTrap", "FakeApp"],
  "severity": 8,
  "platform": ["WhatsApp", "Telegram"],
  "origin": "Delhi",
  "detectionTips": ["Tip 1", "Tip 2"],
  "location": "Delhi"
}
```

#### PUT `/api/scams/:id` - Update scam report
#### DELETE `/api/scams/:id` - Delete scam report
#### POST `/api/scams/:id/report` - Report similar scam

### 🤖 LLM Routes (`/api/llm`)

#### POST `/api/llm/check-scam` - AI scam detection
```json
{
  "message": "Suspicious message content...",
  "platform": "WhatsApp",
  "context": "Additional context",
  "urgency": false
}
```

#### POST `/api/llm/analyze-bulk` - Analyze multiple messages
```json
{
  "messages": [
    {
      "text": "Message 1",
      "platform": "WhatsApp"
    },
    {
      "text": "Message 2",
      "platform": "Email"
    }
  ]
}
```

#### GET `/api/llm/health` - Check AI service health

### 📤 Upload Routes (`/api/upload`)

#### POST `/api/upload/image` - Upload single image
```bash
POST /api/upload/image
Content-Type: multipart/form-data

Form data:
- image: [file]
```

#### POST `/api/upload/multiple` - Upload multiple images
```bash
POST /api/upload/multiple
Content-Type: multipart/form-data

Form data:
- images: [files] (max 5)
```

#### DELETE `/api/upload/:publicId` - Delete uploaded image
```bash
DELETE /api/upload/scamdex_abc123
```

#### GET `/api/upload/health` - Check upload service health

### 🏥 Health Check
```bash
GET /health
```

## 🗄️ Database Schema

### ScamReport Model
```javascript
{
  title: String,           // Required, max 200 chars
  description: String,     // Required, max 2000 chars
  tags: [String],          // Required, enum values
  severity: Number,        // Required, 1-10
  platform: [String],      // Optional, enum values
  origin: String,          // Optional
  source: String,          // Optional
  screenshotUrl: String,   // Optional, URL
  fraudScore: Number,      // Optional, 0-100
  verifiedSource: String,  // Optional, URL
  detectionTips: [String], // Optional, max 500 chars each
  status: String,          // pending_review, verified, rejected
  reportedBy: String,      // Default: anonymous
  location: String,        // Optional
  evidence: String,        // Optional
  viewCount: Number,       // Default: 0
  reportCount: Number,     // Default: 0
  createdAt: Date,         // Auto-generated
  updatedAt: Date          // Auto-generated
}
```

## 🔧 Configuration

### Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/scamdex` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `OPENAI_API_KEY` | OpenAI API key | Required for AI features |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Required for uploads |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Required for uploads |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Required for uploads |
| `JWT_SECRET` | JWT secret for auth | Optional |
| `NODE_ENV` | Environment | `development` |

### Supported Tags
- Fake Job, UPI Scam, WhatsApp Scam, OTP Fraud
- Investment Fraud, Loan Fraud, Phishing, CryptoTrap
- FakeApp, BankingFraud, GovernmentScam, TelegramScam
- EmailFraud, OnlineShoppingScam, JobScam, LoanScam
- InvestmentFraud, UPIFraud, WhatsAppScam

### Supported Platforms
- WhatsApp, SMS, UPI, Email, App, Website
- Phone Call, Telegram

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📊 Database Seeding

Populate the database with sample data:
```bash
node utils/seedData.js
```

This will create 6 sample scam reports with realistic data.

## 🔍 Search Features

### Text Search
- Searches title, description, and tags
- Case-insensitive matching
- MongoDB text index optimization

### Filtering
- By tags (multiple selection)
- By severity range (1-10)
- By platform (multiple selection)
- By status (pending_review, verified, rejected)

### Sorting
- By creation date (newest first)
- By severity (highest first)
- By view count (most viewed first)
- By report count (most reported first)

### Pagination
- Configurable page size (1-50 items)
- Page-based navigation
- Total count and page information

## 🛡️ Security Features

### Rate Limiting
- 100 requests per 15 minutes per IP
- Configurable limits via environment variables

### Input Validation
- Request body validation
- Query parameter validation
- File upload validation
- XSS protection

### CORS Protection
- Configurable origins
- Credentials support
- Preflight request handling

### Error Handling
- Structured error responses
- Detailed logging
- Graceful error recovery

## 📈 Monitoring

### Health Checks
- Server health: `/health`
- AI service: `/api/llm/health`
- Upload service: `/api/upload/health`

### Logging
- Request logging
- Error logging
- Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
1. Check the API documentation
2. Review the health check endpoints
3. Check server logs
4. Create an issue in the repository

## 🔗 Related Links

- [Frontend Repository](../README.md)
- [API Documentation](./API.md)
- [Deployment Guide](./DEPLOYMENT.md) 