import React from 'react'

import './index.css'

import {
    GroupingState,
    useReactTable,
    getPaginationRowModel,
    getFilteredRowModel,
    getCoreRowModel,
    getGroupedRowModel,
    getExpandedRowModel,
    ColumnDef,
    CellContext,
    flexRender,
} from '@tanstack/react-table'
import { makeConnectionData, Connection } from '../makeData'

const dateCellRenderer = <TData,>(x: CellContext<TData, Date>) => x.getValue().toISOString()

const PersonTable = () => {
    const columns = React.useMemo<ColumnDef<Connection>[]>(
        () => [
            {
                header: 'Searched',
                columns: [
                    {
                        accessorKey: 'identifier',
                        header: 'Identifier',
                        cell: info => info.getValue(),
                        /**
                         * override the value used for row grouping
                         * (otherwise, defaults to the value derived from accessorKey / accessorFn)
                         */
                        getGroupingValue: row => `${row.identifier} ${row.identifierType}`
                    },
                    {
                        accessorFn: row => row.identifierType,
                        id: 'identifierType',
                        header: () => <span>Identifier Type</span>,
                        cell: info => info.getValue(),
                    },
                    {
                        header: 'First Seen',
                        accessorKey: 'firstSeen',
                        cell: dateCellRenderer,
                        aggregationFn: 'min',
                        aggregatedCell: dateCellRenderer,
                        enableGrouping: false
                    },
                    {
                        header: 'Last Seen',
                        accessorKey: 'lastSeen',
                        cell: dateCellRenderer,
                        aggregationFn: 'max',
                        aggregatedCell: dateCellRenderer,
                        enableGrouping: false
                    }
                ],
            },
            {
                header: 'Through',
                columns: [
                    {
                        accessorKey: 'throughIdentifierPrimary',
                        header: () => 'Primary',
                        aggregationFn: 'unique',
                    },
                    {
                        accessorKey: 'throughIdentifierSecondary',
                        header: () => 'Secondary',
                        aggregationFn: 'uniqueCount',
                    },
                    {
                        accessorKey: 'type',
                        header: () => 'Type',
                        aggregationFn: 'count',
                    },
                ],
            },
            // {
            //     header: 'Dates',
            //     columns: [
            //         {
            //             header: 'First',
            //             accessorFn: row => row.dates.sort((a, b) => a.localeCompare(b))[0]
            //         },
            //         {
            //             header: 'Last',
            //             accessorFn: row => row.dates.sort((a, b) => b.localeCompare(a))[0]
            //         },
            //         {
            //             header: 'Total',
            //             accessorFn: row => row.dates.length
            //         }
            //     ]
            // },
            {
                header: 'Connected',
                columns: [
                    {
                        accessorKey: 'connectedIdentifier',
                        header: 'Identifier',
                        cell: info => info.getValue(),
                        /**
                         * override the value used for row grouping
                         * (otherwise, defaults to the value derived from accessorKey / accessorFn)
                         */
                        getGroupingValue: row => `${row.connectedIdentifier} ${row.connectedIdentifierType}`
                    },
                    {
                        accessorFn: row => row.connectedIdentifierType,
                        id: 'connectedIdentifierType',
                        header: () => <span>Identifier Type</span>,
                        cell: info => info.getValue(),
                    },
                    {
                        header: 'First Seen',
                        accessorKey: 'connectedFirstSeen',
                        cell: dateCellRenderer,
                        aggregationFn: 'min',
                        aggregatedCell: dateCellRenderer,
                        enableGrouping: false
                    },
                    {
                        header: 'Last Seen',
                        accessorKey: 'connectedLastSeen',
                        cell: dateCellRenderer,
                        aggregationFn: 'max',
                        aggregatedCell: dateCellRenderer,
                        enableGrouping: false
                    }
                ],
            },
        ],
        []
    )

    const [data, setData] = React.useState(() => {
        console.debug('generating fake data...')
        const d = makeConnectionData(10000)
        console.debug('completedfake data generation.')
        return d
})
    const refreshData = () => setData(() => makeConnectionData(10000))

    const [grouping, setGrouping] = React.useState<GroupingState>([])

    const table = useReactTable({
        data,
        columns,
        state: {
            grouping,
        },
        onGroupingChange: setGrouping,
        getExpandedRowModel: getExpandedRowModel(),
        getGroupedRowModel: getGroupedRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        debugTable: true,
    })

    return (
        <div className="p-2">
            <div className="h-2" />
            <table>
                <thead>
                    {
                        table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {
                                    headerGroup.headers.map(header => {
                                        return (
                                            <th key={header.id} colSpan={header.colSpan}>
                                                {
                                                    header.isPlaceholder ? null : (
                                                        <div>
                                                            {
                                                                header.column.getCanGroup() ? (
                                                                    // If the header can be grouped, let's add a toggle
                                                                    <button
                                                                        {
                                                                        ...{
                                                                            onClick: header.column.getToggleGroupingHandler(),
                                                                            style: {
                                                                                cursor: 'pointer',
                                                                            },
                                                                        }
                                                                        }
                                                                    >
                                                                        {
                                                                            header.column.getIsGrouped()
                                                                                ? `🛑(${header.column.getGroupedIndex()}) `
                                                                                : `👊 `
                                                                        }
                                                                    </button>
                                                                ) : null
                                                            }{' '}
                                                            {
                                                                flexRender(
                                                                    header.column.columnDef.header,
                                                                    header.getContext()
                                                                )
                                                            }
                                                        </div>
                                                    )
                                                }
                                            </th>
                                        )
                                    })}
                            </tr>
                        ))}
                </thead>
                <tbody>
                    {
                        table.getRowModel().rows.map(row => {
                            return (
                                <tr key={row.id}>
                                    {
                                        row.getVisibleCells().map(cell => {
                                            return (
                                                <td
                                                    {
                                                    ...{
                                                        key: cell.id,
                                                        style: {
                                                            background: cell.getIsGrouped()
                                                                ? '#0aff0082'
                                                                : cell.getIsAggregated()
                                                                    ? '#ffa50078'
                                                                    : cell.getIsPlaceholder()
                                                                        ? '#ff000042'
                                                                        : 'black',
                                                        },
                                                    }
                                                    }
                                                >
                                                    {
                                                        cell.getIsGrouped() ? (
                                                            // If it's a grouped cell, add an expander and row count
                                                            <>
                                                                <button
                                                                    {
                                                                    ...{
                                                                        onClick: row.getToggleExpandedHandler(),
                                                                        style: {
                                                                            cursor: row.getCanExpand()
                                                                                ? 'pointer'
                                                                                : 'normal',
                                                                        },
                                                                    }
                                                                    }
                                                                >
                                                                    {row.getIsExpanded() ? '👇' : '👉'}{' '}
                                                                    {
                                                                        flexRender(
                                                                            cell.column.columnDef.cell,
                                                                            cell.getContext()
                                                                        )
                                                                    } {' '}
                                                                    ({row.subRows.length})
                                                                </button>
                                                            </>
                                                        ) : cell.getIsAggregated() ? (
                                                            // If the cell is aggregated, use the Aggregated
                                                            // renderer for cell
                                                            flexRender(
                                                                cell.column.columnDef.aggregatedCell ??
                                                                cell.column.columnDef.cell,
                                                                cell.getContext()
                                                            )
                                                        ) : cell.getIsPlaceholder() ? null : ( // For cells with repeated values, render null
                                                            // Otherwise, just render the regular cell
                                                            flexRender(
                                                                cell.column.columnDef.cell,
                                                                cell.getContext()
                                                            )
                                                        )
                                                    }
                                                </td>
                                            )
                                        })}
                                </tr>
                            )
                        })}
                </tbody>
            </table>
            <div className="h-2" />
            <div className="flex items-center gap-2">
                <button
                    className="border rounded p-1"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<<'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {'>'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    {'>>'}
                </button>
                <div>
                    Total Records: {table.getRowCount().toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                    <span>Page </span>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount()}
                    </strong>
                </div>
                <span className="flex items-center gap-1">
                    | Go to page:
                    <input
                        type="number"
                        min="1"
                        max={table.getPageCount()}
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            table.setPageIndex(page)
                        }}
                        className="border p-1 rounded w-16"
                    />
                </span>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value))
                    }}
                >
                    {
                        [10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))
                    }
                </select>
            </div>
            <div> {table.getRowModel().rows.length} Rows </div>

            <div>
                <button onClick={() => refreshData()}> Refresh Data </button>
            </div>
            <pre> {JSON.stringify(grouping, null, 2)} </pre>
        </div>
    )
}

export default PersonTable