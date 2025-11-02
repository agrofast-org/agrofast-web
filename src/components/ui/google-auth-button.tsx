import { Button, cn } from "@heroui/react";
import {
  useGoogleLogin,
  useGoogleOAuth,
  useGoogleOneTapLogin,
} from "@react-oauth/google";
import { GoogleIcon } from "../icon/google-icon";
import { useRouter } from "next/router";
import {
  AuthResponse,
  googleAuth,
  googleAuthV2,
} from "@/http/user/google-auth";
import { AUTHENTICATED_KEY } from "@/middleware";
import { cookieOptions } from "@/service/cookie";
import { useAuth } from "@/contexts/auth-provider";
import { useCookies } from "react-cookie";
import { useCallback } from "react";
import { useApp } from "@/contexts/app-context";
import { useAlert } from "@/contexts/alert-provider";
import { AxiosResponse } from "axios";
import { UseLoadingDisclosure } from "@/hooks/use-loading-disclosure";

export interface GoogleAuthButtonProps {
  children?: React.ReactNode;
  showIcon?: boolean;
  hidden?: boolean;
  loadingDisclosure?: UseLoadingDisclosure;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  children,
  showIcon = true,
  hidden = false,
  loadingDisclosure,
}) => {
  const router = useRouter();
  const { mounted } = useApp();
  const { setUser, setToken, token } = useAuth();
  const { addAlert } = useAlert();

  const [, setCookie] = useCookies([AUTHENTICATED_KEY]);

  const { scriptLoadedSuccessfully } = useGoogleOAuth();

  const showGoogleOAuthError = useCallback(() => {
    addAlert("google-auth-unavailable", {
      type: "error",
      title: "Login com google indisponível",
      message: "Não foi possível conectar com o Google no momento.",
    });
  }, [addAlert]);

  const googleLoginCallback = useCallback(
    (callback: Promise<AxiosResponse<AuthResponse>>) => {
      callback
        .then(({ data }) => {
          setToken(data.token);
          setUser();
          if (data.auth === "authenticate") {
            router.push("/web/auth-code");
          }
          if (data.auth === "authenticated") {
            setCookie(AUTHENTICATED_KEY, "true", cookieOptions);
            router.push("/web");
          }
        })
        .catch(() => {
          loadingDisclosure?.complete();
        });
    },
    [setToken, setUser, router, setCookie, loadingDisclosure]
  );

  const googleLogin = useGoogleLogin({
    onSuccess: (credentials) => {
      loadingDisclosure?.loading();
      googleLoginCallback(googleAuthV2(credentials));
    },
  });

  useGoogleOneTapLogin({
    onSuccess: (credentials) => {
      loadingDisclosure?.loading();
      googleLoginCallback(googleAuth(credentials));
    },
    onError: showGoogleOAuthError,
    disabled: !!token,
  });

  return (
    <Button
      className={cn(
        "bg-default-300/65 p-0 w-full !duration-75 google-login-button",
        hidden && "!hidden"
      )}
      tabIndex={-1}
      color="default"
      hidden={hidden}
      isLoading={!mounted || !!token}
      isDisabled={!scriptLoadedSuccessfully}
      onPress={() => {
        googleLogin();
        if (!scriptLoadedSuccessfully) {
          showGoogleOAuthError();
        }
      }}
    >
      {showIcon && <GoogleIcon width={24} />}
      {children}
    </Button>
  );
};
