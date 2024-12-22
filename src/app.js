import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from 'socket.io';
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  credentials: true
    // methods: ['GET', 'POST']
  }
});

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import userRouter from './routes/user.routes.js';
import adminRouter from './routes/admin.routes.js';
import referralRouter from './routes/referral.routes.js';
import earningRouter from './routes/earning.routes.js';
import productRouter from './routes/product.routes.js'; 
import purchaseRouter from './routes/purchase.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/referrals", referralRouter);
app.use("/api/v1/earnings", earningRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/purchases", purchaseRouter);
app.use("/api/v1/dashboard", dashboardRouter);

// http://localhost:8000/api/v1/users/register

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

export { app, server, io };
