if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const userRoutes = require("./routes/users");
const adsRoute = require("./routes/ads");
const MongoDBStore = require("connect-mongo")(session);
const RateLimit = require("express-rate-limit");
const lusca = require("lusca");

const rateLimiter = RateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/classified";

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();
app.use(rateLimiter);
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);
const secret = process.env.SECRET;

const store = new MongoDBStore({
  url: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

const sessionConfig = {
  store,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
//app.use(lusca.csrf());
app.use(flash());
app.use(helmet());

// Initialize Passport before any middleware that relies on req.user
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Promote _csrf from query to header (helps multipart forms) before CSRF checks
app.use((req, res, next) => {
  if (req.query && req.query._csrf && !req.headers["x-csrf-token"]) {
    req.headers["x-csrf-token"] = req.query._csrf;
  }
  next();
});

// Configure CSRF protection globally but only validate on specific routes
app.use(
  lusca.csrf({
    cookie: false,
    ignoreMethods: ["GET", "HEAD", "OPTIONS"],
    sessionKey: "session",
  })
);

// Add CSRF token to locals (only for GET to avoid token churn on POST)
app.use((req, res, next) => {
  try {
    if (req.method === "GET" && req.accepts("html")) {
      res.locals.csrfToken = req.csrfToken();
    }
  } catch (err) {
    res.locals.csrfToken = null;
  }
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

const ClodinaryUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`;

// (removed duplicate passport initialization here; it's already set up earlier)

// Apply CSP configuration right before routes to ensure it's not overridden
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [
          "'self'",
          "https://stackpath.bootstrapcdn.com",
          "https://cdn.jsdelivr.net",
        ],
        scriptSrc: [
          "'unsafe-inline'",
          "'self'",
          "https://stackpath.bootstrapcdn.com",
          "https://kit.fontawesome.com",
          "https://cdnjs.cloudflare.com",
          "https://cdn.jsdelivr.net",
        ],
        scriptSrcElem: [
          "'unsafe-inline'",
          "'self'",
          "https://stackpath.bootstrapcdn.com",
          "https://kit.fontawesome.com",
          "https://cdnjs.cloudflare.com",
          "https://cdn.jsdelivr.net",
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://kit-free.fontawesome.com",
          "https://stackpath.bootstrapcdn.com",
          "https://fonts.googleapis.com",
          "https://use.fontawesome.com",
        ],
        styleSrcElem: [
          "'self'",
          "'unsafe-inline'",
          "https://kit-free.fontawesome.com",
          "https://stackpath.bootstrapcdn.com",
          "https://fonts.googleapis.com",
          "https://use.fontawesome.com",
        ],
        imgSrc: [
          "'self'",
          "blob:",
          "data:",
          "https://res.cloudinary.com/",
          ClodinaryUrl,
          "https://images.unsplash.com",
        ],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        workerSrc: ["'self'", "blob:"],
        childSrc: ["blob:"],
        objectSrc: [],
      },
    },
  })
);

app.use("/", userRoutes);
app.use("/ads", adsRoute);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
