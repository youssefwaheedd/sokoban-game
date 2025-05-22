import bcrypt from "bcrypt";
import prisma from "../db/prismaClient.js";
import { generateToken } from "../utils/token.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({
      message: "Email, password, and username are required",
    });
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.email === email
            ? "Email already exists"
            : "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role: "PLAYER",
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
      },
    });

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
      domain:
        process.env.NODE_ENV === "production"
          ? process.env.COOKIE_DOMAIN
          : undefined,
    });

    res.status(201).json({
      message: "User registered successfully",
      token: token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Register Error:", err);
    res
      .status(500)
      .json({ message: "Something went wrong during registration" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
      domain:
        process.env.NODE_ENV === "production"
          ? process.env.COOKIE_DOMAIN
          : undefined,
    });

    res.status(200).json({
      message: "User logged in successfully",
      token: token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Something went wrong during login" });
  }
};

export const googleAuthCallback = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.redirect(
      `${process.env.FRONTEND_URL}/login?error=GoogleAuthenticationFailed`
    );
  }

  try {
    const token = generateToken({ id: user.id, role: user.role });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
      domain:
        process.env.NODE_ENV === "production"
          ? process.env.COOKIE_DOMAIN
          : undefined,
    });

    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  } catch (err) {
    console.error("Google Auth Callback Error:", err);
    res.redirect(
      `${process.env.FRONTEND_URL}/login?error=TokenGenerationFailed`
    );
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    path: "/",
    domain:
      process.env.NODE_ENV === "production"
        ? process.env.COOKIE_DOMAIN
        : undefined,
  });

  res.status(200).json({ message: "Logged out successfully" });
};

export const getCurrentUser = async (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (err) {
    console.error("Error in getCurrentUser:", err);
    res.status(500).json({ message: "Error fetching user data" });
  }
};
