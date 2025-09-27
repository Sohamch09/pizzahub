import { RequestHandler } from "express";
import { z } from "zod";

// Validation schemas
const RegisterSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Mock user database (replace with actual database)
const users = new Map();

// Mock JWT token creation (in real app, use proper JWT library)
const createToken = (userId: string, role: string) => {
  return `mock_jwt_token_${userId}_${role}`;
};

export const handleRegister: RequestHandler = async (req, res) => {
  try {
    const validatedData = RegisterSchema.parse(req.body);
    
    // Check if user already exists
    if (users.has(validatedData.email)) {
      return res.status(400).json({
        error: "User already exists with this email"
      });
    }

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      email: validatedData.email,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      phone: validatedData.phone,
      passwordHash: `hashed_${validatedData.password}`, // In real app, properly hash
      role: "user",
      isEmailVerified: false,
      createdAt: new Date(),
    };

    users.set(validatedData.email, newUser);

    // In real app, send email verification
    console.log(`Email verification would be sent to ${validatedData.email}`);

    const token = createToken(newUser.id, newUser.role);

    res.status(201).json({
      message: "Registration successful. Please check your email for verification.",
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone,
        role: newUser.role,
        isEmailVerified: newUser.isEmailVerified,
      },
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors,
      });
    }
    
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const validatedData = LoginSchema.parse(req.body);
    
    const user = users.get(validatedData.email);
    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password"
      });
    }

    // In real app, compare hashed passwords
    const passwordValid = user.passwordHash === `hashed_${validatedData.password}`;
    if (!passwordValid) {
      return res.status(401).json({
        error: "Invalid email or password"
      });
    }

    const token = createToken(user.id, user.role);

    res.json({
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
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors,
      });
    }
    
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleForgotPassword: RequestHandler = async (req, res) => {
  try {
    const validatedData = ForgotPasswordSchema.parse(req.body);
    
    const user = users.get(validatedData.email);
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({
        message: "If an account with that email exists, we've sent a password reset link."
      });
    }

    // In real app, send password reset email
    console.log(`Password reset email would be sent to ${validatedData.email}`);

    res.json({
      message: "If an account with that email exists, we've sent a password reset link."
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors,
      });
    }
    
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleVerifyEmail: RequestHandler = async (req, res) => {
  try {
    const { token } = req.params;
    
    // In real app, verify the token and update user
    console.log(`Email verification token: ${token}`);
    
    res.json({
      message: "Email verified successfully"
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleGetProfile: RequestHandler = async (req, res) => {
  try {
    // In real app, extract user ID from JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.substring(7);
    
    // Mock token validation (in real app, verify JWT)
    if (!token.startsWith('mock_jwt_token_')) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Extract user info from mock token
    const tokenParts = token.split('_');
    const userId = tokenParts[3];
    
    // Find user by ID (in real app, query database)
    const user = Array.from(users.values()).find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      }
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleUpdateProfile: RequestHandler = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.substring(7);
    if (!token.startsWith('mock_jwt_token_')) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const tokenParts = token.split('_');
    const userId = tokenParts[3];

    const { firstName, lastName, phone } = req.body || {};

    const user = Array.from(users.values()).find((u: any) => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (typeof firstName === 'string') user.firstName = firstName;
    if (typeof lastName === 'string') user.lastName = lastName;
    if (typeof phone === 'string') user.phone = phone;

    users.set(user.email, user);

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
