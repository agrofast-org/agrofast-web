import { Request } from "@/types/transport";
import { Chip, ChipProps } from "@heroui/react";
import { useTranslations } from "next-intl";

interface RequestStateChipProps extends ChipProps {
  state: Request["state"];
}

export const RequestStateChip: React.FC<RequestStateChipProps> = ({
  state,
  ...props
}) => {
  const st = useTranslations("UI.state");

  const getColor = () => {
    switch (state) {
      case "pending":
        return "bg-yellow-500 text-white";
      case "waiting_for_offer":
        return "bg-indigo-500 text-white";
      case "payment_pending":
        return "bg-orange-500 text-white";
      case "approved":
        return "bg-green-500 text-white";
      case "rejected":
        return "bg-red-500 text-white";
      case "in_progress":
        return "bg-blue-500 text-white";
      case "canceled":
        return "bg-gray-500 text-white";
      case "completed":
        return "bg-purple-500 text-white";
      default:
        return "bg-gray-300 text-gray-800";
    }
  };

  return (
    <Chip className={getColor()} size="sm" {...props}>
      {st(state)}
    </Chip>
  );
};
