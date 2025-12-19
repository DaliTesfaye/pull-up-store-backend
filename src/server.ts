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


const PORT = process.env.PORT || 5010;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
