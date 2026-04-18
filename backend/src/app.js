import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import legacyAuthRoutes from "./routes/legacyAuthRoutes.js";

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);
app.use(helmet());
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/health", healthRoutes);
app.use("/api", legacyAuthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
