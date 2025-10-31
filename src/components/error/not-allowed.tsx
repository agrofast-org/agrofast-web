import TerraMov from "../ui/agrofast";
import Link from "@/components/link";

export const NotAllowed: React.FC = () => {
  return (
    <div className="top-1/4 absolute inset-0 flex flex-1 justify-center md:items-center pt-8 md:pt-0 h-96">
      <div className="flex flex-col gap-4 px-8 py-6 w-full max-w-md min-h-max">
        <div className="flex flex-col items-center">
          <TerraMov.Logo className="w-72 h-min" />
          <p className="py-2 font-semibold text-gray-700 dark:text-gray-200 text-2xl text-center">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <Link href="/web">Retornar para a página inicial</Link>
        </div>
      </div>
    </div>
  );
};
