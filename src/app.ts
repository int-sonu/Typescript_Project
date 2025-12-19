import express from "express";
import ConnectDB from "./config/db";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import userroute from "./routes/userroute"
import cors from "cors";
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());



app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: "mongodb://localhost:27017/TypeScript_project",}),
     cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: false, 
    }
  })
);
app.use("/user", userroute);



ConnectDB();

app.listen(3001, () => {
  console.log(`Server running at http://127.0.0.1:${3001}`);
});
