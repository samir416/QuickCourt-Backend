// src/services/api.js

export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://10.117.7.190:8080/api";

export const getStoredToken = () => {
  // 1. Try qc_user object in localStorage
  try {
    const storedUser = localStorage.getItem("qc_user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      const token = parsed?.token || parsed?.accessToken || parsed?.jwt || parsed?.authToken;
      if (token && token !== "undefined" && token !== "null") {
        return token;
      }
    }
  } catch (e) {
    // ignore json parse error
  }

  // 2. Direct keys in localStorage
  const directKeys = ["token", "jwt", "accessToken", "qc_token", "authToken"];
  for (const key of directKeys) {
    const t = localStorage.getItem(key);
    if (t && t !== "undefined" && t !== "null") {
      return t;
    }
  }

  // 3. Fallback to sessionStorage
  try {
    const sessionUser = sessionStorage.getItem("qc_user");
    if (sessionUser) {
      const parsed = JSON.parse(sessionUser);
      const token = parsed?.token || parsed?.accessToken || parsed?.jwt;
      if (token && token !== "undefined" && token !== "null") {
        return token;
      }
    }
    for (const key of directKeys) {
      const t = sessionStorage.getItem(key);
      if (t && t !== "undefined" && t !== "null") {
        return t;
      }
    }
  } catch (e) {
    // ignore
  }

  return null;
};

export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const token = getStoredToken();
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
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
      let errorMsg = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData) {
          if (errorData.message) {
            errorMsg = errorData.message;
          } else if (errorData.error) {
            errorMsg = errorData.error;
          }
        }
      } catch (e) {
        // Response is not JSON
      }

      if (response.status === 401) {
        // Session expired or unauthenticated
        try {
          localStorage.removeItem("token");
          localStorage.removeItem("jwt");
          localStorage.removeItem("accessToken");
        } catch (e) {}
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

