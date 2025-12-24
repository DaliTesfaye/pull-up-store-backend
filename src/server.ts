import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db"
// Load environment variables
dotenv.config();
connectDB();

const app: Application = express();

// Rate limiting - 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

// Body parsing with size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.send("Server is running...");
});

// Import and use user routes
import userRoutes from "./modules/user/user.routes";
app.use("/api/users", userRoutes);

//Import and use auth routes
import authRoutes from "./modules/auth/auth.routes";
app.use("/api/auth", authRoutes);

//Import and use product routes
import productRoutes from "./modules/product/product.routes";
app.use("/api/products", productRoutes);

//Import and use cart routes
import cartRoutes from "./modules/cart/cart.routes";
app.use("/api/cart", cartRoutes);

//Import and use wishlist routes
import wishlistRoutes from "./modules/wishlist/wishlist.routes";
app.use("/api/wishlist", wishlistRoutes);

//Import and use order routes
import orderRoutes from "./modules/order/order.routes";
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
