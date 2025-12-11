import { Router } from "express";
import { register, login, AllUsers } from "../controller/usercontroller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/Allusers", AllUsers);

export default router;
