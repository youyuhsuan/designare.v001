import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchToken = createAsyncThunk("token/fetchToken", async () => {
  const response = await fetch("/api/auth/token");
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
});

export const validateAndUpdateToken = createAsyncThunk(
  "token/validateAndUpdate",
  async (tokenId: string) => {
    const response = await fetch("/api/auth/validate-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tokenId }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }
);

export const deleteClientToken = createAsyncThunk(
  "token/deleteClient",
  async () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    return null;
  }
);

export const logout = createAsyncThunk(
  "token/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      return null;
    } catch (error) {
      return rejectWithValue("Logout failed");
    }
  }
);
