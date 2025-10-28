import { Checkbox } from "@/components/input/checkbox";
import { Input } from "@/components/input/input";
import { useAuth } from "@/contexts/auth-provider";
import { useTranslations } from "next-intl";
import Link from "@/components/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { login } from "@/http/user/login";
import { AUTHENTICATED_KEY } from "@/middleware";
import { useCookies } from "react-cookie";
import { Button } from "@/components/button";
import { cookieOptions } from "@/service/cookie";
import { RequestForm } from "@/components/request-form";
import { GoogleAuthButton } from "@/components/ui/google-auth-button";

const LoginForm: React.FC = () => {
  const router = useRouter();
  const t = useTranslations();
  const { setUser, setToken } = useAuth();

  const [, setCookie] = useCookies([AUTHENTICATED_KEY]);

  const [email, setEmail] = useState<string>("");

  return (
    <RequestForm
      className="!flex !flex-col flex-1 gap-4"
      initialData={router.query}
      onSubmit={login}
      onSuccess={({ data }) => {
        setToken(data.token);
        setUser();
        if (data.auth === "authenticate") {
          router.push("/web/auth-code");
        }
        if (data.auth === "authenticated") {
          setCookie(AUTHENTICATED_KEY, "true", cookieOptions);
          router.push("/web");
        }
      }}
    >
      <div className="flex flex-col flex-1 md:flex-auto gap-4 w-full">
        <Input
          name="email"
          type="email"
          label={t("UI.labels.email")}
          placeholder={t("UI.placeholders.write_email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          isRequired
        />
        <Input
          name="password"
          type="password"
          label={t("UI.labels.password")}
          placeholder={t("UI.placeholders.write_password")}
          className="text-gray-700 dark:text-gray-200"
          taggableVisibility
          isRequired
        />
        <div className="flex md:flex-row flex-col justify-between items-start md:items-center gap-2 px-1 py-2 w-full">
          <Checkbox defaultSelected name="remember" value="true" size="sm">
            {t("UI.checkboxes.remember_me")}
          </Checkbox>
          <Link
            href="/web/reset-password"
            className="hover:opacity-80 min-w-max font-medium text-primary text-sm hover:underline transition-all"
          >
            {t("UI.redirects.forgot_password")}
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <Button className="w-full" color="primary" type="submit">
          {t("UI.buttons.enter")}
        </Button>
        <GoogleAuthButton>Entrar com Google</GoogleAuthButton>
        <p className="text-small text-center">
          <Link
            href={{
              pathname: "/web/sign-up",
              query: {
                email: email,
              },
            }}
            className="hover:opacity-80 font-medium text-primary text-sm hover:underline transition-all"
          >
            {t("UI.redirects.create_account")}
          </Link>
        </p>
      </div>
    </RequestForm>
  );
};

export default LoginForm;
