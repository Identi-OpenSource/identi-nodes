import React from 'react';
import { TableHeadColumn } from '../TableHead/TableHead';
import { TableCell, TableRow, TableBody, CircularProgress } from '@mui/material';
import TableBodyRow from './TableBodyRow';

/**
 * TableBodyActions define los atributos para las acciones de cada botón en la tabla (en este caso botones)
 */
export type TableBodyActions = {
  onClick: (value: any, index: number) => void;
  text: string;
  tooltip?: string;
  icon: React.ReactElement;
};

/**
 * se obtienen los (headers) de la tabla, teniendo en cuenta el value "actions" el cual define si la tabla
 * posee acciones
 * param actions[] define los botones que posee cada fila
 */
export type TableBodyProps = {
  headers: TableHeadColumn[];
  items: any[];
  textNoItems?: string;
  loading?: boolean;
  isCollapsible?: boolean;
};

const CustomTableBody: React.FC<TableBodyProps> = (props: TableBodyProps) => {
  const { items, headers, textNoItems, loading, isCollapsible }: TableBodyProps = props;

  return (
    <>
      <TableBody>
        {loading ? (
          <TableRow
            sx={{
              borderBottom: '1px solid #0000001d'
            }}
          >
            <TableCell align="center" colSpan={headers.length}>
              <CircularProgress color="primary" />
            </TableCell>
          </TableRow>
        ) : items.length > 0 ? (
          items.map((row: any, rowIndex: number) => {
            if (isCollapsible !== undefined && isCollapsible) {
              return (
                <React.Fragment key={`table_body_row_${rowIndex}`}>
                  <TableBodyRow row={row} headers={headers} />
                </React.Fragment>
              );
            }
            return (
              <TableRow
                key={`table_body_row_${rowIndex}`}
                hover={true}
                sx={{
                  borderBottom: '1px solid #0000001d'
                }}
              >
                {headers.map((column: TableHeadColumn, columnIndex: number) => {
                  /* evalúa si el head es de acciones no se renderiza aquí, sino en el siguiente */

                  return (
                    <TableCell
                      align={column.align}
                      key={`table_value_${columnIndex}`}
                      style={{
                        maxWidth: column.maxWidth || '220px',
                        padding: '10px',
                        width: '200px',
                        wordBreak: 'break-word'
                      }}
                    >
                      {/* valida si render esta disponible */}
                      {column.render ? column.render(row) : row[column.value]}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell
              align="center"
              colSpan={headers.length}
              sx={{
                fontSize: '14px',
                padding: '15px',
                fontWeight: 'bold'
              }}
            >
              {textNoItems}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </>
  );
};

CustomTableBody.defaultProps = {
  headers: [],
  items: [],
  loading: false,
  textNoItems: 'No se encontraron resultados.',
  isCollapsible: false
};

export default React.memo(CustomTableBody);
