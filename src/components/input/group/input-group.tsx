import { useForm } from "@/components/form";
import { toNested } from "@/lib/nested";
import { useDisclosure } from "@heroui/react";
import { useTranslations } from "next-intl";
import React, { createContext, useContext, useEffect, useState } from "react";

export type ItemIndex = string | number | undefined;

export type Field = {
  type: string;
  required?: boolean;
  options?: string[];
};

export type Fields = Record<string, Field>;

export type MessagesSlots = "insert" | "edit" | "delete";
export type Messages = {
  title?: string;
  description?: string;
  cancel?: string;
  confirm?: string;
};

export type InputGroupCommons = {
  prefix: string;
  label?:
    | string
    | {
        default: string;
        plural: string;
      };
  buttonLabel?:
    | string
    | {
        default: string;
        plural: string;
      };
  error?: string;
  min?: number;
  max?: number;
  description?: string;
  list?: boolean;
  modal?: boolean;

  messages?: Record<MessagesSlots, Messages>;
};

export interface InputGroupProps extends InputGroupCommons {
  children: React.ReactNode;
}

export interface InputGroupProviderProps extends InputGroupCommons {
  messages: Record<MessagesSlots, Messages>;

  disclosure: ReturnType<typeof useDisclosure>;

  count: number;
  edit: ItemIndex;
  index: ItemIndex;
  excluded: ItemIndex[];
  fields: Fields;

  getFieldName: (field: string, index?: ItemIndex) => string;
  declaredField: (field: string, info?: Field) => void;
  addNew: () => void;
  editItem: (item: ItemIndex) => void;
  handleEditCancel: () => void;
  handleEditConfirm: () => void;
  removeItem: (item: ItemIndex) => void;
}

const InputGroupProvider = createContext<InputGroupProviderProps | undefined>(
  undefined
);

export const getMessages = (
  messages: InputGroupProviderProps["messages"],
  slot: MessagesSlots
): Messages => {
  return messages[slot];
};

const InputGroup: React.FC<InputGroupProps> = ({
  prefix,
  label,
  buttonLabel,
  error,
  min,
  max,
  description,
  messages,
  list = false,
  modal = false,
  children,
}) => {
  const groupTranslations = useTranslations("UI.input_group");
  const disclosure = useDisclosure();
  const { onOpen, onClose } = disclosure;
  const form = useForm();
  if (!form) {
    throw new Error("InputGroup must be used within a Form component");
  }
  const defaultMessages: InputGroupProps["messages"] = {
    insert: {
      title: messages?.insert.title ?? groupTranslations("insert.title"),
      description:
        messages?.insert.description ?? groupTranslations("insert.description"),
      cancel: messages?.insert.cancel ?? groupTranslations("insert.cancel"),
      confirm: messages?.insert.confirm ?? groupTranslations("insert.confirm"),
    },
    edit: {
      title: messages?.edit.title ?? groupTranslations("edit.title"),
      description:
        messages?.edit.description ?? groupTranslations("edit.description"),
      cancel: messages?.edit.cancel ?? groupTranslations("edit.cancel"),
      confirm: messages?.edit.confirm ?? groupTranslations("edit.confirm"),
    },
    delete: {
      title: messages?.delete.title ?? groupTranslations("delete.title"),
      description:
        messages?.delete.description ?? groupTranslations("delete.description"),
      cancel: messages?.delete.cancel ?? groupTranslations("delete.cancel"),
      confirm: messages?.delete.confirm ?? groupTranslations("delete.confirm"),
    },
  };

  const [mounted, setMounted] = useState<boolean>(false);

  const [count, setCount] = useState<number>(0);
  const [index, setIndex] = useState<ItemIndex>(count);
  const [edit, setEdit] = useState<ItemIndex>(undefined);
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

  const handleEditCancel = () => {
    Object.keys(fields).forEach((field) => {
      form.setValue(getFieldName(field, "edit"), undefined);
    });
    setEdit(undefined);
    setIndex(count);
    onClose();
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
    setExcluded([]);
    setEdit(undefined);
    setCount(length ?? 0);
    setIndex(length ?? 0);
    setMounted(true);
  }, [form.values, prefix, count, index, mounted]);

  return (
    <InputGroupProvider.Provider
      value={{
        disclosure,

        prefix,
        label,
        error,
        buttonLabel,
        min,
        max,
        description,
        list,
        modal,
        messages: defaultMessages,

        count,
        edit,
        index,
        excluded,
        fields,

        getFieldName,
        declaredField,
        addNew,
        editItem,
        handleEditCancel,
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
      <div className="relative flex flex-col gap-2 pt-[calc(1em+10px)] w-full">
        {/* TODO: internationalize here */}
        {(list || modal) && label && (
          <label className="top-3.5 left-0 z-20 absolute gap-2 *:pl-2 max-w-full text-gray-700 dark:text-gray-200 text-sm truncate !transition-colors -translate-y-1/2 !duration-100">
            {typeof label === 'string' ? label : label.default}
            {min && <span color="">min: {min}</span>}
            {max && <span color="">max: {max}</span>}
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
