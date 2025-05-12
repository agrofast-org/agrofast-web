import { cn } from "@/lib/utils";

export interface FormHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const FormHeader: React.FC<FormHeaderProps> = ({ children, className }) => {
  return <div className={cn("flex flex-row justify-center col-span-full min-h-10", className)}>{children}</div>;
};

export default FormHeader;
