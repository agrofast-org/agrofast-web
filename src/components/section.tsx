import { cn } from "@heroui/react";

export interface SectionProps {
  children?: React.ReactNode;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ children, className }) => {
  return (
    <section
      className={cn(
        "flex flex-col justify-center items-center gap-4 max-w-[1034px]",
        className
      )}
    >
      {children}
    </section>
  );
};
