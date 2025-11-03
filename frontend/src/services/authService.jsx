import { API_BASE_URL } from "../utils/constants";

const handleResponse = async (response) => {
  const data = await response.json();

  console.log("📨 API Response:", {
    status: response.status,
    ok: response.ok,
    data: data,
  });

  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }

  return data;
};

export const registerUser = async (userData) => {
  console.log("📤 Sending registration request...", userData);

  // Make sure the user data has the required fields
  if (!userData.name || !userData.email || !userData.password) {
    throw new Error("Name, email and password are required");
  }

  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await handleResponse(response);

  // The backend returns user data with token directly
  if (!data._id || !data.token) {
    throw new Error("Invalid response from server");
  }

  console.log("✅ Registration successful, returning:", data);
  return {
    user: {
      _id: data._id,
      name: data.name,
      email: data.email,
    },
    token: data.token,
  };
};

export const loginUser = async (credentials) => {
  console.log("📤 Sending login request...");

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await handleResponse(response);

  // Backend returns user data and token directly
  if (!data._id || !data.token) {
    throw new Error("Invalid response from server");
  }

  console.log("✅ Login successful, returning:", data);
  return {
    user: {
      _id: data._id,
      name: data.name,
      email: data.email,
    },
    token: data.token,
  };
};

export const getUserProfile = async (token) => {
  console.log("🔍 Getting user profile with token...");

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await handleResponse(response);

    console.log("✅ User profile response structure:", data);

    // Handle different response structures
    if (data.user) {
      return data.user;
    } else if (data.data) {
      return data.data;
    } else {
      // If the response is the user object directly
      return data;
    }
  } catch (error) {
    console.error("❌ getUserProfile error:", error);
    throw error;
  }
};
