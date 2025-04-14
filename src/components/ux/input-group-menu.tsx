import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import Icon from "../icon";
import { MoreVerticalBulkRounded } from "@hugeicons-pro/core-bulk-rounded";
import { PencilEdit01DuotoneRounded } from "@hugeicons-pro/core-duotone-rounded";
import { Delete02TwotoneRounded } from "@hugeicons-pro/core-twotone-rounded";
import { ItemIndex, useGroup } from "../input/group/input-group";
import IconOption from "../ui/icon-option";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface InputGroupMenuProps {
  index: ItemIndex;
}

const InputGroupMenu: React.FC<InputGroupMenuProps> = ({ index }) => {
  const t = useTranslations();

  const [isOpen, setIsOpen] = useState(false);

  const group = useGroup();
  if (!group) {
    throw new Error(
      "InputGroupMenu must be used within a InputGroup component"
    );
  }

  return (
    <Popover
      placement="bottom-end"
      className="translate-x-1"
      radius="sm"
      offset={8}
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <PopoverTrigger>
        <Button
          className="top-[2px] right-[2px] absolute opacity-0 group-focus:opacity-100 group-hover:opacity-100 duration-75"
          type="button"
          size="sm"
          variant="flat"
          isIconOnly
        >
          <Icon icon={MoreVerticalBulkRounded}></Icon>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-1 w-28">
        <IconOption
          onClick={() => {
            setIsOpen(false);
            group.editItem(index);
          }}
          icon={PencilEdit01DuotoneRounded}
        >
          {t("UI.buttons.edit")}
        </IconOption>
        <IconOption
          onClick={() => {
            group.removeItem(index);
          }}
          icon={Delete02TwotoneRounded}
          confirmAction
          confirmActionInfo={{
            actionConfirmTitle: t("UI.input_group.delete.title"),
            actionConfirmText: t("UI.input_group.delete.description"),
            actionConfirmButtonColor: "danger",
          }}
        >
          {t("UI.buttons.delete")}
        </IconOption>
      </PopoverContent>
    </Popover>
  );
};

export default InputGroupMenu;
