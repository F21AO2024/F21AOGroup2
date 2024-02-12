import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { PrismaClient, Prisma } from "@prisma/client";

dotenv.config();
const prisma = new PrismaClient();

export const register = async (req, res) => {
  const { username, password, firstName, lastName, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    // check if username already exists
    const userExists = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (userExists) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        role,
        username,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    // res.status(201).json(user);
    res.status(201).json({ token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await prisma.user.update({
      where: {
        username,
      },
      data: {
        password: hashedPassword,
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
