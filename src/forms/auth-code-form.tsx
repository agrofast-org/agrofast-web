import { useUser } from "@/contexts/auth-provider";
import { useLanguage } from "@/contexts/language-provider";
import { useOverlay } from "@/contexts/overlay-provider";
import { cn, numberInputMask } from "@/lib/utils";
import api from "@/service/api";
import {
  addToast,
  Button,
  Form,
  InputOtp,
  Skeleton,
  Spacer,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import Link from "@/components/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const TIMEOUT = 60;

const AuthCodeForm: React.FC = () => {
  const router = useRouter();
  const t = useTranslations();

  const { translateResponse } = useLanguage();
  const { setIsLoading } = useOverlay();
  const [isDataLoading, setIsDataLoading] = useState(false);
  const { user, setUser, setToken, logout } = useUser();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [timer, setTimer] = useState<number>(TIMEOUT);

  const resendCode = async () => {
    if (timer <= 0) {
      setIsLoading(true);
      api
        .get("/user/resend-code")
        .then(() => {
          addToast({
            title: t("Messages.titles.success"),
            description: t("Messages.success.authentication_code_resent"),
            color: "success",
          });
          setTimer(TIMEOUT);
        })
        .catch(() => {
          addToast({
            title: t("Messages.titles.warning"),
            description: t("Messages.errors.default"),
            color: "warning",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      addToast({
        title: t("Messages.titles.warning"),
        description: t("Messages.info.wait_resend_code_timeout", {
          seconds: timer,
        }),
        color: "warning",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));

    setIsLoading(true);
    api
      .get("/user/auth", { params: { code: data["code"] } })
      .then(({ data }) => {
        api.interceptors.request.use((config) => {
          config.headers.Authorization = `Bearer ${data.token}`;
          return config;
        });
        setUser(data.user);
        setToken(data.token);
        router.push("/");
      })
      .catch(({ response }) => {
        const { data: error } = response;
        if (response.status === 401) {
          addToast({
            title: t("Messages.titles.error"),
            description: t(
              "Messages.errors.authentication_code_attempts_exceeded"
            ),
            color: "danger",
          });
          logout();
          return;
        }
        const fields = translateResponse(error.fields, {
          attempts_left: error.attempts_left,
        });
        // toast.error(t("Responses.invalid_authentication_code", { attempts_left: error.attempts_left }));
        setErrors(fields);
        console.log("errors", errors);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

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
          <div className="flex flex-col items-center gap-1 w-full text-gray-700 dark:text-gray-200">
            <label
              htmlFor="code"
              className="text-[#12181c] dark:text-[#ecedee]"
            >
              {t("UI.placeholders.write_code")}
            </label>
            <InputOtp
              name="code"
              variant="bordered"
              length={4}
              className="mb-2"
              classNames={{
                input: "w-12 h-12 text-center text-2xl",
                helperWrapper:
                  "absolute min-w-max -bottom-[14px] -translate-x-1/2 left-1/2 flex justify-center",
              }}
              errorMessage={errors["code"]}
            />
          </div>
          <Skeleton
            className="inline-block rounded-lg"
            isLoaded={isDataLoading}
          >
            <p className="text-gray-700 dark:text-gray-200 text-small text-center">
              {t("UI.info.description.verification_code_sent")}{" "}
              <span className="font-bold">
                {user ? numberInputMask(user?.number) : "+55 (99) 99999-9999"}
              </span>
              . {t("UI.info.did_not_received_code")}{" "}
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
              .
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
