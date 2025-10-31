import Body from "@/components/body";
import { NotAllowed } from "@/components/error/not-allowed";
import { getStaticPropsWithMessages } from "@/lib/get-static-props";
import Head from "next/head";

export default function Page401() {
  return (
    <>
      <Head>
        <title>Terramov - Não Autorizado</title>
        <meta name="description" content="Você não tem permissão para acessar esta página." />
      </Head>
      <Body hideHeader>
        <div className="flex flex-1 justify-center md:items-center pt-8 md:pt-0 max-h-svh overflow-hidden overflow-y-auto">
          <NotAllowed />
        </div>
      </Body>
    </>
  );
}

export const getStaticProps = getStaticPropsWithMessages;
