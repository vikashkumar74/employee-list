const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
const MongoStore = require("connect-mongo");
const { corsOptions, sessionConfig } = require("./config");
const authRoutes = require("./routes/auth");
const connectDB = require("./database");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(require("cors")(corsOptions));
app.use(session(sessionConfig));

// Database Connection
connectDB();

// Routes

app.use("/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
