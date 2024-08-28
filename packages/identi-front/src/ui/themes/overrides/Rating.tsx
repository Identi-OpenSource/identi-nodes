import React from 'react';
// import { Icon } from '@iconify/react';
// import starFill from '@iconify/icons-eva/star-fill';
import { Theme } from '@mui/material/styles';
// import { SvgIcon } from '@material-ui/core';
import StarIcon from '@mui/icons-material/Star';
// ----------------------------------------------------------------------

const ICON_SMALL = { width: 20, height: 20 };
const ICON_LARGE = { width: 28, height: 28 };

const ICON = (
    <StarIcon />
  // <SvgIcon>
  // </SvgIcon>
);

export default function Rating(theme: Theme) {
  return {
    MuiRating: {
      defaultProps: {
        emptyIcon: ICON,
        icon: ICON
      },

      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            opacity: 0.48
          }
        },
        iconEmpty: { color: theme.palette.grey[500_48] },
        sizeSmall: { '& svg': { ...ICON_SMALL } },
        sizeLarge: { '& svg': { ...ICON_LARGE } }
      }
    }
  };
}
