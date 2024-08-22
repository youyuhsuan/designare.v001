import { useState, useEffect } from "react";

const TOKEN_CACHE_KEY = "auth_token";
const TOKEN_CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

interface TokenData {
  tokenId: string;
  userId: string;
  userEmail: string;
  createdAt: { seconds: number; nanoseconds: number };
  expiresAt: { seconds: number; nanoseconds: number };
}

const fetchTokenData = async (): Promise<TokenData> => {
  const startTime = performance.now();
  try {
    const response = await fetch("/api/auth/token");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: TokenData = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch token data:", error);
    throw error;
  } finally {
    const endTime = performance.now();
    console.log(`fetchTokenData execution time: ${endTime - startTime}ms`);
  }
};

const getCachedToken = (): TokenData | null => {
  if (typeof window !== "undefined") {
    const cachedData = localStorage.getItem(TOKEN_CACHE_KEY);
    if (cachedData) {
      const { token, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < TOKEN_CACHE_EXPIRY) {
        return token;
      }
    }
  }
  return null;
};

const setCachedToken = (token: TokenData) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(
      TOKEN_CACHE_KEY,
      JSON.stringify({
        token,
        timestamp: Date.now(),
      })
    );
  }
};

export const useToken = () => {
  const [token, setToken] = useState<TokenData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getToken = async () => {
      const cachedToken = getCachedToken();
      if (cachedToken) {
        setToken(cachedToken);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const newToken = await fetchTokenData();
        setToken(newToken);
        setCachedToken(newToken);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    getToken();
  }, []);

  return { token, isLoading, error };
};
