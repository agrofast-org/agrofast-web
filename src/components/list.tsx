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
} from "@heroui/react";
import { useAsyncList } from "@react-stately/data";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface ListProps {
  items?: any[];
  getUrl?: string;
  children?: ReactNode;
}

interface ListContextProps {
  items: any[];
  columns: string[];
  setColumn: (name: string, label: string) => void;
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

const List: React.FC<ListProps> = ({ items = [], getUrl, children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [columns, setColumns] = useState<string[]>([]);
  const [columnLabels, setColumnLabels] = useState<Record<string, string>>({});

  const setColumn = (name: string, label: string) => {
    setColumns((prev) => (prev.includes(name) ? prev : [...prev, name]));
    setColumnLabels((prev) => ({ ...prev, [name]: label }));
  };

  const list = useAsyncList<any>({
    async load({ signal }) {
      if (getUrl) {
        const { data } = await api.get(getUrl, { signal }).then((res) => {
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

  return (
    <ListContext.Provider
      value={{ items: list.items, columns, setColumn, isLoading }}
    >
      {children}
      <Table sortDescriptor={list.sortDescriptor} onSortChange={list.sort}>
        <TableHeader>
          {columns.map((name) => (
            <TableColumn key={name} allowsSorting>
              {columnLabels[name] || name}
            </TableColumn>
          ))}
        </TableHeader>

        <TableBody
          isLoading={isLoading}
          items={list.items}
          loadingContent={<Spinner label="Loading..." />}
          emptyContent={"No rows to display."}
        >
          {(item) => (
            <TableRow key={item.id || item.name}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ListContext.Provider>
  );
};

export const ListColumn: React.FC<{ name: string; label: string }> = ({
  name,
  label,
}) => {
  const { columns, setColumn } = useList();
  useEffect(() => {
    if (columns.includes(name)) return;
    setColumn(name, label);
  }, [name, label, columns, setColumn]);
  return null;
};

export default List;
