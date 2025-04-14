import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import Icon from "../icon";
import { MoreVerticalBulkRounded } from "@hugeicons-pro/core-bulk-rounded";
import LinkOption from "../ui/link-option";
import { PencilEdit01DuotoneRounded } from "@hugeicons-pro/core-duotone-rounded";
import { Delete02TwotoneRounded } from "@hugeicons-pro/core-twotone-rounded";
import { ItemIndex, useGroup } from "../input/group/input-group";

interface InputGroupMenuProps {
  index: ItemIndex;
}

const InputGroupMenu: React.FC<InputGroupMenuProps> = ({ index }) => {
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
    >
      <PopoverTrigger>
        <Button
          className="top-[2px] right-[2px] absolute opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 duration-75"
          type="button"
          size="sm"
          variant="flat"
          isIconOnly
        >
          <Icon icon={MoreVerticalBulkRounded}></Icon>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-1 w-28">
        <LinkOption
          href=""
          onClick={() => {
            group.editItem(index);
          }}
          icon={PencilEdit01DuotoneRounded}
          noRedirect
        >
          Editar
        </LinkOption>
        <LinkOption
          href=""
          onClick={() => {
            group.removeItem(index);
          }}
          icon={Delete02TwotoneRounded}
          noRedirect
        >
          Excluir
        </LinkOption>
      </PopoverContent>
    </Popover>
  );
};

export default InputGroupMenu;
