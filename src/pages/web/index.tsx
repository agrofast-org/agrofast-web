import Layout from "@/components/layout";
import { getStaticPropsWithMessages } from "@/lib/get-static-props";
import { useTranslations } from "next-intl";
import Head from "next/head";
import { useUser } from "@/contexts/auth-provider";
import Button from "@/components/button";
import ProfileTypeForm from "@/forms/profile-type-form";
import RequestForm from "@/forms/request-form";
import ConditionalModal from "@/components/conditional-modal";
import Link from "next/link";
import React from "react";
import { Spinner } from "@heroui/react";

export default function Index() {
  const pt = useTranslations("Pages.Index");
  const { user, machinery, carriers, transportLoaded } = useUser();

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
        {!transportLoaded && (
          <section className="flex flex-col justify-center items-center gap-6 mx-auto p-4 max-w-[912px] text-center container">
            <Spinner label="Carregando seu perfil..." />
          </section>
        )}
        {user?.profile_type === "requester" && (
          <React.Fragment key="requester">
            {machinery ? (
              <RequestForm key="requestForm" />
            ) : (
              <section
                key="requestNoMachinery"
                className="flex flex-col justify-center items-center gap-6 mx-auto p-4 max-w-[912px] text-center container"
              >
                <h1 className="font-bold text-2xl">Nada para transportar</h1>
                <p className="text-neutral-600 dark:text-neutral-300 text-lg">
                  Você ainda não possui nenhum maquinário cadastrado. Para
                  solicitar o transporte de um maquinário, você precisa
                  cadastrar um primeiro.
                </p>
                <Button color="primary" as={Link} href="/machinery/new">
                  Cadastrar Maquinário
                </Button>
              </section>
            )}
          </React.Fragment>
        )}
        {user?.profile_type === "transporter" && (
          <React.Fragment key="transporter">
            {carriers ? (
              <section
                key="transporterHasCarriers"
                className="flex flex-col justify-center items-center gap-6 mx-auto p-4 max-w-[912px] text-center container"
              >
                <h1 className="font-bold text-2xl">
                  Bem-vindo, Transportador!
                </h1>
                <p className="text-neutral-600 dark:text-neutral-300 text-lg">
                  Comece aceitando novas solicitações de transporte disponíveis.
                </p>
                <Button color="primary">Ver Chamados Disponíveis</Button>
              </section>
            ) : (
              <section
                key="transporterNoCarriers"
                className="flex flex-col justify-center items-center gap-6 mx-auto p-4 max-w-[912px] text-center container"
              >
                <h1 className="font-bold text-2xl">Sem veículos cadastrados</h1>
                <p className="text-neutral-600 dark:text-neutral-300 text-lg">
                  Você ainda não possui nenhum veículo cadastrado. Para buscar
                  serviços disponíveis, você precisa cadastrar um primeiro.
                </p>
                <Button color="primary" as={Link} href="/carrier/new">
                  Cadastrar Veículo
                </Button>
              </section>
            )}
          </React.Fragment>
        )}
      </Layout>
    </>
  );
}

export const getStaticProps = getStaticPropsWithMessages;
