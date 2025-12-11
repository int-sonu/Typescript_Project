import express from "express";
import ConnectDB from "./config/db";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import userroute from "./routes/userroute"
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: "mongodb://localhost:27017/TypeScript_project",}),
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);
app.use("/user", userroute);

app.get("/", (req, res) => {
  res.send("Server running");
});

ConnectDB();

app.listen(3000, () => {
  console.log(`Server running at http://127.0.0.1:${3000}`);
});
