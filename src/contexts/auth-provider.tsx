import useLocalStorage from "@/lib/useLocalstorage";
import api from "@/service/api";
import { useRouter } from "next/router";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

interface User {
  name: string;
  surname: string;
  number: string;
  email: string;
  profile_picture: string;
}

interface Login {
  number: string;
  password: string;
}

interface AuthContextProps {
  user: User | undefined;
  SignUp: (user: User) => void;
  Login: (login: Login) => void;
  Authenticate: (code: string) => void;
  Logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useUser = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useUser must be used within a AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [token, setToken] = useLocalStorage<string | undefined>(
    "agrofast_auth_token",
    undefined
  );
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    if (token) {
      api.defaults.headers["Authorization"] = `Bearer ${token}`;
      api
        .get("/user/me")
        .then((data) => {
          setUser(data.data?.user);
        })
        .catch(() => {
          console.log("error on get user with stored token");
        })
        .then(() => {});
    }
  }, [token]);

  const SignUp = async (user: User) => {
    api
      .post("/user/sign-up", user)
      .then((data) => {
        setUser(data.data?.user);
        setToken(data.data?.token);
        api.defaults.headers["Authorization"] = `Bearer ${data.data?.token}`;
      })
      .catch(() => {
        console.log("error on signing up");
      })
      .then(() => {});
  };

  const Login = async ({ number, password }: Login) => {
    api
      .post("/user/login", { number, password })
      .then((data) => {
        setUser(data.data?.user);
        setToken(data.data?.token);
        api.defaults.headers["Authorization"] = `Bearer ${data.data?.token}`;
      })
      .catch(() => {
        console.log("error on login");
      })
      .then(() => {});
  };

  const Authenticate = async (code: string) => {
    api
      .get("/user/authenticate", { params: { code } })
      .then((data) => {
        setUser(data.data?.user);
        setToken(data.data?.token);
        api.defaults.headers["Authorization"] = `Bearer ${data.data?.token}`;
      })
      .catch(() => {
        console.log("error on authenticating");
      })
      .then(() => {});
  };

  const Logout = () => {
    setUser(undefined);
    setToken(undefined);
    delete api.defaults.headers["Authorization"];
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, SignUp, Login, Authenticate, Logout }}>
      {children}
    </AuthContext.Provider>
  );
};
