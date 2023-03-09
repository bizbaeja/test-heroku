import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import apiRouter from "./routers/apiRouter";
import { localsMiddleWare } from "./middlewares";
import http from "http";
import { async } from "regenerator-runtime";
var port = process.env.PORT || 8000;
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Method": "GET,POST,DELETE,OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Types,Access-Control-Allow-Headers, x-test",
};

const app = express();

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

// middleware
app.use(morgan("dev"));

// 웹사이트로 들어오는 form을 이해하게 만들어줌dd
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 200000000, // milliseconds
    },
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    }),
  })
);

app.use((req, res, next) => {
  req.sessionStore.all((error, sessions) => {
    next();
  });
});

// app.use((req, res, next) => {
//   res.header("Cross-Origin-Embedder-Policy", "require-corp");
//   res.header("Cross-Origin-Opener-Policy", "same-origin");
//   next();
// });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(flash());
app.use(localsMiddleWare); // after session middleware
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets")); // please let people look at the assests file
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/", rootRouter);
app.use("/api", apiRouter);

export default app;
