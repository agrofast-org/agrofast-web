import { cn } from "@/lib/utils";
import { ItemIndex, useGroup } from "@/components/input/group/input-group";
import { useForm } from "@/components/form";
import { createContext, ReactNode, useContext, useState } from "react";
import InputGroupMenu from "@/components/ux/input-group-menu";
import { FormValue } from "@/types/form";

export interface InputGroupDisplayProps {
  className?: string;
  children?: React.ReactNode;
}

const InputGroupDisplay: React.FC<InputGroupDisplayProps> = ({
  className,
  children,
}) => {
  const group = useGroup();
  if (!group) {
    throw new Error(
      "InputGroupDisplay must be used within a InputGroup component"
    );
  }

  const visibleItems = Array.from({ length: group.count }).filter(
    (_, i) => !group.excluded.includes(i)
  );

  if (visibleItems.length === 0) return null;

  return (
    <div
      className={cn(
        "flex flex-col shadow-sm border-2 border-default-200 rounded-xl"
      )}
    >
      {Array.from({ length: group.count }).map((_, i) => {
        if (group.excluded.includes(i)) return null;
        return (
          <InputGroupIndexProvider key={i} index={i}>
            <div
              className={cn(
                "group relative flex flex-row gap-2 p-3 py-2",
                className
              )}
            >
              {children}
              <InputGroupMenu index={i} />
            </div>
            <span className="last:hidden bg-default-200 w-full h-[2px]" />
          </InputGroupIndexProvider>
        );
      })}
    </div>
  );
};

interface InputGroupIndexContextProps {
  index: ItemIndex;
}

const InputGroupIndexContext = createContext<
  InputGroupIndexContextProps | undefined
>(undefined);

export const InputGroupIndex = (): InputGroupIndexContextProps => {
  const context = useContext(InputGroupIndexContext);
  if (!context) {
    throw new Error(
      "InputGroupIndex must be used within a InputGroupIndexProvider"
    );
  }
  return context;
};

export const InputGroupIndexProvider: React.FC<{
  index: ItemIndex;
  children: ReactNode;
}> = ({ index: ItemIndex, children }) => {
  const [index] = useState<ItemIndex>(ItemIndex);

  return (
    <InputGroupIndexContext.Provider value={{ index }}>
      {children}
    </InputGroupIndexContext.Provider>
  );
};

export interface InputGroupItemProps {
  name: string;
  className?: string;
  label?: string;
  icon?: string;
  children?: (value: FormValue, field?: Record<string, FormValue>) => ReactNode;
}

export const InputGroupItem: React.FC<InputGroupItemProps> = ({
  name,
  label,
  icon,
  className,
  children,
}) => {
  const form = useForm();
  if (!form) {
    throw new Error("InputGroupItem must be used within a Form component");
  }

  const group = useGroup();
  if (!group) {
    throw new Error(
      "InputGroupItem must be used within a InputGroup component"
    );
  }

  const { index } = InputGroupIndex();
  const prefix = group.list ? `${group.prefix}.${index}` : group.prefix;
  const fullFieldName = `${prefix}.${name}`;
  const value = form.values?.[fullFieldName];
  const fields: Record<string, FormValue> = Object.keys(group.fields).reduce(
    (result, fieldName) => {
      result[fieldName] = form.values?.[`${prefix}.${fieldName}`];
      return result;
    },
    {} as Record<string, FormValue>
  );

  console.log(fields);

  return (
    <div className={cn("flex flex-row items-center gap-2", className)}>
      {icon && <span>{icon}</span>}
      {label && <p className="text-muted-foreground text-sm">{label}:</p>}
      <span className="text-foreground text-sm">
        {children ? children(value, fields) : value ?? "-"}
      </span>
    </div>
  );
};

export default InputGroupDisplay;
