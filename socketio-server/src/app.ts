import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import "reflect-metadata";

var app = express();

// Middleware for logging HTTP requests in the console
app.use(logger("dev"));

// Middleware for parsing JSON request bodies
app.use(express.json());

// Middleware for parsing URL-encoded request bodies
app.use(express.urlencoded({ extended: false }));

// Middleware for parsing cookies
app.use(cookieParser());

// Middleware for serving static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Middleware for enabling Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Error handler middleware
app.use(function (err, req, res, next) {

  // Set locals to make error information available to the view (template) engine
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Send a plain text error message
  res.status(err.status || 500);
  res.send("Error: " + err.message);
  
});

export default app;


