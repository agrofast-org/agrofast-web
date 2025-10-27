import { Button, cn } from "@heroui/react";
import { GoogleLogin, useGoogleOAuth } from "@react-oauth/google";
import { GoogleIcon } from "../icon/google-icon";
import { useRouter } from "next/router";
import { googleAuth } from "@/http/user/google-auth";
import { AUTHENTICATED_KEY } from "@/middleware";
import { cookieOptions } from "@/service/cookie";
import { useUser } from "@/contexts/auth-provider";
import { useCookies } from "react-cookie";
import { useCallback, useState } from "react";
import { useApp } from "@/contexts/app-context";
import { useAlert } from "@/contexts/alert-provider";

export interface GoogleAuthButtonProps {
  children?: React.ReactNode;
  showIcon?: boolean;
  hidden?: boolean;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  children,
  showIcon = true,
  hidden = false,
}) => {
  const router = useRouter();
  const { mounted } = useApp();
  const { setUser, setToken, token } = useUser();
  const { addAlert } = useAlert();

  const [, setCookie] = useCookies([AUTHENTICATED_KEY]);

  const [focused, setFocused] = useState<boolean>(false);

  const { scriptLoadedSuccessfully } = useGoogleOAuth();

  const showGoogleOAuthError = useCallback(() => {
    addAlert("google-auth-unavailable", {
      type: "error",
      title: "Login com google indisponível",
      message: "Não será possível conectar com o Google no momento.",
    });
  }, [addAlert]);

  const component = (
    <GoogleLogin
      // useOneTap
      theme="outline"
      locale={router.locale ?? "pt-BR"}
      onSuccess={(credentials) => {
        googleAuth(credentials).then(({ data }) => {
          setToken(data.token);
          setUser(data.user);
          if (data.auth === "authenticate") {
            router.push("/web/auth-code");
          }
          if (data.auth === "authenticated") {
            setCookie(AUTHENTICATED_KEY, "true", cookieOptions);
            router.push("/web");
          }
        });
      }}
      onError={showGoogleOAuthError}
      // auto_select
      // cancel_on_tap_outside
      containerProps={{
        onFocus: () => setFocused(true),
        onBlur: () => setFocused(false),
      }}
    />
  );

  return (
    <Button
      className={cn(
        "bg-default-300/65 p-0 w-full !duration-75 google-login-button",
        hidden && "!hidden"
      )}
      tabIndex={-1}
      color="default"
      data-focus={focused}
      data-focus-visible={focused}
      hidden={hidden}
      isLoading={!mounted || !!token}
      isDisabled={!scriptLoadedSuccessfully}
      onPress={() => {
        if (!scriptLoadedSuccessfully) {
          showGoogleOAuthError();
        }
      }}
    >
      {!token && mounted && component}
      {showIcon && <GoogleIcon width={24} />}
      {children}
    </Button>
  );
};
