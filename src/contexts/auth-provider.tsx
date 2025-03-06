import { validateBrowserAgent } from "@/lib/validations";
import api from "@/service/api";
import { addToast } from "@heroui/react";
import { useTranslations } from "next-intl";
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

interface User {
  id: string;
  name: string;
  surname: string;
  number: string;
  email?: string;
  profile_picture?: string;
}

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
    throw new Error("useUser must be used within a AuthProvider");
  }
  return context;
};

export const PUBLIC_PATHS = [
  "/",
  "/login",
  "/sign-up",
  "/public",
  "/recover-token",
  "/reset-password",
];
export const USER_PATHS = ["/dashboard", "/user", "/profile", "/settings"];
export const ADMIN_PATHS = [
  "/admin/",
  "/admin/settings",
  "/admin/users",
  "/admin/dashboard",
  "/admin/products",
];

export const AUTH_TOKEN_KEY = `${process.env.NEXT_PUBLIC_SERVICE_ID}_auth_token`;
export const AUTH_BROWSER_AGENT_KEY = `${process.env.NEXT_PUBLIC_SERVICE_ID}_auth_browser_agent`;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const t = useTranslations();
  const { setIsPageLoading } = useOverlay();

  const [cookies, setCookie, removeCookie] = useCookies([
    AUTH_TOKEN_KEY,
    AUTH_BROWSER_AGENT_KEY,
  ]);

  const [authBrowserAgentLoaded, setAuthBrowserAgentLoaded] = useState(false);
  const [token, setAuthToken] = useState<string | undefined>(undefined);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | undefined>(undefined);

  const fetchInProgress = useRef(false);

  const setToken = useCallback(
    (token: string | undefined) => {
      if (token) {
        setAuthToken(token);
        setCookie(AUTH_TOKEN_KEY, token);
      } else {
        setAuthToken(undefined);
        removeCookie(AUTH_TOKEN_KEY);
      }
    },
    [setCookie, removeCookie]
  );

  const logout = useCallback(() => {
    setUser(undefined);
    setAuthToken(undefined);
    setToken(undefined);
    delete api.defaults.headers["Authorization"];
    router.push("/login", undefined, { locale: router.locale });
  }, [router, setToken]);

  const fetchBrowserAgent = useCallback(() => {
    if (authBrowserAgentLoaded || fetchInProgress.current) return;

    fetchInProgress.current = true;

    const storedBrowserAgent = cookies[AUTH_BROWSER_AGENT_KEY];

    const setBrowserAgent = (fingerprint: string) => {
      api.defaults.headers["Browser-Agent"] = fingerprint;
      setCookie(AUTH_BROWSER_AGENT_KEY, fingerprint);
    };

    const fetchAndSetBrowserAgent = async () => {
      try {
        const { data } = await api.get("/fingerprint");
        if (validateBrowserAgent(data.fingerprint)) {
          setBrowserAgent(data.fingerprint);
          setAuthBrowserAgentLoaded(true);
        } else {
          removeCookie(AUTH_BROWSER_AGENT_KEY);
          addToast({
            title: t("Messages.titles.error"),
            description: "Failed to fetch browser agent",
            color: "danger",
          });
        }
      } catch {
        addToast({
          title: t("Messages.titles.error"),
          description: "Failed to fetch browser agent",
          color: "danger",
        });
      } finally {
        fetchInProgress.current = false;
      }
    };

    const validateStoredBrowserAgent = async () => {
      try {
        await api.get("/fingerprint/validate", {
          headers: {
            "Browser-Agent": storedBrowserAgent,
          },
        });
        api.defaults.headers["Browser-Agent"] = storedBrowserAgent;
        setAuthBrowserAgentLoaded(true);
      } catch {
        fetchAndSetBrowserAgent();
      } finally {
        fetchInProgress.current = false;
      }
    };

    if (storedBrowserAgent && validateBrowserAgent(storedBrowserAgent)) {
      validateStoredBrowserAgent();
    } else {
      fetchAndSetBrowserAgent();
    }
  }, [authBrowserAgentLoaded, cookies, t, setCookie, removeCookie]);

  const fetchMe = useCallback(() => {
    if (fetchInProgress.current || user) return;

    fetchInProgress.current = true;

    const storedToken = cookies[AUTH_TOKEN_KEY];
    if (storedToken) {
      setAuthToken(storedToken);
    }
    if (storedToken && !user) {
      api.defaults.headers["Authorization"] = `Bearer ${storedToken}`;
      api
        .get("/user/info/me")
        .then(({ data }) => {
          setUser(data?.user);
          setAuthenticated(data?.authenticated ?? false);
        })
        .catch((err) => {
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
  }, [logout, user, cookies]);

  useEffect(() => {
    fetchBrowserAgent();
    fetchMe();
  }, [fetchBrowserAgent, fetchMe]);

  useEffect(() => {
    const url = router.pathname;

    if (!token && !PUBLIC_PATHS.includes(url)) {
      router.push("/login");
      return;
    }

    if (token && !authenticated) {
      router.push("/auth-code");
      return;
    }

    if (token && ADMIN_PATHS.includes(url)) {
      router.push("/dashboard");
      return;
    }

    if (
      token &&
      !USER_PATHS.includes(url) &&
      !PUBLIC_PATHS.includes(url)
    ) {
      router.push("/dashboard");
    }
    setIsPageLoading(false);
  }, [token, authenticated, user, router, setIsPageLoading]);

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
