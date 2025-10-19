import React, { useState } from "react";
import CrudForm from "@/components/form/crud-form";
import FormHeader from "@/components/form/form-header";
import RequestStateChip from "@/components/ux/request-state-chip";
import Image from "next/image";
import { formatCurrency, formatDistance, formatDuration } from "@/lib/utils";
import { Button, Tooltip } from "@heroui/react";
import { useRouter } from "next/router";
import { updateRequest } from "@/http/request/update-request";
import { ArrowRight } from "@solar-icons/react";

const RequestUpdateForm: React.FC<{ uuid?: string }> = ({ uuid }) => {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(undefined);
  const [paymentUpdating, setPaymentUpdating] = useState(false);

  const handlePaymentUpdate = () => {
    if (paymentUpdating || !uuid) return;
    setPaymentUpdating(true);
    updateRequest(uuid)
      .then(() => router.reload())
      .finally(() => setPaymentUpdating(false));
  };

  return (
    <CrudForm
      id="request-update-form"
      uuid={uuid}
      update={!!uuid}
      getUrl={(id) => `/request/${id}`}
      postUrl="/request"
      putUrl={(id) => `/request/${id}`}
      setFetchedData={(d) => setData(d)}
      listUrl="/web/carrier"
    >
      <div className="space-y-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <FormHeader>
          <div className="flex md:flex-row flex-col justify-between items-start md:items-center gap-4">
            <div className="flex font-medium text-gray-800 text-large">
              <Tooltip showArrow content={data?.origin_place_name || "--"}>
                <div className="truncate max-w-52">
                  {`${data?.origin_place_name}` || "--"}
                </div>
              </Tooltip>
              <ArrowRight className="mx-2" />
              <Tooltip showArrow content={data?.destination_place_name || "--"}>
                <div className="truncate max-w-52">
                  {`${data?.destination_place_name}` || "--"}
                </div>
              </Tooltip>
            </div>
            {data && <RequestStateChip state={data.state} size="md" />}
          </div>
        </FormHeader>
        <div className="space-y-8">
          <div className="gap-8 grid grid-cols-1 md:grid-cols-2">
            <div className="bg-white shadow p-6 rounded-lg w-full">
              <h2 className="mb-4 font-medium text-xl">🗺️ Origem</h2>
              <p className="text-base truncate">
                <strong>Local:</strong> {data?.origin_place_name || "--"}
              </p>
              <p className="text-base">
                <strong>Latitude:</strong> {data?.origin_latitude ?? "--"}
              </p>
              <p className="text-base">
                <strong>Longitude:</strong> {data?.origin_longitude ?? "--"}
              </p>
            </div>
            <div className="bg-white shadow p-6 rounded-lg w-full">
              <h2 className="mb-4 font-medium text-xl">🎯 Destino</h2>
              <p className="text-base truncate">
                <strong>Local:</strong> {data?.destination_place_name || "--"}
              </p>
              <p className="text-base">
                <strong>Latitude:</strong> {data?.destination_latitude ?? "--"}
              </p>
              <p className="text-base">
                <strong>Longitude:</strong>{" "}
                {data?.destination_longitude ?? "--"}
              </p>
            </div>
          </div>
          <div className="flex sm:flex-row flex-col gap-8">
            <div className="flex-1 bg-white shadow p-6 rounded-lg">
              <h3 className="mb-2 font-medium text-lg">🚗 Distância</h3>
              <p className="text-xl">
                {data?.distance != null ? formatDistance(data.distance) : "--"}
              </p>
            </div>
            <div className="flex-1 bg-white shadow p-6 rounded-lg">
              <h3 className="mb-2 font-medium text-lg">⏱️ Tempo Estimado</h3>
              <p className="text-xl">
                {data?.estimated_time
                  ? formatDuration(data?.estimated_time)
                  : "--"}
              </p>
            </div>
          </div>
          {data?.payment && data.state === "payment_pending" && (
            <div className="space-y-6 bg-white shadow p-6 rounded-lg">
              <h2 className="font-medium text-xl">💵 Pagamento</h2>
              <p className="text-base">
                <strong>Valor do serviço:</strong>{" "}
                {formatCurrency(data.payment.transaction_amount)}
              </p>
              <div className="flex flex-wrap gap-4">
                {data.payment.qr_code && (
                  <Button
                    className="bg-default-100 px-5 py-2 text-default-700 text-base"
                    onPress={() =>
                      navigator.clipboard.writeText(data.payment.qr_code)
                    }
                  >
                    Copiar Pix
                  </Button>
                )}
                {data.payment.ticket_url && (
                  <Button
                    className="bg-default-100 px-5 py-2 text-default-700 text-base"
                    as="a"
                    href={data.payment.ticket_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver Boleto
                  </Button>
                )}
                <Button
                  className="bg-default-100 px-5 py-2 text-default-700 text-base"
                  onPress={handlePaymentUpdate}
                  isDisabled={paymentUpdating}
                >
                  {paymentUpdating ? "Atualizando..." : "Atualizar Status"}
                </Button>
              </div>
              <div className="flex justify-center mt-4">
                <Image
                  src={`data:image/png;base64,${data.payment.qr_code_base64}`}
                  alt="QR Code"
                  width={192}
                  height={192}
                  className="shadow rounded w-48 h-48"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </CrudForm>
  );
};

export default RequestUpdateForm;
