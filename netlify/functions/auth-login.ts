import { Handler } from "@netlify/functions";
import { z } from "zod";

// Mock user database
const users = new Map();

// Add some test users
users.set("test@example.com", {
  id: "user-1",
  email: "test@example.com",
  firstName: "Test",
  lastName: "User",
  phone: "1234567890",
  passwordHash: "hashed_password123",
  role: "user",
  isEmailVerified: true,
  createdAt: new Date(),
});

// Add admin user
users.set("admin@example.com", {
  id: "user-2",
  email: "admin@example.com",
  firstName: "Admin",
  lastName: "User",
  phone: "1234567890",
  passwordHash: "hashed_admin123",
  role: "admin",
  isEmailVerified: true,
  createdAt: new Date(),
});

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const createToken = (userId: string, role: string) => {
  return `mock_jwt_token_${userId}_${role}`;
};

export const handler: Handler = async (event, context) => {
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const validatedData = LoginSchema.parse(body);
    
    const user = users.get(validatedData.email);
    if (!user) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: "Invalid email or password"
        }),
      };
    }

    // In real app, compare hashed passwords
    const passwordValid = user.passwordHash === `hashed_${validatedData.password}`;
    if (!passwordValid) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: "Invalid email or password"
        }),
      };
    }

    const token = createToken(user.id, user.role);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        },
        token,
      }),
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
