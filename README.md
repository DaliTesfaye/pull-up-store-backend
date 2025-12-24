# 🛍️ Pull Up Store - Backend Server

A complete e-commerce backend built with Node.js, Express, TypeScript, and MongoDB.

## 📋 Features

### ✅ **Implemented Modules:**
- **Authentication System** - Sign up, login, email verification, password reset
- **Product Management** - Browse, filter, search products with pagination
- **Shopping Cart** - Add, update, remove items with stock validation
- **Wishlist** - Save favorite products for later
- **Order Management** - Place orders with email confirmation flow
- **Stock Management** - Automatic stock updates and availability tracking

### 🔒 **Security Features:**
- JWT authentication (7-day expiration)
- Password hashing with bcrypt
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Request size limits (10MB)
- Input validation with Zod

### ⚡ **Performance Optimizations:**
- Batch database queries (no N+1 problems)
- MongoDB text search indexes
- Atomic stock operations
- Efficient product fetching with maps

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas account or local MongoDB
- Gmail account (for email functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pull-up-store-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Update with your actual credentials:
     ```bash
     cp .env.example .env
     ```
   - **Required variables:**
     - `MONGO_URI` - Your MongoDB connection string
     - `JWT_SECRET` - Strong random string for JWT signing
     - `EMAIL_USER` - Your Gmail address
     - `EMAIL_PASSWORD` - Gmail app password (not regular password)
     - `FRONTEND_URL` - Your frontend URL for CORS

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## 📁 Project Structure

```
src/
├── config/
│   └── db.ts                 # Database connection
├── middelwares/
│   └── auth.middleware.ts    # JWT authentication middleware
├── modules/
│   ├── auth/                 # Authentication (signup, login, verify)
│   ├── user/                 # User management
│   ├── product/              # Product catalog
│   ├── cart/                 # Shopping cart
│   ├── wishlist/             # Wishlist
│   └── order/                # Order processing
├── utils/
│   ├── email.ts              # Email sending utilities
│   ├── jwt.ts                # JWT token utilities
│   ├── password.ts           # Password hashing
│   ├── token.ts              # Token generation
│   └── validators.ts         # Input validation
├── scripts/
│   └── seedProducts.ts       # Database seeding script
└── server.ts                 # Main application entry
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /signup` - Register new user
- `POST /login` - Login user
- `POST /verify-email` - Verify email with code
- `POST /resend-verification` - Resend verification email
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with token

### Products (`/api/products`)
- `GET /` - Get all products (with filters, search, pagination)
- `GET /:id` - Get single product by ID

### Cart (`/api/cart`) - 🔒 Protected
- `GET /` - Get user's cart
- `POST /add` - Add item to cart
- `PUT /:productId/:size/:color` - Update cart item quantity
- `DELETE /:productId/:size/:color` - Remove item from cart
- `DELETE /clear` - Clear entire cart

### Wishlist (`/api/wishlist`) - 🔒 Protected
- `GET /` - Get user's wishlist
- `POST /add` - Add product to wishlist
- `DELETE /:productId` - Remove product from wishlist
- `DELETE /clear` - Clear entire wishlist

### Orders (`/api/orders`) - 🔒 Protected
- `POST /` - Create order from cart
- `GET /` - Get order history (paginated)
- `GET /:orderId` - Get single order details
- `PUT /:orderId/cancel` - Cancel order
- `POST /confirm` - Confirm order via email link

### Users (`/api/users`) - 🔒 Protected
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile

## 📧 Email Configuration

The app uses **Gmail SMTP** for sending emails. You need to:

1. Enable 2-factor authentication on your Gmail account
2. Generate an **App Password** (not your regular password)
   - Go to: Google Account → Security → 2-Step Verification → App Passwords
3. Use the generated app password in `EMAIL_PASSWORD` environment variable

**Email Features:**
- Account verification emails
- Password reset emails
- Order confirmation emails

## 🗄️ Database Schema

### User
- Email (unique, verified)
- Password (hashed)
- First Name, Last Name
- Verification status and tokens
- Password reset tokens

### Product
- Name, Description
- Price, Images
- Category (hoodies, sweaters, jackets, pants)
- Stock by size/color combination
- Text search index on name & description

### Cart
- User reference
- Items: productId, size, color, quantity

### Wishlist
- User reference
- Product references with added dates

### Order
- Unique order number (ORD-YYYYMMDD-XXXX)
- User reference
- Order items with price snapshot
- Status: pending → confirmed → shipped → delivered
- Confirmation token & email tracking
- Cancellation support

## ⚙️ Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | No | Server port | `5000` |
| `MONGO_URI` | Yes | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Yes | Secret key for JWT signing | `random-secret-key` |
| `EMAIL_USER` | Yes | Gmail address | `your-email@gmail.com` |
| `EMAIL_PASSWORD` | Yes | Gmail app password | `xxxx xxxx xxxx xxxx` |
| `FRONTEND_URL` | No | Frontend URL for CORS | `http://localhost:3000` |

## 🧪 Testing with Postman

1. **Sign up** - Create account and get verification code
2. **Verify email** - Use the code from email
3. **Login** - Get JWT token
4. **Add token to requests** - Use Bearer token authentication
5. **Test all endpoints** - Products, cart, wishlist, orders

## 🛠️ Development Scripts

```bash
npm run dev      # Start development server with auto-reload
npm run build    # Compile TypeScript to JavaScript
npm start        # Run production build
```

## 📊 Performance Notes

- **Cart/Wishlist queries:** Batch fetching (1 query vs 10+)
- **Stock updates:** Atomic MongoDB operations
- **Product search:** MongoDB text indexes
- **Rate limiting:** 100 requests per 15 minutes per IP
- **Request size:** Limited to 10MB

## 🔐 Security Considerations

- All passwords hashed with bcrypt (10 rounds)
- JWT tokens expire after 7 days
- Email verification required before login
- Rate limiting prevents brute force attacks
- CORS restricted to frontend URL
- Comprehensive error handling (no server crashes)
- MongoDB injection prevention via Mongoose

## 🚧 Future Enhancements

- [ ] Payment integration (Stripe/PayPal)
- [ ] Shipping address management
- [ ] Order tracking & notifications
- [ ] Product reviews & ratings
- [ ] Admin dashboard
- [ ] Redis caching
- [ ] WebSocket for real-time updates
- [ ] Image upload (AWS S3/Cloudinary)
- [ ] Advanced analytics
- [ ] Promotional codes & discounts

## 📝 License

ISC

## 👨‍💻 Author

Pull Up Store Development Team

---

**Status:** ✅ Production-ready backend, ready for frontend integration
