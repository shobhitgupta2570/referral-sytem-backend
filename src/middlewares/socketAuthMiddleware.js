import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.headers['authorization']?.replace('Bearer ', '');
    if (!token) {
      next(new Error('Unauthorized request'));
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select('-password -refreshToken');
    if (!user) {
      next(new Error('Invalid Access Token'));
    }

    socket.user = user; // Attach user to the socket
    next();
  } catch (error) {
    next(new Error('Unauthorized request'));
  }
};

export default socketAuthMiddleware;
