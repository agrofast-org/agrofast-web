import Body from "@/components/body";
import { useTranslations } from "next-intl";
import { getStaticPropsWithMessages } from "@/lib/get-static-props";
import Head from "next/head";
import List, {
  IdentifierColumn,
  ListAction,
  ListColumn,
  ListOperations,
} from "@/components/list";
import { TrashBinTrash } from "@solar-icons/react";
import RequestStateChip from "@/components/ux/request-state-chip";
import { formatCurrency } from "@/lib/utils";
import { Offer, Request } from "@/types/transport";
import { useAlert } from "@/contexts/alert-provider";
import { Carrier } from "@/types/user";
import { api } from "@/service/api";

export default function OfferList() {
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
          <List getUrl="/offer">
            <IdentifierColumn label="Id" name="uuid" />
            <ListColumn name="request" formatter={(request: Request) => `${request.origin_place_name} -> ${request.destination_place_name}`} label="Origem -> Destino" />
            <ListColumn name="carrier" formatter={(carrier: Carrier) => carrier.name} label="Transportador" />
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
                name="delete-offer"
                label="Excluir Oferta"
                icon={<TrashBinTrash size={22} className="text-danger" />}
                tooltipProps={{ color: "danger" }}
                onAction={(id, offer: Offer) => {
                  addAlert("delete-offer", {
                    type: "warning",
                    title: "Excluir Oferta",
                    message: [
                      "Voce tem certeza que deseja excluir esta oferta?",
                      ...(offer && offer.state === "approved"
                        ? [
                            "Esta oferta foi aprovada e excluir pode impactar o andamento do chamado.",
                            "Avisamos que uma punição pode ser aplicada ao transportador responsável por esta oferta.",
                          ]
                        : []),
                    ],
                    actions: {
                      confirm: {
                        label: "Excluir",
                        buttonProps: { color: "default" },
                        callback: (onClose) => {
                          api.delete(`/offer/${id}`).then(() => {
                            onClose();
                          })
                        }
                      }
                    }
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

export const getStaticProps = getStaticPropsWithMessages;
