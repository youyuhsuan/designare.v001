import { useState, useEffect, useCallback } from "react";
import {
  deleteToken,
  fetchTokenData,
  getClientSideCachedToken,
  UserTokenData,
} from "@/src/utilities/token";

interface TokenState {
  token: UserTokenData | null;
  loading: boolean;
  error: Error | null;
}

export function useToken() {
  const [tokenState, setTokenState] = useState<TokenState>({
    token: null,
    loading: true,
    error: null,
  });

  const refreshToken = useCallback(async () => {
    setTokenState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const newToken = await fetchTokenData();
      setTokenState({ token: newToken, loading: false, error: null });
    } catch (error) {
      setTokenState((prev) => ({
        ...prev,
        loading: false,
        error: error as Error,
      }));
    }
  }, []);

  const removeToken = useCallback(async () => {
    if (tokenState.token) {
      setTokenState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        await deleteToken(tokenState.token.user.id);
        setTokenState({ token: null, loading: false, error: null });
      } catch (error) {
        setTokenState((prev) => ({
          ...prev,
          loading: false,
          error: error as Error,
        }));
      }
    }
  }, [tokenState.token]);

  useEffect(() => {
    async function initializeToken() {
      try {
        const cachedToken = await getClientSideCachedToken();
        if (cachedToken) {
          setTokenState({ token: cachedToken, loading: false, error: null });
        } else {
          await refreshToken();
        }
      } catch (error) {
        setTokenState({ token: null, loading: false, error: error as Error });
      }
    }

    initializeToken();
  }, [refreshToken]);

  return {
    ...tokenState,
    refreshToken,
    removeToken,
  };
}
