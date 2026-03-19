import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db";
import { config } from "../config";
import { sendWelcomeEmail } from "../services/email.service";

export const register = async (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, passwordHash, phone, role: "PATIENT" },
    });

    await sendWelcomeEmail(user.email, user.name);

    res.status(201).json({ success: true, message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const accessToken = jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    } as jwt.SignOptions);
    const refreshToken = jwt.sign({ id: user.id }, config.jwtRefreshSecret, {
      expiresIn: config.jwtRefreshExpiresIn,
    } as jwt.SignOptions);

    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getMe = async (req: any, res: Response) => {
  const user = req.user;
  res.json({
    success: true,
    data: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone },
  });
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ success: false, message: "Refresh token required" });

  try {
    const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret) as { id: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    const accessToken = jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    } as jwt.SignOptions);

    res.json({ success: true, data: { accessToken } });
  } catch (error) {
    res.status(403).json({ success: false, message: "Invalid refresh token" });
  }
};
