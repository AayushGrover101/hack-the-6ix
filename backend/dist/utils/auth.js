import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
function createToken(user) {
    return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
}
function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch (err) {
        return null;
    }
}
export { createToken, verifyToken };
