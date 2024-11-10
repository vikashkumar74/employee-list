const MongoStore = require("connect-mongo");
require("dotenv").config();

const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'http://localhost:3001'];
        
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);  
        } else {
            callback(new Error("Not allowed by CORS"));  
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true 
};

const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 }  // 1 day session cookie
};

module.exports = { corsOptions, sessionConfig };
