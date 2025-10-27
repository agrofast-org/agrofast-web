import Body from "@/components/body";
import { useTranslations } from "next-intl";
import { getStaticPropsWithMessages } from "@/lib/get-static-props";
import Head from "next/head";
import { GetStaticPaths } from "next";
import { Params } from "next/dist/server/request/params";
import { useRouter } from "next/router";
import List, {
  IdentifierColumn,
  ListAction,
  ListColumn,
  ListOperations,
} from "@/components/list";
import { CheckCircle } from "@solar-icons/react";
import RequestStateChip from "@/components/ux/request-state-chip";
import { formatCurrency } from "@/lib/utils";
import { Offer } from "@/types/transport";
import { useAlert } from "@/contexts/alert-provider";
import { acceptOffer } from "@/http/request/accept-offer";

export default function OfferList() {
  const router = useRouter();
  const pt = useTranslations("Pages.SignUp");
  const { addAlert } = useAlert();

  return (
    <>
      <Head>
        <title>{pt("meta.title")}</title>
        <meta name="description" content={pt("meta.description")} />
      </Head>
      <Body className="flex flex-row justify-center">
        <section className="flex flex-col items-start gap-4 mx-auto p-4 container">
          <div className="flex flex-row justify-between items-center w-full">
            <h1 className="font-semibold text-gray-700 dark:text-gray-200 text-2xl">
              Ofertas do Chamado
            </h1>
          </div>
          <List getUrl={`/request/${router.query.uuid}/offers`}>
            <IdentifierColumn label="Id" name="uuid" />
            <ListColumn name="user_name" label="Transportador" />
            <ListColumn
              label="Valor proposto"
              name="price"
              formatter={formatCurrency}
            />
            <ListColumn
              label="Status"
              name="state"
              formatter={(state) => <RequestStateChip state={state} />}
            />
            <ListColumn name="created_at" label="Feita em" date />
            <ListOperations label="Operações">
              <ListAction
                name="accept-offer"
                label="Aceitar Oferta"
                icon={<CheckCircle size={22} />}
                onAction={(id, offer: Offer) => {
                  if (offer && offer.state !== "approved") {
                    acceptOffer(id).then(() => {
                      addAlert("accept-offer", {
                        type: "success",
                        title: "Oferta aceita",
                        message: "A oferta foi aceita com sucesso.",
                      });
                      router.reload();
                    });
                    addAlert("accept-offer", {
                      type: "info",
                      title: "Aceitar Oferta",
                      message:
                        "Funcionalidade de aceitar oferta ainda não implementada.",
                    });
                    return;
                  }
                  addAlert("accept-offer", {
                    type: "info",
                    title: "Erro ao aceitar oferta",
                    message:
                      "Não é possível aceitar uma oferta que já foi aprovada.",
                  });
                }}
              />
            </ListOperations>
          </List>
        </section>
      </Body>
    </>
  );
}

export const getStaticPaths: GetStaticPaths<Params> = async () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps = getStaticPropsWithMessages;
