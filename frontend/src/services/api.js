// src/services/api.js

export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  // Attach token for authentication if available
  const storedUser = localStorage.getItem("qc_user");
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      if (user && user.token) {
        defaultHeaders["Authorization"] = `Bearer ${user.token}`;
      }
    } catch (e) {
      console.error("Failed to parse user session for token", e);
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      // Try to parse json error, fallback to text
      let errorMsg = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errorMsg = errorData.message;
        }
      } catch (e) {
        // Not JSON
      }
      throw new Error(errorMsg);
    }
    
    if (response.status === 204) {
        return null;
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};
