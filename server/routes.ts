import type { Express } from "express";
import { createServer, type Server } from "http";
import { body } from "express-validator";
import { storage } from "./storage";
import { 
  authenticateToken, 
  requireRole, 
  requireSession, 
  generateToken, 
  hashPassword, 
  verifyPassword,
  sanitizeRequest,
  type AuthenticatedRequest 
} from "./middleware/auth";
import { 
  handleValidationErrors,
  validateEmail,
  validatePassword,
  validateUsername,
  validateMember,
  validateTask,
  validateTransaction,
  validateProgramme,
  validateId,
  validatePagination,
  validateSearch
} from "./middleware/validation";

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply sanitization to all routes
  app.use('/api', sanitizeRequest);

  // Health check endpoint (no auth required)
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  });

  // Authentication routes
  app.post('/api/auth/register', [
    validateUsername,
    validateEmail,
    validatePassword,
    body('role').optional().isIn(['admin', 'pastor', 'member', 'volunteer']).withMessage('Invalid role'),
    handleValidationErrors
  ], async (req: any, res: any) => {
    try {
      const { username, email, password, role = 'member' } = req.body;

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ 
          error: 'Username already exists',
          code: 'USER_EXISTS'
        });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const newUser = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        role
      });

      // Generate token
      const token = generateToken({ 
        id: newUser.id, 
        username: newUser.username, 
        role: newUser.role 
      });

      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role
        },
        token
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to create user',
        code: 'REGISTRATION_FAILED'
      });
    }
  });

  app.post('/api/auth/login', [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors
  ], async (req: any, res: any) => {
    try {
      const { username, password } = req.body;

      // Get user
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ 
          error: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        });
      }

      // Verify password
      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ 
          error: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        });
      }

      // Generate token
      const token = generateToken({ 
        id: user.id, 
        username: user.username, 
        role: user.role 
      });

      // Set session
      (req.session as any).user = {
        id: user.id,
        username: user.username,
        role: user.role
      };

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Login failed',
        code: 'LOGIN_FAILED'
      });
    }
  });

  app.post('/api/auth/logout', requireSession, (req, res) => {
    req.session?.destroy((err) => {
      if (err) {
        return res.status(500).json({ 
          error: 'Logout failed',
          code: 'LOGOUT_FAILED'
        });
      }
      res.clearCookie('sessionId');
      res.json({ message: 'Logout successful' });
    });
  });

  app.get('/api/auth/me', authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const user = await storage.getUser(parseInt(req.user!.id));
      if (!user) {
        return res.status(404).json({ 
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to get user profile',
        code: 'PROFILE_FAILED'
      });
    }
  });

  // Protected routes - require authentication
  app.use('/api/protected', authenticateToken);

  // Admin-only routes
  app.get('/api/admin/users', 
    authenticateToken,
    requireRole(['admin']),
    validatePagination,
    handleValidationErrors,
    async (req: AuthenticatedRequest, res: any) => {
    try {
      // This would fetch users with pagination in a real implementation
      res.json({ 
        message: 'Admin users endpoint',
        requestedBy: req.user 
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to fetch users',
        code: 'FETCH_USERS_FAILED'
      });
    }
  });

  // Search endpoint with rate limiting
  app.get('/api/search', 
    authenticateToken,
    validateSearch,
    handleValidationErrors,
    async (req: AuthenticatedRequest, res: any) => {
    try {
      const { q, type } = req.query;
      
      // Implement search logic here
      res.json({
        query: q,
        type: type || 'all',
        results: [],
        requestedBy: req.user
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Search failed',
        code: 'SEARCH_FAILED'
      });
    }
  });

  // Example protected CRUD endpoints
  
  // Members endpoints
  app.get('/api/members', authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      // Return mock data or implement actual fetch
      res.json({ 
        members: [],
        message: 'Members fetched successfully',
        requestedBy: req.user
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to fetch members',
        code: 'FETCH_MEMBERS_FAILED'
      });
    }
  });

  app.post('/api/members', 
    authenticateToken,
    requireRole(['admin', 'pastor']),
    validateMember,
    handleValidationErrors,
    async (req: AuthenticatedRequest, res: any) => {
    try {
      const memberData = req.body;
      
      // Implement member creation logic
      res.status(201).json({
        message: 'Member created successfully',
        member: memberData,
        createdBy: req.user
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to create member',
        code: 'CREATE_MEMBER_FAILED'
      });
    }
  });

  // Tasks endpoints
  app.get('/api/tasks', authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      res.json({ 
        tasks: [],
        message: 'Tasks fetched successfully',
        requestedBy: req.user
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to fetch tasks',
        code: 'FETCH_TASKS_FAILED'
      });
    }
  });

  app.post('/api/tasks', 
    authenticateToken,
    validateTask,
    handleValidationErrors,
    async (req: AuthenticatedRequest, res: any) => {
    try {
      const taskData = req.body;
      
      res.status(201).json({
        message: 'Task created successfully',
        task: taskData,
        createdBy: req.user
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to create task',
        code: 'CREATE_TASK_FAILED'
      });
    }
  });

  // Error handling for undefined routes
  app.use('/api/*', (req, res) => {
    res.status(404).json({
      error: 'API endpoint not found',
      code: 'ENDPOINT_NOT_FOUND',
      path: req.path,
      method: req.method
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
