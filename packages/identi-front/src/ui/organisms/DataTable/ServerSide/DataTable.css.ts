// import { makeStyles } from '@mui/styles';

import { makeStyles } from '@mui/material';

const useStyles: any = makeStyles({
  bodyCell: {
    padding: '5px'
  },
  table: {
    minWidth: 500,
    height: '2px'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  visuallyHidden: {
    background: 'red',
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1
  }
});

export default useStyles;
