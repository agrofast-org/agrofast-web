import { useForm } from "@/components/form";
import { toNested } from "@/lib/nested";
// import { toNested } from "@/lib/nested";
import { useDisclosure } from "@heroui/react";
import React, { createContext, useContext, useEffect, useState } from "react";

export type ItemIndex = string | number | undefined;

export type Field = {
  type: string;
  required?: boolean;
  options?: string[];
};

export type Fields = Record<string, Field>;

export interface InputGroupProps {
  prefix: string;
  label?: string;
  error?: string;
  min?: number;
  max?: number;
  description?: string;
  list?: boolean;
  modal?: boolean;
  children: React.ReactNode;
}

export interface InputGroupProviderProps {
  disclosure: ReturnType<typeof useDisclosure>;

  prefix: string;
  label?: string;
  error?: string;
  min?: number;
  max?: number;
  description?: string;
  list?: boolean;
  modal?: boolean;

  count: number;
  edit: ItemIndex;
  index: ItemIndex;
  excluded: ItemIndex[];
  fields: Fields;

  getFieldName: (field: string, index?: ItemIndex) => string;
  declaredField: (field: string, info?: Field) => void;
  addNew: () => void;
  editItem: (item: ItemIndex) => void;
  handleEditConfirm: () => void;
  removeItem: (item: ItemIndex) => void;
}

const InputGroupProvider = createContext<InputGroupProviderProps | undefined>(
  undefined
);

const InputGroup: React.FC<InputGroupProps> = ({
  prefix,
  label,
  error,
  min,
  max,
  description,
  list = false,
  modal = false,
  children,
}) => {
  const disclosure = useDisclosure();
  const { onOpen, onClose } = disclosure;
  const form = useForm();
  if (!form) {
    throw new Error("InputGroup must be used within a Form component");
  }

  const [mounted, setMounted] = useState<boolean>(false);

  const [count, setCount] = useState<number>(0);
  const [index, setIndex] = useState<ItemIndex>(count);
  const [edit, setEdit] = useState<ItemIndex>();
  const [excluded, setExcluded] = useState<ItemIndex[]>([]);
  const [fields, setFields] = useState<Fields>({});

  const getFieldName = (field: string, forcedIndex?: ItemIndex) => {
    if (forcedIndex !== undefined) {
      return `${prefix}.${forcedIndex}.${field}`;
    }
    if (list || index === "edit") {
      return `${prefix}.${index}.${field}`;
    }
    return `${prefix}.${field}`;
  };

  const declaredField = (field: string, info?: Field) => {
    if (fields[field]) {
      return;
    }
    setFields((prev) => ({ ...prev, [field]: info || { type: "" } }));
  };

  const addNew = () => {
    const newCount = count + 1;
    setCount(newCount);

    setIndex(newCount);
    setEdit(undefined);

    onClose();
  };

  const editItem = (item: ItemIndex) => {
    setEdit(item);
    Object.keys(fields).forEach((field) => {
      form.setValue(
        getFieldName(field, "edit"),
        form.values[getFieldName(field, list ? item : undefined)]
      );
    });
    setIndex("edit");
    onOpen();
  };

  const handleEditConfirm = () => {
    Object.keys(fields).forEach((field) => {
      form.setValue(
        list
          ? getFieldName(field, list ? edit : undefined)
          : `${prefix}.${field}`,
        form.values[getFieldName(field, "edit")]
      );
      form.setValue(getFieldName(field, "edit"), undefined);
    });
    setEdit(undefined);
    setIndex(count);
    onClose();
  };

  const removeItem = (item: ItemIndex) => {
    setExcluded((prev) => [...prev, item]);
    Object.keys(fields).forEach((field) => {
      form.setValue(getFieldName(field), undefined);
    });
  };

  useEffect(() => {
    if (mounted) return;
    const values = toNested(form.values);
    const length = values[prefix]?.length;
    if (length === undefined) {
      setCount(0);
      setIndex(0);
      setExcluded([]);
      setEdit(undefined);
      setMounted(true);
      return;
    }

    setCount(length || 0);
    setExcluded(
      Object.keys(values[prefix] || {}).filter((key) => {
        return values[prefix][key] === undefined;
      })
    );
    setIndex(length);
    setEdit(undefined);
    setMounted(true);
  }, [form.values, prefix, count, index, mounted]);

  return (
    <InputGroupProvider.Provider
      value={{
        disclosure,

        prefix,
        label,
        error,
        min,
        max,
        description,
        list,
        modal,

        count,
        edit,
        index,
        excluded,
        fields,

        getFieldName,
        declaredField,
        addNew,
        editItem,
        handleEditConfirm,
        removeItem,
      }}
    >
      <div className="hidden holder-inputs" hidden>
        {list &&
          Array.from({ length: count }).map((_, i) => {
            if (excluded.includes(i)) return null;
            return (
              <React.Fragment key={i}>
                {Object.keys(fields).map((field) => {
                  const fullFieldName = `${prefix}.${i}.${field}`;
                  const value = form.values?.[fullFieldName] ?? "";
                  return (
                    <input
                      key={`${i}-${field}`}
                      name={fullFieldName}
                      value={value}
                      hidden
                      readOnly
                    />
                  );
                })}
              </React.Fragment>
            );
          })}
        {!list &&
          Object.keys(fields).map((field) => {
            const fullFieldName = `${prefix}.${field}`;
            const value = form.values?.[prefix]?.[field] ?? "";

            return (
              <input
                key={fullFieldName}
                name={fullFieldName}
                value={value}
                hidden
                readOnly
              />
            );
          })}
      </div>
      <div className="relative flex flex-col gap-2 w-full">
        {/* TODO: internationalize here */}
        {(list || modal) && label && (
          <label className="inline-flex gap-2 text-gray-700 dark:text-gray-200 text-sm !transition-colors !duration-100">
            {label}
            {min && <span>min: {min}</span>}
            {max && <span>max: {max}</span>}
          </label>
        )}
        {children}
        {/* TODO: implement input group error && display if there is errors at the items */}
      </div>
    </InputGroupProvider.Provider>
  );
};

export const useGroup = (): InputGroupProviderProps | undefined => {
  return useContext(InputGroupProvider);
};

export default InputGroup;
