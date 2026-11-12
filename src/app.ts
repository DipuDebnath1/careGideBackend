
import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import route from "./modules/route/route";
import notFound from "./middlewares/notFound";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app = express();

// Global middlewares
app.use(helmet());
app.use(cors({
  origin: "*",
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Health check API
app.get("/api/v1/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Care Guide task Server is running",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/v1", route);

// Not Found route handler
app.use(notFound);

// Global error handler 
app.use(globalErrorHandler);

export default app;