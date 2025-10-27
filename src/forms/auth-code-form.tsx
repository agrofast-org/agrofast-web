import { useAuth } from "@/contexts/auth-provider";
import { useOverlay } from "@/contexts/overlay-provider";
import { cn } from "@/lib/utils";
import { Button, Skeleton, Spacer } from "@heroui/react";
import { useTranslations } from "next-intl";
import Link from "@/components/link";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { getAuthCodeLength } from "@/http/get-auth-code-length";
import { auth, AuthError } from "@/http/user/auth";
import { useToast } from "@/service/toast";
import useCountdown from "@/hooks/use-countdown";
import { resendCode } from "@/http/user/resend-code";
import { AxiosError } from "axios";
import { InputOtp } from "@/components/input/input-otp";
import { useCookies } from "react-cookie";
import { AUTHENTICATED_KEY } from "@/middleware";
import { cookieOptions } from "@/service/cookie";
import { RequestForm } from "@/components/request-form";
import { useApp } from "@/contexts/app-context";

const TIMEOUT = 60;

const AuthCodeForm: React.FC = () => {
  const router = useRouter();
  const t = useTranslations();
  const toast = useToast();
  const { mounted } = useApp();

  const [, setCookie] = useCookies([AUTHENTICATED_KEY]);

  const { setIsLoading } = useOverlay();
  const { user, setUser, setToken, logout } = useAuth();

  const { time, setTime } = useCountdown(TIMEOUT);

  const { data: codeLength, isLoading: codeLengthLoading } = useQuery<number>({
    queryKey: ["auth-code-length"],
    queryFn: async () => {
      const res = await getAuthCodeLength();
      return res.data ?? 6;
    },
  });

  const handleResendCode = async () => {
    if (time <= 0) {
      setIsLoading(true);
      resendCode()
        .then(() => {
          toast.success({
            description: t("Messages.success.authentication_code_resent"),
          });
          setTime(TIMEOUT);
        })
        .catch(() => {
          toast.error({
            description: t("Messages.errors.default"),
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      toast.warning({
        description: t("Messages.info.wait_resend_code_timeout", {
          seconds: time,
        }),
      });
    }
  };

  return (
    <>
      <Skeleton className="inline-block rounded-lg h-6" isLoaded={mounted}>
        {mounted && user?.name && (
          <p className="pb-2 font-semibold text-gray-700 dark:text-gray-200 text-xl text-left">
            {t("UI.titles.welcome_again", { name: user?.name })}
            <span aria-label="emoji" className="ml-2" role="img">
              👋
            </span>
          </p>
        )}
      </Skeleton>
      <RequestForm
        className="flex flex-col flex-1 md:flex-auto"
        onSubmit={auth}
        onSuccess={({ data }) => {
          setUser();
          setToken(data.token);
          setCookie(AUTHENTICATED_KEY, "true", cookieOptions);
          router.push("/web");
        }}
        onError={(error: AxiosError<AuthError>) => {
          if (error?.response?.data?.attempts) {
            const params = {
              attempts_left: error?.response?.data?.attempts?.toString() || "0",
            };
            toast.error({
              description: t(
                "Messages.errors.authentication_code_attempts",
                params
              ),
            });
            return;
          }
          if (
            error?.response?.data?.message ===
            "authentication_code_attempts_exceeded"
          ) {
            toast.error({
              description: t(
                "Messages.errors.authentication_code_attempts_exceeded"
              ),
            });
            logout();
            return;
          }
          toast.error({
            description: t("Messages.errors.default"),
          });
        }}
      >
        <div className="flex flex-col flex-1 gap-4">
          <div className="flex flex-col items-center gap-1 rounded-lg w-full text-gray-700 dark:text-gray-200">
            <label
              htmlFor="code"
              className="text-[#12181c] dark:text-[#ecedee]"
            >
              {t("UI.placeholders.write_code")}
            </label>
            <Skeleton
              className="rounded-lg h-14"
              isLoaded={!codeLengthLoading && mounted}
            >
              <InputOtp
                name="code"
                className="mb-2"
                variant="bordered"
                length={codeLength || 6}
              />
            </Skeleton>
          </div>
          <Skeleton className="inline-block rounded-lg" isLoaded={mounted}>
            {mounted && (
              <p className="font-normal text-gray-700 text-small dark:text-gray-200 text-center">
                {t.rich("UI.info.email_verification_code_sent", {
                  email: () => <span className="font-bold">{user?.email}</span>,
                  action: () => (
                    <span
                      onClick={handleResendCode}
                      className={cn(
                        time <= 0
                          ? "hover:underline cursor-pointer text-primary"
                          : "text-neutral-600 dark:text-neutral-400 cursor-not-allowed"
                      )}
                    >
                      {t("UI.buttons.resend_code")}
                      {time <= 0 ? "" : `(${time})`}
                    </span>
                  ),
                })}
              </p>
            )}
          </Skeleton>
          <Spacer y={16} />
        </div>
        <div className="flex flex-col gap-4 w-full">
          <Button className="w-full" color="primary" type="submit">
            {t("UI.buttons.continue")}
          </Button>
          <p className="w-full text-small text-center" onClick={logout}>
            <Link href="/web/login">
              {t("UI.redirects.enter_another_account")}
            </Link>
          </p>
        </div>
      </RequestForm>
    </>
  );
};

export default AuthCodeForm;
