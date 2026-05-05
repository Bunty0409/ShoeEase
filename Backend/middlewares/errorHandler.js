// Not Found handler
const notFound = (req, res, next) => {
  const error = new Error(`Not Found : ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Error Handler
// BUG-19 FIX: Only expose the stack trace in development mode.
// Exposing stack traces in production leaks internal file paths and logic.
const errorHandler = (err, req, res, next) => {
  const statuscode = res.statusCode == 200 ? 500 : res.statusCode;
  res.status(statuscode);
  res.json({
    status: "fail",
    message: err?.message,
    stack: process.env.NODE_ENV === "development" ? err?.stack : undefined,
  });
};

module.exports = { errorHandler, notFound };
