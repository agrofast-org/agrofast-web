import { useEffect } from "react";
import Body from "@/components/body";
import Head from "next/head";
import { useRouter } from "next/router";
import { getStaticPropsWithMessages } from "@/lib/get-static-props";
import { api } from "@/service/api";
import TerraMov from "@/components/ui/agrofast";

export default function AuthMercadoPago() {
  const router = useRouter();

  useEffect(() => {
    api.get("/integrations/mercado-pago/connect").then(({ data }) => {
      router.push(data.authorization_url);
    });
  }, [router]);

  return (
    <>
      <Head>
        <title>Autenticação - Mercado Pago</title>
        <meta
          name="description"
          content="Autentique-se para continuar com o pagamento via Mercado Pago."
        />
      </Head>
      <Body hideHeader hideFooter>
        <div className="top-1/4 absolute inset-0 flex flex-1 justify-center md:items-center pt-8 md:pt-0 h-96">
          <div className="flex flex-col items-center gap-4 px-8 py-6 w-full max-w-md min-h-max">
            <TerraMov.Logo className="w-72 h-min" />
            <h2 className="py-2 font-semibold text-default-700 text-2xl text-center">
              Autenticação - Mercado Pago
            </h2>
          </div>
        </div>
      </Body>
    </>
  );
}

export const getStaticProps = getStaticPropsWithMessages;
