class ApiResponse {
  constructor(status, message = "Success", data) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.success = status < 400;
  }
}

export { ApiResponse };

// Benefits

// Consistency: Ensures a consistent format for API responses, making it easier for clients to understand.
// Informative: Provides a status code, message, and optional data payload for clarity.
// Extensible: This class could be extended to include other helpful properties or methods for customizing API responses.
