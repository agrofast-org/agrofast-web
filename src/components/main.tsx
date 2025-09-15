import { cn } from "@heroui/react";

export interface MainProps {
  children?: React.ReactNode;
  className?: string;
}

export const Main: React.FC<MainProps> = ({ children, className }) => {
  return (
    <main
      className={cn("flex-grow space-y-4 mx-auto px-6 py-4 max-w-7xl container", className)}
    >
      {children}
    </main>
  );
};
