import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Box, List, ListItemButton } from '@mui/material';
import LinearProgress from '~/ui/atoms/LinearProgress/LinearProgress';
import TextFieldSearch from '~/ui/molecules/TextFieldSearch/TextFieldSearch';
import { TableHeadColumn } from '~/ui/molecules/TableHead/TableHead';

type ListItemSelectProps = {
  loadDataRowSelected?: (row: any) => void;
  renderItem?: (row: any) => any;
  items: any[];
  handleScroll: (ref: any) => void;
  handleSearch?: (value: any) => void;
  isLoadingSearch?: boolean;
  headers: TableHeadColumn[];
  hideSearch?: boolean;
  value?: any;
};

const ListItemSelect: React.FC<ListItemSelectProps> = (props: ListItemSelectProps) => {
  const {
    loadDataRowSelected,
    value,
    hideSearch,
    headers,
    renderItem,
    items,
    handleSearch,
    handleScroll,
    isLoadingSearch
  } = props;
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const elementRef = useRef<HTMLDivElement>(null);

  // seteo el valor seleccionado
  useEffect(() => {
    if (value) {
      const index = items.findIndex((item: any) => item.id === value.id);
      setSelectedIndex(index);
    }
  }, [value, items]);

  const handleListItemClick = useCallback(
    (index: number) => {
      setSelectedIndex(index);
      loadDataRowSelected && loadDataRowSelected(items[index]);
    },
    [items, loadDataRowSelected]
  );

  return (
    // <Box sx={{ bgcolor: 'background.paper' }}>
    <>
      {!hideSearch && (
        <TextFieldSearch
          isAnimated={false}
          onChange={(value: any) => {
            handleSearch && handleSearch(value);
          }}
        />
      )}
      {isLoadingSearch && (
        <Box my={1} key="loading">
          <LinearProgress loading={true} />
        </Box>
      )}
      <div
        ref={elementRef}
        onScroll={() => handleScroll(elementRef)}
        className="scrollBarClass"
        style={{
          // height: '85%',
          overflow: 'auto',
          display: items?.length === 0 ? 'flex' : 'block',
          alignItems: 'center',
          justifyContent: 'center',
          height: '45vh'
        }}
      >
        <List>
          {items?.length === 0 ? (
            <Box px={2}>No se encontraron registros disponibles.</Box>
          ) : (
            items.map((element: any, index: number) => (
              <ListItemButton
                key={`item_list_${index}`}
                selected={selectedIndex === index}
                onClick={() => handleListItemClick(index)}
              >
                <Box
                  display="flex"
                  alignItems={'left'}
                  flexDirection="column"
                  color={selectedIndex === index ? '#00822B' : undefined}
                >
                  {renderItem && renderItem(element)}
                  {!renderItem &&
                    headers.map((column: TableHeadColumn, columnIndex: number) => {
                      /* evalúa si el head es de acciones no se renderiza aquí, sino en el siguiente */

                      return (
                        <>
                          {!column?.isNotListView && (
                            <Box
                              display="flex"
                              fontSize={'12px'}
                              minHeight="30px"
                              flexDirection="row"
                              alignItems={'center'}
                              key={`column_${index}_${columnIndex}`}
                            >
                              {/* valida si render esta disponible */}
                              <Box mr={3}>{column.text}:</Box>
                              <Box>{column.render ? column.render(element) : element[column.value]}</Box>
                            </Box>
                          )}
                        </>
                      );
                    })}
                </Box>
              </ListItemButton>
            ))
          )}
        </List>
      </div>
    </>
    // </Box>
  );
};

export default ListItemSelect;
