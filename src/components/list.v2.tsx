import { useLoadingDisclosure } from "@/hooks/use-loading-disclosure";
import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useAsyncList } from "@react-stately/data";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export interface Column<CType> {
  label: string;
  format?: (
    value: string | number | boolean | null | undefined,
    list: CType
  ) => React.ReactNode;
}

export type Columns<DType> = {
  [key in keyof DType]: Column<DType>;
} & {
  positions?: (keyof DType)[];
};

export interface Operation<DType> {
  label: string;
  action: (item: DType) => void;
}

export type Actions<DType> = Record<string, Operation<DType>>;

export type ListProps<TSuccess extends AxiosResponse = AxiosResponse> = {
  id: string;
  get: () => Promise<TSuccess | void>;
  columns: Columns<TSuccess["data"]>;
  actions?: Actions<TSuccess["data"]>;
};

export type RequestDataType<T extends AxiosResponse = AxiosResponse> =
  T["data"];

export function List<TSuccess extends AxiosResponse = AxiosResponse>({
  id,
  get,
  columns: initialColumns,
  actions,
}: ListProps<TSuccess>) {
  const loadingDisclosure = useLoadingDisclosure();

  const { positions, ...columns } = {
    ...initialColumns,
    actions: actions ? { label: "Ações" } : undefined,
  };

  const { data } = useQuery({
    initialData: undefined,
    queryKey: [id, get],
    queryFn: () => {
      loadingDisclosure.loading();
      return get()
        .then((response) => {
          loadingDisclosure.complete();
          return response?.data;
        })
        .catch(() => {
          loadingDisclosure.complete();
          return [];
        });
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const list = useAsyncList<any>({
    async load() {
      return { items: data || [] };
    },
    async sort({ items, sortDescriptor }) {
      return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  return (
    <Table sortDescriptor={list.sortDescriptor} onSortChange={list.sort}>
      <TableHeader>
        {(positions
          ? positions
          : Object.keys(columns).filter((key) => key !== "positions")
        ).map((key) => (
          <TableColumn key={String(key)}>
            {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (columns as Record<string, Column<any>>)[String(key)].label
            }
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody
        isLoading={loadingDisclosure.isLoading}
        items={list.items}
        loadingContent={<Spinner label="Loading..." />}
        emptyContent="No rows to display."
      >
        {(item) => (
          <TableRow key={item.id || item.name}>
            {(col) => (
              <TableCell className="text-default-600 truncate">
                {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (columns as Record<string, Column<any>>)[col]?.format
                    ? (
                        columns as Record<
                          string,
                          Column<RequestDataType<TSuccess>>
                        >
                      )[col].format!(item[col], item)
                    : item[col]
                }
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
