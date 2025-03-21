import { useAuth } from "@/contexts/auth-provider";
import { useLanguage } from "@/contexts/language-provider";
import { useOverlay } from "@/contexts/overlay-provider";
import { cn } from "@/lib/utils";
import { Button, Form, InputOtp, Skeleton, Spacer } from "@heroui/react";
import { useTranslations } from "next-intl";
import Link from "@/components/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAuthCodeLength,
} from "@/http/get-auth-code-length";
import { auth } from "@/http/user/auth";
import { MutationError } from "@/types/mutation-error";
import { useToast } from "@/service/toast";
import { useCountdown } from "@/lib/useCountdown";

const TIMEOUT = 60;

const AuthCodeForm: React.FC = () => {
  const router = useRouter();
  const t = useTranslations();
  const toast = useToast();

  const { translateResponse } = useLanguage();
  const { setIsLoading } = useOverlay();
  const [isDataLoading, setIsDataLoading] = useState(false);
  const { user, setUser, setToken, logout } = useAuth();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [timer, setTimer] = useCountdown(TIMEOUT);

  const { data: codeLength, isLoading: codeLengthLoading } = useQuery({
    queryKey: ["auth-code-length"],
    queryFn: async () => {
      const res = await getAuthCodeLength();
      return res.data.length;
    },
  });

  const resendCode = async () => {
    if (timer <= 0) {
      setIsLoading(true);
      resendCode()
        .then(() => {
          toast.success({
            description: t("Messages.success.authentication_code_resent"),
          });
          setTimer(TIMEOUT);
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
          seconds: timer,
        }),
      });
    }
  };

  const authMutation = useMutation({
    mutationFn: auth,
    onSuccess: (result) => {
      if ("data" in result && result.data) {
        setUser(result.data.data.user);
        setToken(result.data.data.token);
        router.push("/");
      }
      setIsLoading(false);
    },
    onError: (error: MutationError) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorResponse = (error as any).response;
      if (errorResponse && errorResponse.status === 401) {
        toast.error({
          description: t(
            "Messages.errors.authentication_code_attempts_exceeded"
          ),
        });
        logout();
      } else if (errorResponse) {
        const params = {
          attempts_left: errorResponse.data.attempts_left,
        };
        const fields = translateResponse(errorResponse.data.fields, params);
        toast.error({
          description: t("Messages.errors.invalid_authentication_code", params),
        });
        setErrors(fields);
      } else {
        toast.error({
          description: t("Messages.errors.default"),
        });
      }
      setIsLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget));
    authMutation.mutateAsync(formData["code"] as string);
  };

  useEffect(() => {
    if (user) {
      setIsDataLoading(true);
      return;
    }
    setIsDataLoading(false);
  }, [user]);

  return (
    <>
      <Skeleton
        className="inline-block rounded-lg h-6"
        isLoaded={isDataLoading}
      >
        <p className="pb-2 font-semibold text-gray-700 dark:text-gray-200 text-xl text-left">
          {t("UI.titles.welcome_again", { name: user?.name })}
          <span aria-label="emoji" className="ml-2" role="img">
            👋
          </span>
        </p>
      </Skeleton>
      <Form
        className="flex flex-col flex-1 md:flex-auto"
        validationBehavior="native"
        validationErrors={errors}
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col flex-1 gap-4">
          <div className="flex flex-col items-center gap-1 rounded-lg w-full text-gray-700 dark:text-gray-200">
            <label
              htmlFor="code"
              className="text-[#12181c] dark:text-[#ecedee]"
            >
              {t("UI.placeholders.write_code")}
            </label>
            <Skeleton className="rounded-lg h-14" isLoaded={!codeLengthLoading}>
              <InputOtp
                name="code"
                variant="bordered"
                length={codeLength || 6}
                className="mb-2"
                classNames={{
                  input: "w-12 h-12 text-center text-2xl",
                  helperWrapper:
                    "absolute min-w-max -bottom-[14px] -translate-x-1/2 left-1/2 flex justify-center",
                }}
              />
            </Skeleton>
          </div>
          <Skeleton
            className="inline-block rounded-lg"
            isLoaded={isDataLoading}
          >
            <p className="text-gray-700 dark:text-gray-200 text-small text-center">
              {t.rich("UI.info.email_verification_code_sent", {
                email: () => <span className="font-bold">{user?.email}</span>,
                action: () => (
                  <span
                    onClick={resendCode}
                    className={cn(
                      timer <= 0
                        ? "opacity-100 hover:underline cursor-pointer text-primary"
                        : "opacity-60 text-neutral-400"
                    )}
                  >
                    {t("UI.buttons.resend_code")}
                    {timer <= 0 ? "" : `(${timer})`}
                  </span>
                ),
              })}
            </p>
          </Skeleton>
          <Spacer y={16} />
        </div>
        <div className="flex flex-col gap-4 w-full">
          <Button className="w-full" color="primary" type="submit">
            {t("UI.buttons.continue")}
          </Button>
          <p className="w-full text-small text-center">
            <Link href="/login">{t("UI.redirects.enter_another_account")}</Link>
          </p>
        </div>
      </Form>
    </>
  );
};

export default AuthCodeForm;
