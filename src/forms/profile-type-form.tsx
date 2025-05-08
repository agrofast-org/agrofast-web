import Button from "@/components/button";
import { cn } from "@/lib/utils";
import { ProfileType } from "@/types/user";
import { Spinner } from "@heroui/react";
import { useState } from "react";
import { Calendar, Routing2 } from "@solar-icons/react";
import { profileType } from "@/http/user/profile-type";
import { useUser } from "@/contexts/auth-provider";
import { useToast } from "@/service/toast";

const ProfileTypeForm: React.FC = () => {
  const { setUser } = useUser();
  const { error } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSelectProfile = (type: ProfileType) => {
    setLoading(true);
    profileType(type)
      .then(({ data }) => {
        setUser(data.user);
      })
      .catch(() => {
        error({
          description: "Erro ao selecionar o tipo de perfil. Tente novamente mais tarde.",
        });
      });
  };

  return (
    <section className="relative">
      <div
        className={cn(
          "flex flex-col justify-center items-center gap-6 mx-auto p-4 max-w-[912px] text-center duration-100 container",
          loading ? "opacity-25 pointer-events-none" : "opacity-100"
        )}
      >
        <h1 className="font-bold text-2xl">Antes de começar...</h1>
        <p className="text-neutral-600 dark:text-neutral-300 text-lg">
          Selecione como deseja utilizar o Agrofast.
        </p>
        <div className="flex flex-row justify-center gap-4 mt-2 w-full">
          <Button
            color="primary"
            confirmAction
            onPress={() => handleSelectProfile("requester")}
            className="flex-1 gap-3 px-4"
            disabled={loading}
          >
            <Calendar weight="BoldDuotone" className="size-6" />
            Sou Solicitante
          </Button>
          <Button
            color="secondary"
            confirmAction
            onPress={() => handleSelectProfile("transporter")}
            className="flex-1 gap-3 px-4"
            disabled={loading}
          >
            <Routing2 weight="BoldDuotone" className="size-6" width={24} />
            Sou Transportador
          </Button>
        </div>
      </div>
      <Spinner
        className={cn(
          "top-1/2 left-1/2 absolute -translate-x-1/2 -translate-y-1/2 duration-100",
          loading ? "opacity-100 pointer-events-none" : "hidden opacity-0"
        )}
      />
    </section>
  );
};

export default ProfileTypeForm;
