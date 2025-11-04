import { Bell, Notes } from "@solar-icons/react";
import { useAuth } from "@/contexts/auth-provider";
import { Badge, Button, cn, Spinner, useDisclosure } from "@heroui/react";
import ConditionalModal from "../conditional-modal";
import { ModalBody, ModalFooter, ModalHeader } from "../modal";
import Link from "../link";

export const UserNotificationButton: React.FC = () => {
  const disclosure = useDisclosure();
  const { user } = useAuth();

  if (!user) {
    return <LazyUserNotificationMenu />;
  }

  const notifications = [
    ...(!user?.documents?.length
      ? [
          <>
            Por favor, cadastre pelo menos um{" "}
            <Link href="/web/document">documento</Link> para continuar
            utilizando o sistema.
          </>,
        ]
      : []),
    // ...(!user?.user_mercado_pago && user.profile_type === "transporter"
    //   ? [
    //       <>Faça a autenticação da sua <Link href="/web/auth/mercado-pago">conta Mercado Pago</Link> para que possamos realizar o pagamento pelos seus serviços.</>,
    //     ]
    //   : []),
    ...(!user?.user_mercado_pago && user.profile_type === "transporter"
      ? [
          <>
            Por favor, cadastre pelo menos uma{" "}
            <Link href="/web/profile">forma de recebimento</Link> para que possamos
            realizar o pagamento pelos seus serviços.
          </>,
        ]
      : []),
  ];

  return (
    <>
      <Badge
        color="default"
        content={notifications.length}
        isInvisible={notifications.length === 0}
      >
        <Button
          radius="md"
          className="bg-default-100 hover:bg-default-200 shadow-sm text-default-700 duration-100"
          onPress={disclosure.onOpen}
          isIconOnly
        >
          <Bell weight="LineDuotone" />
        </Button>
      </Badge>
      <ConditionalModal
        size="lg"
        isOpen={disclosure.isOpen}
        onClose={disclosure.onClose}
      >
        <ModalHeader>Notificações</ModalHeader>
        <ModalBody className="pr-2 min-h-24">
          {notifications.length !== 0 ? (
            <div className="pr-2 max-h-52 overflow-y-auto">
              <NotificationsRenderer messages={notifications} />
            </div>
          ) : (
            <p className="mt-8 size-full text-center">
              Você não tem nenhuma notificação.
            </p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={disclosure.onClose}>
            Fechar
          </Button>
        </ModalFooter>
      </ConditionalModal>
    </>
  );
};

export interface NotificationProps {
  className?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Notification: React.FC<NotificationProps> = ({
  className,
  icon,
  children,
}) => {
  return (
    <div className="flex flex-row items-start gap-2">
      <div className="flex items-center w-6 h-6 align-middle">
        {icon || <Notes weight="LineDuotone" />}
      </div>
      <p className={cn("text-sm", className)}>{children}</p>
    </div>
  );
};

export interface NotificationsRendererProps {
  messages?: React.ReactNode[];
  children?: React.ReactNode;
}

export const NotificationsRenderer: React.FC<NotificationsRendererProps> = ({
  messages,
  children,
}) => {
  if (!messages && !children) {
    return (
      <div className="flex flex-1 justify-center items-center">
        <Notification className="text-default-500">
          Você não tem nenhuma mensagem!
        </Notification>
      </div>
    );
  }
  return (
    <>
      {children}
      {messages?.map((msg, idx) => (
        <Notification key={idx}>{msg}</Notification>
      ))}
    </>
  );
};

export const LazyUserNotificationMenu: React.FC = () => {
  return (
    <Button isIconOnly>
      <Spinner color="current" className="text-default-500 scale-80" />
    </Button>
  );
};
