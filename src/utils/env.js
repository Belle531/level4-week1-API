/**
 * Loads and validates environment variables for the application.
 * This is intentionally small and explicit for teaching purposes.
 */
import dotenv from 'dotenv';

dotenv.config();

/**
 * @returns {{ PORT: number }}
 */
export function ensureEnv() {
  const PORT = Number(process.env.PORT ?? 3000);

  // Load the JWT variable
  const JWT_SECRET = process.env.JWT_SECRET ?? '';

  if (!Number.isFinite(PORT) || PORT <= 0) {
    throw new Error('Invalid PORT. Please set PORT to a valid number.');
  }

  // Validation of the length of the key
  if (JWT_SECRET.trim().length < 31) {
    throw new Error('Invalid JWT_SECRET. Please set a long random string (32+ chars).');
  }

  return { PORT, JWT_SECRET };
}