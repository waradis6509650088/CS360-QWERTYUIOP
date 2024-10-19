import jwt from 'jsonwebtoken';

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
};
