const express = require("express");

const cors = require("cors");

const session = require("express-session");

const Database = require("better-sqlite3");

const app = express();
const PORT = 3000;

const db = new Database("bookings.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        message TEXT
    )
`);

app.use(cors({
    origin: [
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 30 * 60 * 1000
    }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Dental Clinic Backend is running!");
});

app.post("/admin/login", (req, res) => {
    const { password } = req.body;

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({
            success: false,
            message: "Incorrect password."
        });
    }

    req.session.isAdmin = true;

    res.json({
        success: true,
        message: "Login successful."
    });
});

app.post("/admin/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({
                success: false,
                message: "Could not log out."
            });
        }

        res.clearCookie("connect.sid");

        res.json({
            success: true,
            message: "Logged out successfully."
        });
    });
});

app.get("/bookings", (req, res) => {

    if (!req.session.isAdmin) {
        return res.status(401).json({
            success: false,
            message: "Please log in first."
        });
    }

    try {
        const bookings = db.prepare(
            "SELECT * FROM bookings ORDER BY id DESC"
        ).all();

        res.json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);

        res.status(500).json({
            success: false,
            message: "Could not fetch bookings."
        });
    }
});


app.post("/book", (req, res) => {
    const { name, phone, date, time, message } = req.body;

    if (!name || !phone || !date || !time) {
        return res.status(400).json({
            success: false,
            message: "Please fill in all required fields."
        });
    }

    try {
        const insertBooking = db.prepare(`
            INSERT INTO bookings (name, phone, date, time, message)
            VALUES (?, ?, ?, ?, ?)
        `);

        insertBooking.run(name, phone, date, time, message);

        console.log("Booking saved to database!");

        res.json({
            success: true,
            message: "Booking received and saved successfully!"
        });

    } catch (error) {
        console.error("Database error:", error);

        return res.status(500).json({
            success: false,
            message: "Could not save the booking."
        });
    }
});



const server = app.listen(PORT, "127.0.0.1", () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

server.on("error", (error) => {
    console.error("Server error:", error);
});