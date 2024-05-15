import { Request, Response, NextFunction } from 'express';
import { PrismaClient, User } from '@prisma/client';
import jwt from 'jsonwebtoken';

// Load JWT secret from environment variable or config file
const JWT_SECRET = process.env.JWT_SECRET || 'SUPER_SECRET';

// Create an instance of Prisma Client
const prisma = new PrismaClient();

// Define a type for authenticated requests
type AuthRequest = Request & { user?: User };

// Middleware function for JWT token authentication
export async function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        // Extract JWT token from Authorization header
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header missing' });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Token not found in Authorization header' });
        }

        // Verify JWT token
        const decodedToken = jwt.verify(token, JWT_SECRET) as { tokenId: number } | null;
        if (!decodedToken || !decodedToken.tokenId) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        // Retrieve token from database
        const dbToken = await prisma.token.findUnique({
            where: { id: decodedToken.tokenId },
            include: { user: true }
        });
        if (!dbToken || !dbToken.valid || dbToken.expiration < new Date()) {
            return res.status(401).json({ error: 'API token expired or invalid' });
        }

        // Attach authenticated user to request object
        req.user = dbToken.user;

        // Proceed to next middleware
        next();
    } catch (error) {
        console.error('Error authenticating token:', error);
        return res.status(401).json({ error: 'Error authenticating token' });
    }
}
