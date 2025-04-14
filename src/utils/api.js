export const handleApiError = (error) => {
  console.error("API Error:", error);
  return {
    success: false,
    message: error.message || "An error occurred",
    error: error.response?.data || error.message,
  };
};

export const validateResponse = (response, expectedFields = []) => {
  if (!response) {
    return { isValid: false, message: "No response received" };
  }

  for (const field of expectedFields) {
    if (!(field in response)) {
      return { isValid: false, message: `Missing field: ${field}` };
    }
  }

  return { isValid: true };
};
