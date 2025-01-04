import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Toaster } from "sonner";

interface ToasterProviderProps {
  children: React.ReactNode;
}

const ToasterProvider: React.FC<ToasterProviderProps> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <>
      <Toaster
        cn={cn}
        position="top-right"
        theme={theme === "dark" ? "dark" : "light"}
        toastOptions={{
          duration: 7500,
          classNames: {
            closeButton: "!top-3 !right-3 rounded-lg"
          }
        }}
        closeButton
        richColors
      />
      {children}
    </>
  );
};

export default ToasterProvider;
