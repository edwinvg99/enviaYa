export const successResponse = (dataOrCode: any, messageOrData?: string | any, maybeData?: any) => {
  if (typeof dataOrCode === 'number') {
    return {
      success: true,
      data: maybeData,
      ...(messageOrData && { message: messageOrData })
    };
  }
  return {
    success: true,
    data: dataOrCode,
    ...(messageOrData && { message: messageOrData })
  };
};

export const errorResponse = (code: number, message: string, details?: any) => ({
  success: false,
  error: {
    code,
    message,
    ...(details && { details })
  }
});
  