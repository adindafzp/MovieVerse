const express = require("express");
const sequelize = require("./library/database");
const User = require("./models/User");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import cors
const userRoutes = require("./routes/userRoutes");
const countryRoutes = require("./routes/countryRoutes");
const genreRoutes = require("./routes/genreRoutes");
const movieRoutes = require("./routes/movieRoutes");
const awardRoutes = require("./routes/awardRoutes");
const directorRoutes = require("./routes/directorRoutes");
const movieVideosRoutes = require("./routes/movieVideosRoutes");
const actorRoutes = require("./routes/actorRoutes");
const movieActorRoutes = require("./routes/movieActors");
const session = require('express-session');
const passport = require('./library/passportConfig');
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = 3000;

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Sesuaikan dengan domain frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  })
);

app.options('*', cors()); // Menghandle preflight request untuk semua routes

// Test Database Connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
    return sequelize.sync(); // Sync models to the database
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Parsing JSON Requests (no need for body-parser in modern Express)
app.use(express.json());

// Session Management
app.use(
  session({
    secret: process.env.JWT_SECRET, // Secret for session encryption
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Admin Routes
app.use("/api/admin/user", userRoutes);
app.use("/api/admin/genre", genreRoutes);
app.use("/api/admin/country", countryRoutes);
app.use("/api/admin/award", awardRoutes);
app.use("/api/admin/director", directorRoutes);
app.use("/api/admin/movie", movieRoutes);
app.use("/api/admin/movie-videos", movieVideosRoutes);
app.use("/api/admin/actors", actorRoutes);
app.use("/api/admin/movie-actors", movieActorRoutes);

// Public Routes
const movieRoutesPublic = require("./routes/public/movieRoutes"); 
const directorRoutesPublic = require("./routes/public/directorRoutes");
const actorRoutesPublic = require("./routes/public/actorRoutes");
const genreRoutesPublic = require("./routes/public/genreRoutes");

app.use("/api/movies", movieRoutesPublic);
app.use("/api/directors", directorRoutesPublic); // Fixed typo
app.use("/api/actors", actorRoutesPublic);
app.use("/api/genres", genreRoutesPublic);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
