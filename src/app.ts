import express from "express";
import cors from "cors";
import helmet from "helmet";
import { userModule } from "./modules/user";
import { authModule } from "./modules/auth";
import { healthRoutes } from "@/shared/routes/health.routes";
import { errorHandler } from "@/shared/middleware/error-handler.middleware";
import { requestIdMiddleware } from "@/shared/middleware/request-id.middleware";
import { httpLoggerMiddleware } from "@/shared/middleware/http-logger.middleware";
import { apiRateLimiter } from "@/shared/middleware/rate-limit.middleware";
import { env } from "./config/env";
import { setupSwagger } from "@/shared/docs/openapi";

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin:
      env.NODE_ENV === "production"
        ? process.env.CORS_ORIGIN?.split(",") || false
        : true, // Allow all origins in development
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
  })
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request tracking and logging
app.use(requestIdMiddleware);
app.use(httpLoggerMiddleware);

// Health check routes (before rate limiting for monitoring)
app.use(healthRoutes);

// Global rate limiting
app.use(apiRateLimiter);

// API versioning - mount routes under /api/v1
userModule.register(app);
authModule.register(app);

// Swagger documentation (after routes are registered)
setupSwagger(app);

// Error handling (must be last)
app.use(errorHandler);

export { app };
