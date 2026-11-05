
require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const { connection } = require("./db");
const { userRouter } = require("./routes/user.route");
const { auth } = require("./middleware/auth.middleware");
const { noteRouter } = require("./routes/note.route");

const app = express();

// Middleware
app.use(express.json());

app.use(cors({
    origin: [
        "http://localhost:5173",
        process.env.FRONTEND_URL
    ].filter(Boolean)
}));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/user", userRouter);
app.use("/notes", auth, noteRouter);

// Home route
app.get("/", (req, res) => {
    res.send({ msg: "Welcome to Note Application" });
});

app.get("/home", (req, res) => {
    res.send({ msg: "Welcome to Note Application" });
});

// Private dashboard route
app.get("/dashboard", auth, (req, res) => {
    res.send({ msg: "Welcome to dashboard" });
});

// Start server after database connection
const PORT = process.env.PORT || 8080;

const startServer = async () => {
    try {
        await connection;

        console.log("DB connected");

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server connected on port ${PORT}`);
        });

    } catch (error) {
        console.log("Database connection error:", error.message);
        process.exit(1);
    }
};

startServer();
