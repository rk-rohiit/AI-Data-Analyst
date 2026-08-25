export const sendSuccess = (res, message, data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res, message, details = null, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      message,
      details,
    },
  });
};
