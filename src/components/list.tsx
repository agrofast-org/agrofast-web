/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/service/api";
import {
  getKeyValue,
  Spinner,
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
  TableColumn,
  Tooltip,
  Button,
} from "@heroui/react";
import { useAsyncList } from "@react-stately/data";
import { Eye, Pen, TrashBinTrash } from "@solar-icons/react";
import { useTranslations } from "next-intl";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

export interface ListProps {
  items?: any[];
  getUrl?: string;
  children?: ReactNode;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

interface ListContextProps {
  items: any[];
  columns: string[];
  identifier: string | undefined;
  setColumn: (name: string, label: string) => void;
  setIdentifier: (name: string) => void;
  setColumnFormatter: (name: string, formatter: (value: any) => any) => void;
  isLoading: boolean;
}

const ListContext = createContext<ListContextProps | undefined>(undefined);

export const useList = (): ListContextProps => {
  const context = useContext(ListContext);
  if (!context) {
    throw new Error("useList must be used within a ListProvider");
  }
  return context;
};

const List: React.FC<ListProps> = ({
  items = [],
  getUrl,
  children,
  onEdit,
  onDelete,
  onView,
}) => {
  const t = useTranslations();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [identifier, setIdentifier] = useState<string | undefined>();
  const [columns, setColumns] = useState<string[]>([]);
  const [columnFormatters, setColumnFormatters] = useState<
    Record<string, (value: any) => any>
  >({});
  const [columnLabels, setColumnLabels] = useState<Record<string, string>>({});

  const setColumn = (name: string, label: string) => {
    setColumns((prev) => (prev.includes(name) ? prev : [...prev, name]));
    setColumnLabels((prev) => ({ ...prev, [name]: label }));
  };

  const setColumnFormatter = (name: string, formatter: (value: any) => any) => {
    setColumnFormatters((prev) => ({ ...prev, [name]: formatter }));
  };

  const list = useAsyncList<any>({
    async load({ signal }) {
      if (getUrl) {
        const data = await api.get(getUrl, { signal }).then((res) => {
          setIsLoading(false);
          return res.data;
        });

        return { items: data };
      }
      setIsLoading(false);
      return { items };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a: any, b: any) => {
          const first = a[sortDescriptor.column];
          const second = b[sortDescriptor.column];
          let cmp =
            (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;
          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }
          return cmp;
        }),
      };
    },
  });

  const renderCell = useCallback(
    (item: any, columnKey: React.Key) => {
      const key = columnKey.toString();

      console.log("item", columnKey);
      if (
        columnKey === "operations" &&
        identifier &&
        (onEdit || onDelete || onView)
      ) {
        return (
          <TableCell>
            <span className="flex flex-row gap-2">
              {onView && (
                <Tooltip
                  content={t("UI.buttons.view")}
                  placement="top"
                  className="text-default-600"
                >
                  <Button
                    isIconOnly
                    size="sm"
                    className="bg-default-100 text-default-600"
                    onPress={() => onView(item[identifier])}
                  >
                    <Eye size={22} />
                  </Button>
                </Tooltip>
              )}
              {onEdit && (
                <Tooltip
                  content={t("UI.buttons.edit")}
                  placement="top"
                  className="text-default-600"
                >
                  <Button
                    isIconOnly
                    size="sm"
                    className="bg-default-100 text-default-600"
                    onPress={() => onEdit(item[identifier])}
                  >
                    <Pen size={22} />
                  </Button>
                </Tooltip>
              )}
              {onDelete && (
                <Tooltip
                  content={t("UI.buttons.delete")}
                  placement="top"
                  color="danger"
                >
                  <Button
                    isIconOnly
                    size="sm"
                    className="bg-default-100"
                    onPress={() => onDelete(item[identifier])}
                  >
                    <TrashBinTrash size={22} className="text-danger-500" />
                  </Button>
                </Tooltip>
              )}
            </span>
          </TableCell>
        );
      }

      return (
        <TableCell className="text-default-600 truncate">
          {columnFormatters[key]
            ? columnFormatters[key](getKeyValue(item, key))
            : getKeyValue(item, key)}
        </TableCell>
      );
    },
    [columnFormatters, identifier, onDelete, onEdit, onView]
  );

  return (
    <ListContext.Provider
      value={{
        items: list.items,
        columns,
        identifier,
        setColumn,
        setIdentifier,
        setColumnFormatter,
        isLoading,
      }}
    >
      {children}
      <Table sortDescriptor={list.sortDescriptor} onSortChange={list.sort}>
        <TableHeader>
          <>
            {columns.map((columnKey: React.Key) => {
              const key = columnKey.toString();
              if (key === "operation") {
                return (
                  <TableColumn key={key}>
                    {columnLabels[key] || key}
                  </TableColumn>
                );
              }
              return (
                <TableColumn allowsSorting key={key}>
                  {columnLabels[key] || key}
                </TableColumn>
              );
            })}
          </>
        </TableHeader>
        <TableBody
          isLoading={isLoading}
          items={list.items}
          loadingContent={<Spinner label="Loading..." />}
          emptyContent={"No rows to display."}
        >
          {(item) => (
            <TableRow key={item.id || item.name}>
              {(columnKey) => renderCell(item, columnKey)}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ListContext.Provider>
  );
};

export interface ListColumnProps {
  name: string;
  label: string;
  date?: boolean;
  currency?: boolean;
  boolean?: boolean;
  booleanFormatter?: (value: any) => any;
  number?: boolean;
  formatter?: (value: any) => any;
}

export const ListColumn: React.FC<ListColumnProps> = ({
  name,
  label,
  date,
  currency,
  boolean,
  booleanFormatter,
  number,
  formatter,
}) => {
  const { columns, setColumn, setColumnFormatter } = useList();

  const formatValue = useCallback(
    (value: any) => {
      if (date) return new Date(value).toLocaleDateString();
      if (currency)
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value);
      if (boolean)
        return booleanFormatter
          ? booleanFormatter(value)
          : value
          ? "Yes"
          : "No";
      if (number) return new Intl.NumberFormat("en-US").format(value);
      if (formatter) return formatter(value);
      return value;
    },
    [boolean, currency, date, number, formatter, booleanFormatter]
  );

  useEffect(() => {
    if (columns.includes(name)) return;
    setColumn(name, label);
    setColumnFormatter(name, formatValue);
  }, [name, label, columns, setColumn, formatValue, setColumnFormatter]);
  return null;
};

export interface IdentifierColumnProps {
  name: string;
  label?: string;
  render?: boolean;
}

export const IdentifierColumn: React.FC<IdentifierColumnProps> = ({
  name,
  label,
  render = false,
}) => {
  const { columns, setColumn, identifier, setIdentifier } = useList();

  useEffect(() => {
    if (!columns.includes(name) && render) {
      setColumn(name, label ?? "Id");
    }
    if (!identifier) {
      setIdentifier(name);
    }
  }, [name, label, render, columns, identifier, setColumn, setIdentifier]);
  return null;
};

export interface ListOperationsProps {
  label?: string;
}
export const ListOperations: React.FC<ListOperationsProps> = ({ label }) => {
  const { columns, setColumn } = useList();

  useEffect(() => {
    if (!columns.includes("operations")) {
      setColumn("operations", label ?? "Operações");
    }
  }, [columns, setColumn, label]);
  return null;
};

export default List;
