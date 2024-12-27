import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

interface ToasterProviderProps {
  children: React.ReactNode;
}

const ToasterProvider: React.FC<ToasterProviderProps> = ({ children }) => {
  useEffect(() => {
    toast.success('Hello, world!');
  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        // gutter={8}
        containerStyle={{ zIndex: 100 }}
        toastOptions={{
          duration: 5000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
      {children}
    </>
  );
};

export default ToasterProvider;
