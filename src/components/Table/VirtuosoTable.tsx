import { TableComponents } from 'react-virtuoso';
import { ForwardedRef, forwardRef } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { TableProps } from '@mui/material/Table/Table';

export const getVirtuosoTableComponents = <T,>(
    columnsCount: number = 1
): TableComponents<T> => {
    return {
        Scroller: forwardRef((props, ref: ForwardedRef<HTMLDivElement>) => (
            <TableContainer
                component={'div'}
                {...props}
                ref={ref}
            />
        )),
        Table: (props: TableProps) => (
            <Table
                {...props}
                size="small"
                style={{
                    borderCollapse: 'separate',
                    tableLayout: 'fixed',
                }}
            />
        ),
        TableHead: forwardRef(
            (props, ref: ForwardedRef<HTMLTableSectionElement>) => (
                <TableHead
                    {...props}
                    ref={ref}
                />
            )
        ),
        TableRow: TableRow,
        TableBody: forwardRef(
            (props, ref: ForwardedRef<HTMLTableSectionElement>) => (
                <TableBody
                    {...props}
                    ref={ref}
                />
            )
        ),
        EmptyPlaceholder: forwardRef(
            (props, ref: ForwardedRef<HTMLTableSectionElement>) => (
                <TableBody
                    {...props}
                    ref={ref}
                >
                    <TableRow>
                        <TableCell colSpan={columnsCount}>
                            <Typography sx={{ textAlign: 'center' }}>
                                No results match your search criteria
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableBody>
            )
        ),
    };
};
