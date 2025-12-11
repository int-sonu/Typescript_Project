import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/userschema";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const existUser = await User.findOne({ email });

    if (existUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    return res.status(200).json({message: "Registration successful"});

  } catch (error: any) {
    console.error("Registration error:", error);
    return res.status(401).json({ message: "Registration failed", error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const loginUser = await User.findOne({ email });
    if (!loginUser) return res.status(404).json({ message: "User not registered" });
    const match = await bcrypt.compare(password, loginUser.password);
    req.session.user = { _id: loginUser._id.toString() };

    return res.status(200).json({ message: "Login successful"});
  } catch (error: any) {
    console.error("Login error:", error);
    return res.status(401).json({ message: "Login failed", error: error.message });
  }
};


export const AllUsers = async (req: Request, res: Response) => {
  try {
    const allUser = await User.find().select('-password -createdAt -updatedAt');
    res.send(allUser)
  }
  catch (error: any) {
    console.error("Fetch error:", error);
    return res.status(500).json({ message: "failed get all users", error: error.message });
  }
}