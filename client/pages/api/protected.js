import { verifyToken } from '../../utils/auth';

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = verifyToken(token);
    // Proceed with your logic using decoded user info
    res.status(200).json({ message: 'This is protected data.' });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}
