import React from 'react';
// import { Icon } from '@iconify/react';
// import closeCircleFill from '@iconify/icons-eva/close-circle-fill';
import { Theme } from '@mui/material/styles';
import CancelIcon from '@mui/icons-material/Cancel';
// ----------------------------------------------------------------------

export default function Chip(theme: Theme) {
  return {
    MuiChip: {
      defaultProps: {
        deleteIcon: <CancelIcon />
      },

      styleOverrides: {
        colorDefault: {
          '& .MuiChip-avatarMedium, .MuiChip-avatarSmall': {
            color: theme.palette.text.secondary
          }
        },
        outlined: {
          borderColor: theme.palette.grey[500_32],
          '&.MuiChip-colorPrimary': {
            borderColor: theme.palette.primary.main
          },
          '&.MuiChip-colorSecondary': {
            borderColor: theme.palette.secondary.main
          }
        }
      }
    }
  };
}
