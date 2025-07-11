import { users, type User, type InsertUser } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser & { role?: string; password: string }): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getAllUsers(limit?: number, offset?: number): Promise<User[]>;
  getUserCount(): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User & { password: string; role: string }>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    
    // Create default admin user for development
    this.createDefaultAdmin();
  }

  private async createDefaultAdmin() {
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123!', 12);
    
    const adminUser = {
      id: this.currentId++,
      username: 'admin',
      email: 'admin@church.local',
      password: hashedPassword,
      role: 'admin'
    };
    
    this.users.set(adminUser.id, adminUser);
    console.log('Default admin user created - username: admin, password: admin123!');
  }

  async getUser(id: number): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    // Don't return password in user object
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async getUserByUsername(username: string): Promise<(User & { password: string; role: string }) | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<(User & { password: string; role: string }) | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser & { role?: string; password: string }): Promise<User> {
    const id = this.currentId++;
    const user = { 
      ...insertUser, 
      id, 
      role: insertUser.role || 'member',
      password: insertUser.password
    };
    
    this.users.set(id, user);
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;
    
    const updatedUser = { ...existingUser, ...updates };
    this.users.set(id, updatedUser);
    
    // Return user without password
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as User;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  async getAllUsers(limit: number = 50, offset: number = 0): Promise<User[]> {
    const allUsers = Array.from(this.users.values())
      .slice(offset, offset + limit)
      .map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
      });
    
    return allUsers;
  }

  async getUserCount(): Promise<number> {
    return this.users.size;
  }
}

export const storage = new MemStorage();
