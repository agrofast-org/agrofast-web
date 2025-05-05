import Body from "@/components/body";
import { useTranslations } from "next-intl";
import { getStaticPropsWithMessages } from "@/lib/get-static-props";
import Head from "next/head";
import { GetStaticPaths } from "next";
import { Params } from "next/dist/server/request/params";
import FormBody from "@/components/form/form-body";
import MachineryForm from "@/forms/transport/machinery-form";
import { useRouter } from "next/router";

export default function Find() {
  const { query } = useRouter();
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
            <MachineryForm uuid={Array.isArray(query.uuid) ? query.uuid[0] : query.uuid} />
          </FormBody>
        </section>
      </Body>
    </>
  );
}

export const getStaticPaths: GetStaticPaths<Params> = async () => ({
  paths: [
    // { params: { uuid: "123e4567-e89b-12d3-a456-426614174000" } }
  ],
  fallback: "blocking",
});

export const getStaticProps = getStaticPropsWithMessages;
