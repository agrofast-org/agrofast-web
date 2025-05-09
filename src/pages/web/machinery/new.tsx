import Body from "@/components/body";
import { useTranslations } from "next-intl";
import { getStaticPropsWithMessages } from "@/lib/get-static-props";
import Head from "next/head";
import FormBody from "@/components/form/form-body";
import MachineryForm from "@/forms/transport/machinery-form";

export default function New() {
  // const t = useTranslations();
  const pt = useTranslations("Pages.SignUp");

  return (
    <>
      <Head>
        <title>{pt("meta.title")}</title>
        <meta name="description" content={pt("meta.description")} />
      </Head>
      <Body className="flex flex-row justify-center">
        <section className="flex flex-row items-start gap-4 mx-auto p-4 container">
          <FormBody>
            <MachineryForm />
          </FormBody>
        </section>
      </Body>
    </>
  );
}

export const getStaticProps = getStaticPropsWithMessages;
