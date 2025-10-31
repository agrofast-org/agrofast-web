import { Chip } from "@heroui/react";

interface RequestStateChipProps {
  rate?: number;
}

export const RateRender: React.FC<RequestStateChipProps> = ({ rate }) => {
  return <Chip size="sm">{rate ? `${rate} estrelas` : "Sem avaliação"}</Chip>;
};
