import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from 'socket.io';
import http from 'http';
import socketAuthMiddleware from './middlewares/socketAuthMiddleware.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes import
import userRouter from './routes/user.routes.js';
import adminRouter from './routes/admin.routes.js';
import referralRouter from './routes/referral.routes.js';
import earningRouter from './routes/earning.routes.js';
import productRouter from './routes/product.routes.js';
import purchaseRouter from './routes/purchase.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';
import notificationRouter from './routes/notification.routes.js';

// Routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/referrals", referralRouter);
app.use("/api/v1/earnings", earningRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/purchases", purchaseRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/notifications", notificationRouter);

// Use the middleware for Socket.IO connections
io.use(socketAuthMiddleware);

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected');

  const email = socket.user.email; // Extract email from the socket user
  if (email) {
    socket.join(email);
    console.log(`User with email ${email} joined room ${email}`);
  }

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

export { app, server, io };







