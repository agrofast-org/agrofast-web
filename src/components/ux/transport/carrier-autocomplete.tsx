import {
  Autocomplete,
  AutocompleteProps,
} from "@/components/input/autocomplete";
import { useUser } from "@/contexts/auth-provider";

export const CarrierAutocomplete: React.FC<AutocompleteProps> = ({
  ...props
}) => {
  const { carriers } = useUser();

  if (!carriers) {
    return null;
  }

  return (
    <Autocomplete
      {...props}
      name="carrier_uuid"
      label="Veiculo / Transportador"
      placeholder="Escolha o veículo ou transportador"
      options={carriers.map((carrier) => ({
        value: carrier.uuid,
        label: carrier.name,
      }))}
    ></Autocomplete>
  );
};
