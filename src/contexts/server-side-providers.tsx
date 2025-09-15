export interface ServerSideProvidersProps {
  children: React.ReactNode;
}

export const ServerSideProviders: React.FC<ServerSideProvidersProps> = ({
  children,
}) => {
  return <>{children}</>;
};
