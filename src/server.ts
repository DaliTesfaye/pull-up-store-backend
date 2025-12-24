import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db"
// Load environment variables
dotenv.config();
connectDB();

const app: Application = express();

app.use(cors());
app.use(express.json());

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
