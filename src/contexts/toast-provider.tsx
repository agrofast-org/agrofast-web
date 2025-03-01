import { ToastProvider } from "@heroui/react";

interface ToasterProviderProps {
  children: React.ReactNode;
}

const ToastCloseIcon = () => (
  <svg
    fill="none"
    height="32"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="32"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const ToasterProvider: React.FC<ToasterProviderProps> = ({ children }) => {
  return (
    <>
      <ToastProvider
        placement="bottom-right"
        toastProps={{
          variant: "flat",
          radius: "md",
          closeIcon: <ToastCloseIcon />,
        }}
      />
      {children}
    </>
  );
};

export default ToasterProvider;
