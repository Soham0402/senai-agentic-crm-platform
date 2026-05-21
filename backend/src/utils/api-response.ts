export const successResponse = (
  data: unknown,
  message = "Success"
) => {
  return {
    success: true,
    message,
    data
  };
};

export const errorResponse = (
  errorCode: string,
  message: string,
  details?: unknown
) => {
  return {
    success: false,
    error_code: errorCode,
    message,
    details
  };
};