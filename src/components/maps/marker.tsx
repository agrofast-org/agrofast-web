import { cn } from "@/lib/utils";

const Marker: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({ className, children }) => {
  return (
    <div
      className={cn(
        "relative size-9 scale-110 hover:scale-150 transition-transform -translate-y-1 hover:-translate-y-[10px] duration-75 marker",
        className
      )}
    >
      <div className="top-0 left-0 absolute m-[27.5%] mt-[18.5%] !size-4 text-white">
        {children ?? <div className="bg-white m-px rounded-full size-3.5" />}
      </div>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-9 marker-icon"
      >
        <path
          d="M4 10.1433C4 5.64588 7.58172 2 12 2C16.4183 2 20 5.64588 20 10.1433C20 13.566 18 16 15.5 18C14.7414 18.5225 14.391 19.0662 13.4629 19.5C12.5343 19.9341 11.4657 19.9341 10.5371 19.5C9.60902 19.0662 9.2586 18.5225 8.5 18C6 16 4 13.566 4 10.1433Z"
          stroke-width="1.5"
        />
        <circle cx="12" cy="10" r="6" stroke="black" stroke-width="1.5" />
      </svg>
    </div>
  );
};

export default Marker;
