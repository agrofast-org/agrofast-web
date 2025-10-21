import { Button, cn } from "@heroui/react";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleIcon } from "../icon/google-icon";
import { useRouter } from "next/router";
import { googleAuth } from "@/http/user/google-auth";
import { useToast } from "@/service/toast";
import { AUTHENTICATED_KEY } from "@/middleware";
import { cookieOptions } from "@/service/cookie";
import { useUser } from "@/contexts/auth-provider";
import { useCookies } from "react-cookie";
import { useState } from "react";
import { useApp } from "@/contexts/app-context";

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
  const toast = useToast();
  const { mounted } = useApp();
  const { setUser, setToken, user } = useUser();

  const [, setCookie] = useCookies([AUTHENTICATED_KEY]);

  const [focused, setFocused] = useState<boolean>(false);

  const component = (
    <GoogleLogin
      useOneTap
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
      onError={() => {
        toast.error({
          title: "Erro ao conectar",
          description: "Não foi possível conectar com o Google.",
        });
      }}
      containerProps={{
        onFocus: () => setFocused(true),
        onBlur: () => setFocused(false),
      }}
    />
  );

  console.log(!mounted || !!user);
  

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
      isLoading={!mounted || !!user}
    >
      {(!user && mounted) && component}
      {showIcon && <GoogleIcon width={24} />}{children}
    </Button>
  );
};
