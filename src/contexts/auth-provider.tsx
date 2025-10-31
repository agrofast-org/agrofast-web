// providers/AuthProvider.tsx
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { api } from "@/service/api";
import { getMe } from "@/http/user/get-me";
import { AUTH_TOKEN_KEY, AUTHENTICATED_KEY } from "@/middleware";
import { Carrier, Machinery, User } from "@/types/user";
import { useOverlay } from "./overlay-provider";
import { cookieOptions } from "@/service/cookie";
import { getMachinery } from "@/http/machinerie/get-machinery";
import { getCarrier } from "@/http/carrier/get-carriers";
import { useLocalStorage } from "ilias-use-storage";
import { googleLogout } from "@react-oauth/google";
import { useQuery } from "@tanstack/react-query";
import { DefinePassword } from "@/components/ui/setup-password";

interface AuthContextProps {
  token: string | undefined;
  setToken: (token: string | undefined) => void;
  user: User | undefined;
  setUser: () => void;
  hasPassword: boolean;
  machinery: Machinery[] | undefined;
  carriers: Carrier[] | undefined;
  transportLoaded: boolean;
  refetchTransportData: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const { setIsPageLoading } = useOverlay();

  const [cookies, setCookie, removeCookie] = useCookies([
    AUTH_TOKEN_KEY,
    AUTHENTICATED_KEY,
  ]);
  const [token, setAuthTokenState] = useState<string | undefined>(undefined);
  const [localStoredUser, setLocalStoredUser, removeLocalStoredUser] =
    useLocalStorage<User | undefined>("user", undefined);
  const [hasPassword, setHasPassword] = useState<boolean>(true);
  const {
    data: user,
    isFetched: userFetched,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["me"],
    queryFn: () =>
      getMe()
        .then(({ data }) => {
          setLocalStoredUser(data.user);
          if (data.authenticated) {
            setCookie(AUTHENTICATED_KEY, data.authenticated, cookieOptions);
          }
          setHasPassword(data.has_password);
          return data.user;
        })
        .catch(() => {
          return undefined;
        }),
    enabled: !!token,
    initialData: localStoredUser,
  });

  const canLoadTransport = !!token && userFetched;
  const [transportLoaded, setTransportLoaded] = useState<boolean>(false);
  const { data: machinery, refetch: refetchMachinery } = useQuery<Machinery[]>({
    queryKey: ["machinery"],
    queryFn: () =>
      getMachinery().then(({ data }) => {
        setTransportLoaded(true);
        return data;
      }),
    enabled:
      canLoadTransport &&
      user?.profile_type === "requester" &&
      cookies[AUTHENTICATED_KEY] === true,
  });
  const { data: carriers, refetch: refetchCarriers } = useQuery<Carrier[]>({
    queryKey: ["carriers"],
    queryFn: () =>
      getCarrier().then(({ data }) => {
        setTransportLoaded(true);
        return data;
      }),
    enabled:
      canLoadTransport &&
      user?.profile_type === "transporter" &&
      cookies[AUTHENTICATED_KEY] === true,
  });

  const refetchTransportData = useCallback(() => {
    if (user?.profile_type === "requester") {
      refetchMachinery();
    }
    if (user?.profile_type === "transporter") {
      refetchCarriers();
    }
  }, [user, refetchMachinery, refetchCarriers]);

  const setToken = useCallback(
    (tokenValue: string | undefined) => {
      if (tokenValue) {
        setAuthTokenState(tokenValue);
        setCookie(AUTH_TOKEN_KEY, tokenValue, cookieOptions);
      } else {
        setAuthTokenState(undefined);
        removeCookie(AUTHENTICATED_KEY, cookieOptions);
        removeCookie(AUTH_TOKEN_KEY, cookieOptions);
        delete api.defaults.headers["Authorization"];
      }
    },
    [setCookie, removeCookie]
  );

  const logout = useCallback(() => {
    removeLocalStoredUser();
    setToken(undefined);
    googleLogout();
    refetchUser();
    router.push("/web/login");
  }, [router, removeLocalStoredUser, setToken, refetchUser]);

  const fetchMe = useCallback(async () => {
    const storedToken = cookies[AUTH_TOKEN_KEY];
    if (storedToken) {
      setToken(storedToken);
      getMe()
        .then(({ data }) => {
          setLocalStoredUser(data.user);
          if (data.authenticated) {
            setCookie(AUTHENTICATED_KEY, data.authenticated, cookieOptions);
            return;
          }
          if (
            !cookies[AUTHENTICATED_KEY] ||
            cookies[AUTHENTICATED_KEY] !== true ||
            !data.authenticated
          ) {
            removeCookie(AUTHENTICATED_KEY);
          }
        })
        .catch(({ response }) => {
          if (response?.status === 401) {
            logout();
          }
        })
        .finally(() => {
          setIsPageLoading(false);
        });
    } else {
      setIsPageLoading(false);
    }
  }, [
    cookies,
    logout,
    setLocalStoredUser,
    setToken,
    setCookie,
    removeCookie,
    setIsPageLoading,
  ]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const setUser = useCallback(() => {
    refetchUser();
  }, [refetchUser]);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        user,
        hasPassword,
        setUser,
        machinery,
        carriers,
        transportLoaded,
        refetchTransportData,
        logout,
      }}
    >
      <DefinePassword />
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
