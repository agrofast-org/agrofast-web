import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { LazyThemeSwitcher } from "../ui/theme-switcher";
import dynamic from "next/dynamic";
import { Bug01Icon } from "@hugeicons/react";
import { LazyLanguageSelector } from "@/components/ui/language-selector";

const ThemeSwitcher = dynamic(() => import("@/components/ui/theme-switcher"), {
  ssr: false,
  loading: () => <LazyThemeSwitcher />,
});

const LanguageSelector = dynamic(
  () => import("@/components/ui/language-selector"),
  {
    ssr: false,
    loading: () => <LazyLanguageSelector size="sm" />,
  }
);

const RouteSelector = () => {
  const routes = [
    "/",
    "/login",
    "/sign-up",
    "/auth-code",
    "/forgot-pass",
    "/recover-token",
  ];
  const router = useRouter();

  const handleRouteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(event.target.value);
  };

  return (
    <Select
      onChange={handleRouteChange}
      className="text-medium max-w-[65%]"
      classNames={{
        popoverContent: "rounded-md",
      }}
      size="sm"
      radius="sm"
      aria-label="Route"
      placeholder="Select route"
    >
      {routes.map((route) => (
        <SelectItem key={route} value={route}>
          {route}
        </SelectItem>
      ))}
    </Select>
  );
};

const DebugOptions = () => {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed z-50 right-4 bottom-4">
      <Popover radius="sm" placement="top-end" offset={8}>
        <PopoverTrigger>
          <Button size="md" color="success" isIconOnly>
            <Bug01Icon
              type="rounded"
              variant="twotone"
              className="pointer-events-none p-0.5 text-white"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col gap-2 min-w-80 px-1 py-2 text-gray-700 dark:text-gray-200">
            <div className="text-small font-bold">Development debug panel</div>
            <div className="flex flex-row items-center justify-between text-tiny">
              <ThemeSwitcher size="sm" className="text-medium" />
              <hr className="flex-1 mx-2 border-dashed" />
              <p>Change theme</p>
            </div>
            <div className="flex flex-row items-center justify-between text-tiny">
              <LanguageSelector size="sm" />
              <hr className="flex-1 mx-2 border-dashed" />
              <p>Change language</p>
            </div>
            <div className="flex flex-row items-center justify-between text-tiny">
              <RouteSelector />
              <hr className="flex-1 mx-2 border-dashed" />
              <p>Change route</p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DebugOptions;
