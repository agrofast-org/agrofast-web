import Layout from "@/components/layout";
import { Button, Form, Spacer } from "@nextui-org/react";
import Agrofast from "@/components/ui/agrofast";
import Input from "@/components/input";
import { useTranslations } from "next-intl";
import { getStaticPropsWithMessages } from "@/lib/getStaticProps";
import Head from "next/head";

export default function RecoverToken() {
  const t = useTranslations();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("handleSubmit");
  };

  return (
    <>
      <Head>
        <title>{t("RecoverToken.meta_title")}</title>
        <meta name="description" content={t("RecoverToken.meta_description_1")} />
      </Head>
      <Layout className="flex flex-row" hideHeader>
        <div className="flex flex-[5] md:items-center justify-center max-h-svh overflow-hidden overflow-y-auto">
          <div className="flex w-full max-w-md min-h-max flex-col gap-4 px-8 py-6">
            <div className="flex flex-col items-center gap-2">
              <Agrofast.Logo className="w-40 h-10" />
            </div>
            <p className="pb-2 text-left text-2xl text-gray-700 dark:text-gray-200 font-semibold">
              {t("Base.create_new_password")}
            </p>
            <Form
              className="flex flex-col gap-4"
              validationBehavior="native"
              onSubmit={handleSubmit}
            >
              <Input
                isRequired
                taggableVisibility
                className="text-gray-700 dark:text-gray-200"
                label={t("Base.new_password")}
                labelPlacement="outside"
                name="password"
                placeholder={t("Base.write_new_password")}
                type="password"
                variant="bordered"
              />
              <Input
                isRequired
                taggableVisibility
                className="text-gray-700 dark:text-gray-200"
                label={t("Base.new_password_confirm")}
                labelPlacement="outside"
                name="password_confirm"
                placeholder={t("Base.write_new_password_confirm")}
                type="password"
                variant="bordered"
              />
              <Spacer y={8} />
              <Button className="w-full" color="primary" type="submit">
                {t("Base.continue")}
              </Button>
            </Form>
          </div>
        </div>
      </Layout>
    </>
  );
}

export const getStaticProps = getStaticPropsWithMessages;
