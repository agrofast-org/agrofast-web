/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/service/api";
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
  TooltipPlacement,
  cn,
} from "@heroui/react";

import { useAsyncList } from "@react-stately/data";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

interface TooltipProps {
  placement?: TooltipPlacement;
  color?:
    | "default"
    | "foreground"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | undefined;
}

interface ListActionConfig {
  label: string;
  icon: React.ReactNode;
  callback: (id: any, item: any) => void;
  tooltipProps?: TooltipProps;
}

interface ListContextProps {
  items: any[];
  columns: Record<string, string>;
  identifier?: string;
  isLoading: boolean;
  setColumn: (name: string, label: string) => void;
  setIdentifier: (name: string) => void;
  setColumnFormatter: (name: string, formatter: (value: any) => any) => void;
  actions: Record<string, ListActionConfig>;
  setAction: (name: string, action: ListActionConfig) => void;
}

const ListContext = createContext<ListContextProps | undefined>(undefined);
export const useList = (): ListContextProps => {
  const context = useContext(ListContext);
  if (!context) {
    throw new Error("useList must be used within a ListProvider");
  }
  return context;
};

const List: React.FC<{
  items?: any[];
  getUrl?: string;
  children?: ReactNode;
}> = ({ items = [], getUrl, children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [identifier, setIdentifier] = useState<string>();
  const [columns, setColumns] = useState<Record<string, string>>({});
  const [columnFormatters, setColumnFormatters] = useState<
    Record<string, (value: any) => any>
  >({});

  const [actions, setActions] = useState<Record<string, ListActionConfig>>({});
  const setAction = (name: string, action: ListActionConfig) => {
    setActions((prev) => ({
      ...prev,
      [name]: action,
    }));
  };

  const list = useAsyncList<any>({
    async load({ signal }) {
      if (getUrl) {
        const data = await api.get(getUrl, { signal }).then((res) => res.data);
        setIsLoading(false);
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
          if (sortDescriptor.direction === "descending") cmp *= -1;
          return cmp;
        }),
      };
    },
  });

  const renderCell = useCallback(
    (item: any, columnKey: React.Key) => {
      const key = columnKey.toString();

      if (key === "operations" && identifier) {
        return (
          <TableCell>
            <div className="flex flex-row gap-2">
              {Object.entries(actions).map(([name, action]) => (
                <Tooltip
                  key={name}
                  delay={200}
                  closeDelay={0}
                  content={action.label}
                  placement={action.tooltipProps?.placement || "top"}
                  color={action.tooltipProps?.color || "default"}
                >
                  <Button
                    isIconOnly
                    size="sm"
                    className="bg-default-100 text-default-600"
                    onPress={() => action.callback(item[identifier], item)}
                  >
                    {action.icon}
                  </Button>
                </Tooltip>
              ))}
            </div>
          </TableCell>
        );
      }
      return (
        <TableCell className="text-default-600 !truncate">
          {columnFormatters[key]
            ? columnFormatters[key](getKeyValue(item, key))
            : getKeyValue(item, key)}
        </TableCell>
      );
    },
    [actions, columnFormatters, identifier]
  );

  return (
    <ListContext.Provider
      value={{
        items: list.items,
        columns,
        identifier,
        isLoading,
        setColumn: (name, label) => {
          setColumns((prev) => ({ ...prev, [name]: label }));
        },
        setIdentifier,
        setColumnFormatter: (name, formatter) => {
          setColumnFormatters((prev) => ({ ...prev, [name]: formatter }));
        },
        actions,
        setAction,
      }}
    >
      {children}
      <Table
        aria-label="Componente de listagem"
        className="mb-1"
        classNames={{}}
        sortDescriptor={list.sortDescriptor}
        onSortChange={list.sort}
      >
        <TableHeader>
          {Object.entries(columns).map(([key, label]) => (
            <TableColumn
              key={key}
              allowsSorting={key !== "operations"}
              className={cn({
                "w-[1%] min-w-min": key === "operations",
              })}
            >
              {label}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody
          isLoading={isLoading}
          items={list.items}
          loadingContent={<Spinner label="Carregando..." />}
          emptyContent="Nenhum item encontrado."
        >
          {(item) => (
            <TableRow key={item.id || item.name}>
              {(col) => renderCell(item, col)}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ListContext.Provider>
  );
};

export default List;

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
  const format = useCallback(
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
    [boolean, booleanFormatter, currency, date, formatter, number]
  );
  useEffect(() => {
    if (!(name in columns)) {
      setColumn(name, label);
      setColumnFormatter(name, format);
    }
  }, [name, label, columns, setColumn, setColumnFormatter, format]);
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
  const { columns, setColumn, setIdentifier, identifier } = useList();
  useEffect(() => {
    if (!(name in columns) && render) setColumn(name, label || name);
    if (!identifier) setIdentifier(name);
  }, [name, label, render, columns, identifier, setColumn, setIdentifier]);
  return null;
};

export interface ListOperationsProps {
  label?: string;
  children?: ReactNode;
}
export const ListOperations: React.FC<ListOperationsProps> = ({
  label,
  children,
}) => {
  const { columns, setColumn } = useList();
  useEffect(() => {
    if (!("operations" in columns))
      setColumn("operations", label || "Operations");
  }, [columns, setColumn, label]);
  return <>{children}</>;
};

export interface ListActionProps {
  name: string;
  label: string;
  icon: React.ReactNode;
  onAction: (id: any, item: any) => void;
  tooltipProps?: TooltipProps;
}
export const ListAction: React.FC<ListActionProps> = ({
  name,
  label,
  icon,
  onAction,
  tooltipProps,
}) => {
  const { actions, setAction } = useList();
  useEffect(() => {
    if (name in actions) return;
    setAction(name, { label, icon, callback: onAction, tooltipProps });
  }, [name, label, icon, onAction, actions, tooltipProps, setAction]);
  return null;
};
