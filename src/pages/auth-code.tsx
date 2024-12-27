import Body from "@/components/body";
import { Button, Form, InputOtp, Link, Spacer } from "@nextui-org/react";
import Agrofast from "@/components/ui/agrofast";
import { useTranslations } from "next-intl";
import { getStaticPropsWithMessages } from "@/lib/getStaticProps";
import Head from "next/head";

export default function AuthCode() {
  const t = useTranslations();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("handleSubmit");
  };

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
            <p className="pb-2 font-semibold text-gray-700 text-left text-xl dark:text-gray-200">
              {t("Base.welcome_again", { name: "John Doe" })}
              <span aria-label="emoji" className="ml-2" role="img">
                👋
              </span>
            </p>
            <Form
              className="flex flex-col flex-1 md:flex-auto"
              validationBehavior="native"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col flex-1 gap-4">
                <div className="flex flex-col items-center gap-1 w-full text-gray-700 dark:text-gray-200">
                  <label
                    htmlFor="auth-code"
                    className="text-[#12181c] dark:text-[#ecedee]"
                  >
                    {t("Base.write_code")}
                  </label>
                  <InputOtp name="auth-code" variant="bordered" length={4} />
                </div>
                <p className="text-center text-gray-700 text-small dark:text-gray-200">
                  {t("Base.verification_code_sent_message")}{" "}
                  <span className="font-bold">+55 99 99999-9999</span>.{" "}
                  {t("Base.did_not_received_code")}{" "}
                  <span className="hover:opacity-80 text-primary hover:underline cursor-pointer">
                    {t("Base.resend_code")}
                  </span>
                  .
                </p>
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
