import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/modal";
import {
  Alert,
  Button,
  ButtonProps,
  ModalBodyProps,
  ModalContentProps,
  ModalFooterProps,
  ModalHeaderProps,
  ModalProps,
} from "@heroui/react";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from "react";

export const type = {
  info: "primary",
  success: "success",
  warning: "warning",
  error: "danger",
} as const;

export interface AlertAction {
  label: string;
  callback: (onClose: () => void) => void;
  buttonProps?: ButtonProps;
}

export interface Alert {
  open?: boolean;
  type?: "info" | "success" | "warning" | "error";
  title: string;
  message: string | string[];
  actions?: Record<string, AlertAction>;
  modalConfig?: {
    modalProps?: ModalProps;
    modalContentProps?: ModalContentProps;
    modalHeaderProps?: ModalHeaderProps;
    modalBodyProps?: ModalBodyProps;
    modalFooterProps?: ModalFooterProps;
  };
  onClose?: () => void;
}

interface AlertContextProps {
  addAlert: (id: string, alert: Alert) => void;
  removeAlert: (id: string) => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const useAlert = (): AlertContextProps => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within a AlertProvider");
  }
  return context;
};

export const AlertProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [alertList, setAlertList] = useState<Record<string, Alert>>({});

  const addAlert = useCallback(
    (id: string, alert: Alert) => {
      if (alertList[id]) {
        alertList[id] = alert;
        setAlertList(alertList);
        return;
      }
      setAlertList((prev) => ({ ...prev, [id]: alert }));
    },
    [alertList]
  );

  const removeAlert = useCallback((id: string) => {
    setAlertList((prev) => {
      const newList = { ...prev };
      newList[id]?.onClose?.();
      newList[id].open = false;
      return newList;
    });

    setTimeout(() => {
      setAlertList((prev) => {
        const newList = { ...prev };
        delete newList[id];
        return newList;
      });
    }, 500);
  }, []);

  return (
    <AlertContext.Provider value={{ addAlert, removeAlert }}>
      {Object.values(alertList).length > 0 &&
        Object.entries(alertList).map(([id, alert]) => (
          <Modal
            placement="center"
            {...alert.modalConfig?.modalProps}
            key={id}
            size="sm"
            isOpen={alert.open ?? true}
            onClose={() => {
              removeAlert(id);
            }}
          >
            <ModalContent {...alert.modalConfig?.modalContentProps}>
              {(onClose) => (
                <>
                  <ModalHeader {...alert.modalConfig?.modalHeaderProps}>
                    {alert.title}
                  </ModalHeader>
                  <ModalBody
                    className="gap-2"
                    {...alert.modalConfig?.modalBodyProps}
                  >
                    {alert.type && (
                      <div className="flex justify-center w-full">
                        <Alert
                          className="bg-transparent p-0 -translate-y-2"
                          classNames={{
                            base: "flex justify-center",
                            alertIcon: "size-[56px]",
                            iconWrapper: "size-16",
                            mainWrapper: "hidden",
                          }}
                          title={alert.title}
                          description={
                            Array.isArray(alert.message)
                              ? alert.message[0]
                              : alert.message
                          }
                          color={type[alert.type]}
                        />
                      </div>
                    )}
                    {Array.isArray(alert.message) ? (
                      alert.message.map((msg, index) => (
                        <p className="text-small text-center" key={index}>
                          {msg}
                        </p>
                      ))
                    ) : (
                      <p className="text-small text-center">{alert.message}</p>
                    )}
                  </ModalBody>
                  <ModalFooter {...alert.modalConfig?.modalFooterProps}>
                    {alert.actions &&
                      Object.entries(alert.actions).map(([key, action]) => (
                        <Button
                          key={key}
                          className="flex-1"
                          onPress={() => action.callback(onClose)}
                          {...action.buttonProps}
                        >
                          {action.label}
                        </Button>
                      ))}
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        ))}
      {children}
    </AlertContext.Provider>
  );
};
