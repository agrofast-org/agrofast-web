import {
  Avatar,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
} from "@heroui/react";
import { useAuth } from "@/contexts/auth-provider";

interface UserOptionsMenuProps {
  children?: React.ReactNode;
}

const UserOptionsMenu: React.FC<UserOptionsMenuProps> = ({
  children,
}: UserOptionsMenuProps) => {
  const { user } = useAuth();

  if (!user) {
    return <LazyUserOptionsMenu />;
  }

  return (
    <Popover radius="sm" placement="bottom-end">
      <PopoverTrigger>
        <Avatar
          as={Button}
          radius="md"
          className="data-[aria-expanded=true]:blur-md"
          src={user?.profile_picture}
          isIconOnly
        />
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-0 p-1 w-full min-w-44 h-min text-gray-700 dark:text-gray-200">
        {children}
      </PopoverContent>
    </Popover>
  );
};

export const LazyUserOptionsMenu: React.FC = () => {
  return (
    <Button isIconOnly>
      <Spinner size="sm" color="default" />
    </Button>
  );
};

export default UserOptionsMenu;
