import { Router } from "express";
import { register, login, AllUsers, createTodo, logout, getTodos, deleteTodo } from "../controller/usercontroller";
import { isAuth } from "../middleware/isAuth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/Allusers", AllUsers);
router.post("/addtodo", isAuth, createTodo); 
router.delete("/logout", logout);
router.get("/todos", isAuth, getTodos);
router.delete("/delete/:todoId", deleteTodo);


export default router;
