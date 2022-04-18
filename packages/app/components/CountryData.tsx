import { CountryInterface } from "../utils/restCountriesInterface";
import { createTable, sortRowsFn, useTable } from "@tanstack/react-table";
import { useState, useMemo } from "react";
import Image from "next/image";
import { numberFormatter } from "../utils/numberFormatter";
import { twMerge } from "tailwind-merge";
interface CountryDataViewInterface {
  data: CountryInterface[];
  headerStyle?: string;
}

const table = createTable<{ Row: CountryInterface }>();

export const CountryDataView = ({
  data,
  headerStyle,
}: CountryDataViewInterface) => {
  const [sorting, setSorting] = useState([]);

  const columns = useMemo(
    () =>
      table.createColumns([
        table.createDataColumn("name", {
          header: "Country",
          cell: (info) => info.value.common,
        }),
        table.createDataColumn("flags", {
          header: "Flag",
          cell: (info) => (
            <Image width={24} height={18} alt="flag" src={info.value.svg} />
          ),
        }),
        table.createDataColumn("population", {
          header: "Population",
          cell: (info) => numberFormatter(info.value),
        }),
        table.createDataColumn("area", {
          header: "Area km\u00B2",
          cell: (info) => numberFormatter(info.value),
        }),
      ]),
    []
  );

  const instance = useTable(table, {
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting, //TODO: get rid of the red squiggly line
    sortRowsFn: sortRowsFn,
  });

  const headerClasses = twMerge(
    "bg-slate-800 text-slate-100 text-left font-semibold w-full py-2 px-4",
    headerStyle
  );
  return (
    <div>
      <table
        {...instance.getTableProps({})}
        className="w-full block overflow-y-scroll h-80"
      >
        <thead>
          {instance.getHeaderGroups().map((headerGroup, key) => (
            <tr key={key} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((header, key) => {
                return (
                  <th
                    className={headerClasses}
                    key={key}
                    {...header.getHeaderProps()}
                  >
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
                          asc: "▲",
                          desc: "▼",
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
          {instance.getRowModel().rows.map((row, key) => {
            return (
              <tr
                className={key % 2 === 1 ? "bg-slate-100" : "bg-slate-200"}
                key={key}
                {...row.getRowProps()}
              >
                {row.getVisibleCells().map((cell, key) => {
                  return (
                    <td
                      key={key}
                      {...cell.getCellProps()}
                      className="py-2 px-4"
                    >
                      {cell.renderCell()}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
