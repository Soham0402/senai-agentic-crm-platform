import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { prisma } from "./lib/prisma";
import emailRoutes from "./routes/email.routes";
import { globalErrorHandler } from "./middlewares/error.middleware";
import ragRoutes from "./routes/rag.routes";
dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api", emailRoutes);
app.use(globalErrorHandler);
app.use("/api/rag", ragRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "SenAI CRM backend running"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

async function connectDB() {
  try {
    await prisma.$connect();
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection failed", error);
  }
}

connectDB();