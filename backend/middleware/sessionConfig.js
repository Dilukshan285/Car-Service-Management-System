import session from 'express-session';
import connectMongoDBSession from 'connect-mongodb-session';

// Create a store instance using the `connect-mongodb-session` package
const MongoDBStore = connectMongoDBSession(session);

const store = new MongoDBStore({
  uri: process.env.DB, // MongoDB connection string
  collection: "sessions", // Collection name to store sessions
});

// Catch errors
store.on("error", function (error) {
  console.log("Session store error:", error);
});

const sessionMiddleware = session({
  secret: process.env.JWT_SECRET, // Use a secure secret key
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    maxAge: 1000 * 60 * 30, // Set cookie lifespan (30 minutes in this case)
    httpOnly: false,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
  },
});

export default sessionMiddleware;