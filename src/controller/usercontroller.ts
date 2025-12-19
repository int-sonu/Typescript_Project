import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/userschema";
import TodoList from "../models/todoschema";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const existUser = await User.findOne({ email });
    if (existUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(200).json({ message: "Registration successful" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const loginUser = await User.findOne({ email });
    if (!loginUser) return res.status(404).json({ message: "User not registered" });

    const match = await bcrypt.compare(password, loginUser.password);
    if (!match) return res.status(401).json({ message: "Incorrect password" });

    req.session.user = { _id: loginUser._id.toString() };

    res.status(200).json({
      message: "Login successful",
      user: { _id: loginUser._id, email: loginUser.email, username: loginUser.username }
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};


export const AllUsers = async (req: Request, res: Response) => {
  try {
    const allUser = await User.find().select("-password -createdAt -updatedAt");
    res.json(allUser);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};



export const createTodo = async (req: Request, res: Response) => {
  try {
    const userId = req.session.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized: Please login first" });

    const { title, description, items } = req.body;

    const newTodo = new TodoList({ userId, title, description, items });
    await newTodo.save();

    res.status(201).json({ message: "Todo created successfully", todo: newTodo });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Failed to create todo", error: error.message });
  }
};



export const getTodos = async (req: Request, res: Response) => {
  try {
    const userId = req.session.user?._id;
    if (!userId) return res.status(401).json({ message: " Please login first" });

    const todos = await TodoList.find({ userId }).sort({ createdAt: -1 }); 
    res.status(200).json(todos);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch todos", error: error.message });
  }
};
export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const { todoId } = req.params;

    const deleted = await TodoList.findByIdAndDelete(todoId);

    if (!deleted) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({ message: "Todo deleted" });
  } catch (error) {
    res.status(500).json({ message: "Deletion failed" });
  }
};


export const logout = async (req: Request, res: Response) => {
  try {
    await new Promise<void>((resolve, reject) => {
      req.session.destroy(err => (err ? reject(err) : resolve()));
    });

    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed" });
  }
};
