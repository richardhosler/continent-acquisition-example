import { createTable, sortRowsFn, useTable } from "@tanstack/react-table";
import React, { useState, useMemo } from "react";

interface Country {
  name: string;
}

const table = createTable<{ Row: Country }>();

export const Table = () => {
  const [sorting, setSorting] = useState([]);

  const columns = useMemo(
    () =>
      table.createColumns([
        table.createGroup({
          header: "Name",
          footer: (props) => props.column.id,
          columns: [
            table.createDataColumn("name", {
              cell: (info) => info.value,
              footer: (props) => props.column.id,
            }),
          ],
        }),
      ]),
    []
  );

  const [data, setData] = useState(() => [{ name: "Alex" }]);

  const instance = useTable(table, {
    data,
    columns,
    state: {
      sorting,
    },
    sortRowsFn: sortRowsFn,
  });

  return (
    <table {...instance.getTableProps({})}>
      <thead>
        {instance.getHeaderGroups().map((headerGroup, key) => (
          <tr key={key} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((header, key) => {
              return (
                <th key={key} {...header.getHeaderProps()}>
                  {header.isPlaceholder ? null : (
                    <div
                      {...(header.column.getCanSort()
                        ? header.column.getToggleSortingProps({
                            className: "cursor-pointer select-none",
                          })
                        : {})}
                    >
                      {header.renderHeader()}
                      {{
                        asc: " ▲",
                        desc: " ▼",
                      }[String(header.column.getIsSorted())] ?? null}
                    </div>
                  )}
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody {...instance.getTableBodyProps()}>
        {instance
          .getRowModel()
          .rows.slice(0, 10)
          .map((row, key) => {
            return (
              <tr key={key} {...row.getRowProps()}>
                {row.getVisibleCells().map((cell, key) => {
                  return (
                    <td key={key} {...cell.getCellProps()}>
                      {cell.renderCell()}
                    </td>
                  );
                })}
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};
