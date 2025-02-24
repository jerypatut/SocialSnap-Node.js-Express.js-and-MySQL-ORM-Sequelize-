const sendResponse = (res, statusCode, success, message, data = null) => {
  res.status(statusCode).json({ success, message, data });
};

const sendError = (res, statusCode, message, error = null) => {
  res.status(statusCode).json({ success: false, message, error });
};

module.exports = { sendResponse, sendError };
