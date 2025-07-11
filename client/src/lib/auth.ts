
import { User } from '@/types';

/**
 * Get the current user from localStorage if available
 * @returns User or null if no user is stored
 */
export const getUserFromLocalStorage = (): User | null => {
  try {
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      return JSON.parse(userString);
    }
  } catch (error) {
    console.error('Error retrieving user from localStorage:', error);
  }
  return null;
};

/**
 * Save the current user to localStorage
 * @param user User to save
 */
export const saveUserToLocalStorage = (user: User): void => {
  try {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user to localStorage:', error);
  }
};

/**
 * Clear the current user from localStorage (for logout)
 */
export const clearUserFromLocalStorage = (): void => {
  try {
    localStorage.removeItem('currentUser');
  } catch (error) {
    console.error('Error clearing user from localStorage:', error);
  }
};

/**
 * Check if user is authenticated
 * @returns true if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return getUserFromLocalStorage() !== null;
};

/**
 * Check if user has a specific role
 * @param role Role to check for
 * @returns true if user has the specified role
 */
export const hasRole = (role: string): boolean => {
  const user = getUserFromLocalStorage();
  if (!user) return false;
  return user.role === role;
};
