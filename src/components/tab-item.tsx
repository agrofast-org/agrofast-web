import { cn } from "@/lib/utils";
import { useRouter } from "next/router";

interface TabItemChildrenProps {
  active?: boolean;
  className?: string;
}

interface TabItemProps {
  label: string;
  href?: string;
  className?: string;
  children?:
    | React.ReactNode
    | ((params: TabItemChildrenProps) => React.ReactNode);
}

const TabItem: React.FC<TabItemProps> = ({
  label,
  href,
  className,
  children,
}) => {
  const router = useRouter();

  const isActive = href ? router.asPath == href : false;

  return (
    <div
      onClick={() => {
        if (href) {
          router.push(href);
        }
      }}
      className={cn(
        className,
        "flex flex-col items-center text-sm aspect-square max-w-[46px] w-[46px] gap-0.5"
      )}
    >
      {typeof children === "function"
        ? children({ active: isActive, className: className || "" })
        : children}
      {label}
    </div>
  );
};

export default TabItem;
