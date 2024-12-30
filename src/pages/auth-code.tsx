import Body from "@/components/body";
import {
  Button,
  Form,
  InputOtp,
  Link,
  Skeleton,
  Spacer,
} from "@nextui-org/react";
import Agrofast from "@/components/ui/agrofast";
import { useTranslations } from "next-intl";
import { getStaticPropsWithMessages } from "@/lib/getStaticProps";
import Head from "next/head";
import api from "@/service/api";
import { useRouter } from "next/router";
import { useLanguage } from "@/contexts/language-provider";
import { useOverlay } from "@/contexts/overlay-provider";
import { useEffect, useState } from "react";
import { useUser } from "@/contexts/auth-provider";
import { numberInputMask } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AuthCode() {
  const router = useRouter();
  const t = useTranslations();
  const { translateResponse } = useLanguage();
  const { setIsLoading } = useOverlay();
  const [isDataLoading, setIsDataLoading] = useState(false);
  const { user, setUser, setToken, logout } = useUser();

  const [errors, setErrors] = useState<Record<string, string>>({});

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
          toast.error(t("Responses.authentication_code_attempts_exceeded"));
          logout();
          return;
        }
        const fields = translateResponse(error.fields);
        toast.error(t("Responses.invalid_authentication_code"));
        setErrors(fields);
        console.log("errors", errors);
      })
      .finally(() => {
        setIsLoading(false);
      });
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
      <Head>
        <title>{t("AuthCode.meta_title")}</title>
        <meta name="description" content={t("AuthCode.meta_description_1")} />
      </Head>
      <Body className="flex flex-row" hideHeader>
        <div className="flex flex-[5] justify-center md:items-center max-h-svh overflow-hidden overflow-y-auto">
          <div className="flex flex-col gap-4 px-8 py-6 w-full max-w-md min-h-max">
            <div className="flex flex-col items-center gap-2">
              <Agrofast.Logo className="w-40 h-10" />
            </div>
            <Skeleton
              className="inline-block rounded-lg h-6"
              isLoaded={isDataLoading}
            >
              <p className="pb-2 font-semibold text-gray-700 text-left text-xl dark:text-gray-200">
                {t("Base.welcome_again", { name: user?.name })}
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
                    {t("Base.write_code")}
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
                  <p className="text-center text-gray-700 text-small dark:text-gray-200">
                    {t("Base.verification_code_sent_message")}{" "}
                    <span className="font-bold">
                      {user
                        ? numberInputMask(user?.number)
                        : "+55 (99) 99999-9999"}
                    </span>
                    . {t("Base.did_not_received_code")}{" "}
                    <span className="hover:opacity-80 text-primary hover:underline cursor-pointer">
                      {t("Base.resend_code")}
                    </span>
                    .
                  </p>
                </Skeleton>
                <Spacer y={16} />
              </div>
              <div className="flex flex-col gap-4 w-full">
                <Button className="w-full" color="primary" type="submit">
                  {t("Base.continue")}
                </Button>
                <p className="w-full text-center text-small">
                  <Link href="/login" size="sm">
                    {t("Base.enter_another_account")}
                  </Link>
                </p>
              </div>
            </Form>
          </div>
        </div>
      </Body>
    </>
  );
}

export const getStaticProps = getStaticPropsWithMessages;
