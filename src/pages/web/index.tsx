import Layout from "@/components/layout";
import { getStaticPropsWithMessages } from "@/lib/get-static-props";
import { useTranslations } from "next-intl";
import Head from "next/head";
import { useAuth } from "@/contexts/auth-provider";
import Button from "@/components/button";
import ProfileTypeForm from "@/forms/profile-type-form";
import RequestForm from "@/forms/request-form";
import ConditionalModal from "@/components/conditional-modal";

export default function Index() {
  const pt = useTranslations("Pages.Index");
  const { user } = useAuth();

  return (
    <>
      <Head>
        <title>{pt("meta.title")}</title>
        <meta name="description" content={pt("meta.description")} />
      </Head>
      <Layout className="flex flex-col gap-10 pt-20 w-full">
        <ConditionalModal
          isOpen={!!user && !user?.profile_type}
          canClose={false}
        >
          <ProfileTypeForm />
        </ConditionalModal>
        {user?.profile_type === "requester" && (
          <>
            <RequestForm />
          </>
        )}
        {user?.profile_type === "transporter" && (
          <section className="flex flex-col justify-center items-center gap-6 mx-auto p-4 max-w-[912px] text-center container">
            <h1 className="font-bold text-2xl">Bem-vindo, Transportador!</h1>
            <p className="text-neutral-600 dark:text-neutral-300 text-lg">
              Comece aceitando novas solicitações de transporte disponíveis.
            </p>
            <Button color="primary">Ver Chamados Disponíveis</Button>
          </section>
        )}
      </Layout>
    </>
  );
}

export const getStaticProps = getStaticPropsWithMessages;
