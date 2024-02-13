class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.data = null;
    this.message = message;
    this.success = false;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };

// Benefits of Using ApiError

// Specific Error Type: Distinguishes between generic errors and those tied to your API, aiding in error handling.
// Standardized Structure: Ensures consistent error reporting within your API.
// Informative: Carries a status code, main message, and space for extra error details.
// Debuggable: Includes stack trace information for pinpointing error origins.
// Key Point:  Think of this as a blueprint for creating API-specific error objects. This class gives you the tool to communicate detailed error information from your API in a structured way.
