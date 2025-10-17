export const successResponse = (data: any, message?: string) => ({
  success: true,
  data,
  ...(message && { message })
});

export const errorResponse = (code: number, message: string, details?: any) => ({
  success: false,
  error: {
    code,
    message,
    ...(details && { details })
  }
});
  