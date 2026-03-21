import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import cookieParser from "cookie-parser";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
});

const configureSecurityMiddleware = (app) => {
  app.use(helmet());
  app.use(limiter);

  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );

  app.use(cookieParser());
};

export default configureSecurityMiddleware;
