import Layout from "@/components/layout";
import { Button, Form, InputOtp, Link, Spacer } from "@nextui-org/react";
import Agrofast from "@/components/ui/agrofast";
import { useTranslations } from "next-intl";
import { getStaticPropsWithMessages } from "@/lib/getStaticProps";

export default function Login() {
  const t = useTranslations();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("handleSubmit");
  };

  return (
    <Layout className="flex flex-row" hideHeader>
      <div className="flex flex-[5] md:items-center justify-center max-h-svh overflow-hidden overflow-y-auto">
        <div className="flex w-full max-w-md min-h-max flex-col gap-4 px-2 py-6">
          <div className="flex flex-col items-center gap-2">
            <Agrofast.Logo className="w-40 h-10" />
          </div>
          <p className="pb-2 text-left text-xl text-gray-700 dark:text-gray-200 font-semibold">
            {t("Base.welcome_again", { name: "Agrofast" })}
          </p>
          <Form
            className="flex flex-col gap-4"
            validationBehavior="native"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col items-center w-full gap-1 text-gray-700 dark:text-gray-200">
              <label
                htmlFor="auth-code"
                className="text-[#12181c] dark:text-[#ecedee]"
              >
                {t("Base.write_code")}
              </label>
              <InputOtp name="auth-code" variant="bordered" length={4} />
            </div>
            <p className="text-center text-small">
              {t("Base.verification_code_sent_message")}{" "}
              <span className="text-primary hover:opacity-80 hover:underline cursor-pointer">
                {t("Base.resend_code").toLocaleLowerCase()}
              </span>
              .
            </p>
            <Spacer y={16} />
            <Button className="w-full" color="primary" type="submit">
              {t("Base.continue")}
            </Button>
          </Form>
          <p className="text-center text-small">
            <Link href="/login" size="sm">
              {t("Base.enter_existing_account")}
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps = getStaticPropsWithMessages;
