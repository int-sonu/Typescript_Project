import bcrypt from "bcrypt";
import User from "../models/userschema";
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existUser = await User.findOne({ email });
        if (existUser)
            return res.status(400).json({ message: "Email already exists" });
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        return res.status(201).json({
            message: "Registration successful",
            user: { _id: newUser._id, username: newUser.username, email: newUser.email },
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ message: "Registration failed", error: error.message });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const loginUser = await User.findOne({ email });
        if (!loginUser)
            return res.status(404).json({ message: "User not registered" });
        const match = await bcrypt.compare(password, loginUser.password);
        if (!match)
            return res.status(400).json({ message: "Incorrect password" });
        if (req.session) {
            req.session.user = { _id: loginUser._id.toString() };
        }
        return res.status(200).json({
            message: "Login successful",
            user: { _id: loginUser._id, username: loginUser.username, email: loginUser.email },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Login failed", error: error.message });
    }
};
