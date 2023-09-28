const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const Flash = require("connect-flash");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError"); // This is the custom error class we made
const app = express();
const bodyParser = require("body-parser");
const route = require("./Router/route");
const adminroutes = require("./Router/adminroutes");
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(bodyParser.json());

const URL =
    "mongodb+srv://qwert:vanshsachdeva@cluster0.7zuhob5.mongodb.net/PlotLine?retryWrites=true&w=majority";

const connectDB = async() => {
    try {
        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) {
        console.log("error", error);
    }
};
connectDB();

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "View"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "Public")));
const SessionConfig = {
    secret: "Thisshoudbebettersecret1",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};

app.use(session(SessionConfig));
app.use(Flash());

app.use((req, res, next) => {
    res.locals.currentUser = req.session.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/", route);
app.use("/admin", adminroutes);

app.all("*", (req, res, next) => {
    next(new ExpressError("Invalid Page Error", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh No, Something Went Wrong!";
    res.status(statusCode).render("error", { err });
});

app.listen(9483, () => {
    console.log("Serving on port 9483");
});