import { validateBrowserAgent } from "@/lib/validations";
import api, {
  setBearerToken,
  setBrowserAgent as setBrowserFingerprint,
} from "@/service/api";
import { useRouter } from "next/router";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useCookies } from "react-cookie";
import { useOverlay } from "./overlay-provider";
import { User } from "@/types/user";
import { useToast } from "@/service/toast";
import { AxiosError } from "axios";
import { getMe } from "@/http/user/get-me";
import { validateFingerprint } from "@/http/validate-fingerprint";

interface AuthContextProps {
  token: string | undefined;
  setToken: (token: string | undefined) => void;
  user: User | undefined;
  setUser: (user: User | undefined) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useUser = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useUser must be used within an AuthProvider");
  }
  return context;
};

export const PUBLIC_PATHS = [
  "/login",
  "/sign-up",
  "/recover-token",
  "/reset-password",
];
export const PUBLIC_AUTH_PATHS = ["/auth-code", "/auth-with"];
export const USER_PATHS = ["/", "/dashboard", "/user", "/profile", "/settings"];

export const AUTH_TOKEN_KEY = `${process.env.NEXT_PUBLIC_SERVICE_ID}_auth_token`;
export const AUTH_BROWSER_AGENT_KEY = `${process.env.NEXT_PUBLIC_SERVICE_ID}_auth_browser_agent`;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const toast = useToast();
  const { setIsPageLoading } = useOverlay();

  const [cookies, setCookie, removeCookie] = useCookies([
    AUTH_TOKEN_KEY,
    AUTH_BROWSER_AGENT_KEY,
  ]);

  const [isBrowserAgentLoaded, setIsBrowserAgentLoaded] = useState(false);
  const [token, setAuthTokenState] = useState<string | undefined>(undefined);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | undefined>(undefined);

  const fetchInProgress = useRef(false);

  const setToken = useCallback(
    (tokenValue: string | undefined) => {
      if (tokenValue) {
        setAuthTokenState(tokenValue);
        setCookie(AUTH_TOKEN_KEY, tokenValue);
      } else {
        setAuthTokenState(undefined);
        removeCookie(AUTH_TOKEN_KEY);
      }
    },
    [setCookie, removeCookie]
  );

  const logout = useCallback(() => {
    setUser(undefined);
    setToken(undefined);
    delete api.defaults.headers["Authorization"];
    router.push("/login", undefined, { locale: router.locale });
  }, [router, setToken]);

  const fetchBrowserAgent = useCallback(async () => {
    if (isBrowserAgentLoaded || fetchInProgress.current) return;
    fetchInProgress.current = true;

    const storedBrowserAgent = cookies[AUTH_BROWSER_AGENT_KEY];

    const setBrowserAgent = (fingerprint: string) => {
      setBrowserFingerprint(fingerprint);
      setCookie(AUTH_BROWSER_AGENT_KEY, fingerprint);
    };

    const fetchAndSetBrowserAgent = async () => {
      try {
        const { data } = await api.get("/fingerprint");
        if (validateBrowserAgent(data.fingerprint)) {
          setBrowserAgent(data.fingerprint);
          setIsBrowserAgentLoaded(true);
        } else {
          removeCookie(AUTH_BROWSER_AGENT_KEY);
          toast.error({ description: "Failed to fetch browser agent" });
        }
      } catch {
        toast.error({ description: "Failed to fetch browser agent" });
      } finally {
        fetchInProgress.current = false;
      }
    };

    const validateStoredBrowserAgent = async () => {
      validateFingerprint(storedBrowserAgent).then(() => {
        setBrowserAgent(storedBrowserAgent);
        setIsBrowserAgentLoaded(true);
      }).catch(() => {
        fetchAndSetBrowserAgent();
      }
      ).finally(() => {
        fetchInProgress.current = false;
      });
    };

    if (storedBrowserAgent && validateBrowserAgent(storedBrowserAgent)) {
      await validateStoredBrowserAgent();
    } else {
      await fetchAndSetBrowserAgent();
    }
  }, [isBrowserAgentLoaded, cookies, toast, setCookie, removeCookie]);

  const fetchMe = useCallback(async () => {
    if (fetchInProgress.current || user) return;
    fetchInProgress.current = true;

    const storedToken = cookies[AUTH_TOKEN_KEY];
    if (storedToken) {
      setToken(storedToken);
      setBearerToken(storedToken);
      getMe()
        .then(({ data }) => {
          setUser(data.user);
          setAuthenticated(data.authenticated);
        })
        .catch((err: AxiosError) => {
          if (err.response?.status === 401) {
            logout();
          }
        })
        .finally(() => {
          fetchInProgress.current = false;
        });
    } else {
      fetchInProgress.current = false;
    }
  }, [logout, user, cookies, setToken]);

  useEffect(() => {
    fetchBrowserAgent();
    fetchMe();
  }, [fetchBrowserAgent, fetchMe]);

  useEffect(() => {
    const currentPath = router.pathname;
    const unauthenticatedPaths = [...PUBLIC_PATHS, ...PUBLIC_AUTH_PATHS];
    const allAllowedPaths = [...unauthenticatedPaths, ...USER_PATHS];

    if (!allAllowedPaths.includes(currentPath)) {
      setIsPageLoading(false);
      return;
    }

    if (
      !token &&
      (!PUBLIC_PATHS.includes(currentPath) ||
        PUBLIC_AUTH_PATHS.includes(currentPath))
    ) {
      router.push("/login", undefined, { locale: router.locale });
      return;
    }

    if (token && !authenticated && !PUBLIC_AUTH_PATHS.includes(currentPath)) {
      router.push(PUBLIC_AUTH_PATHS[0], undefined, { locale: router.locale });
      return;
    }

    if (token && authenticated && unauthenticatedPaths.includes(currentPath)) {
      router.push("/dashboard", undefined, { locale: router.locale });
      return;
    }

    setIsPageLoading(false);
  }, [token, authenticated, router, setIsPageLoading]);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        user,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
