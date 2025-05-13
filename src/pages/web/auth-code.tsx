import Body from "@/components/body";
import TerraMov from "@/components/ui/agrofast";
import { useTranslations } from "next-intl";
import { getStaticPropsWithMessages } from "@/lib/get-static-props";
import Head from "next/head";
import AuthCodeForm from "@/forms/auth-code-form";
import FormWrapper from "@/components/form/form-wrapper";

export default function AuthCode() {
  const pt = useTranslations("Pages.AuthCode");

  return (
    <>
      <Head>
        <title>{pt("meta.title")}</title>
        <meta name="description" content={pt("meta.description")} />
      </Head>
      <Body className="flex flex-row" hideHeader hideFooter>
        <FormWrapper>
          <div className="flex flex-col items-center gap-2">
            <TerraMov.Logo className="w-40 h-10" />
          </div>
          <AuthCodeForm />
        </FormWrapper>
      </Body>
    </>
  );
}

export const getStaticProps = getStaticPropsWithMessages;
