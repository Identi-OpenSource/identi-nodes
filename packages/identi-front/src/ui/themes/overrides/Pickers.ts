import { alpha, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function Pickers(theme: Theme) {
  return {
    PrivatePickersPopper: {
      styleOverrides: {
        paper: {
          boxShadow: theme.customShadows.z24,
          borderRadius: theme.shape.borderRadius
        }
      }
    },

    PrivatePicker: {
      styleOverrides: {
        root: {
          overflow: 'hidden',
          borderRadius: theme.shape.borderRadius,
          '& .PrivatePickersToolbar-root': {
            color: theme.palette.common.white,
            backgroundColor: theme.palette.primary.main,
            '& .MuiTypography-root': {
              color: alpha(theme.palette.common.white, 0.72),
              '&.Mui-selected': {
                color: theme.palette.common.white
              }
            }
          },
          '& .MuiTab-root': {
            margin: 0,
            color: alpha(theme.palette.common.white, 0.72),
            '&.Mui-selected': {
              color: theme.palette.common.white
            }
          },
          '& .MuiTabs-indicator': {
            width: '160px !important',
            backgroundColor: theme.palette.primary.dark
          }
        },
        landscape: {
          border: `solid 1px ${theme.palette.divider}`
        }
      }
    },

    MuiDateRangePickerViewDesktop: {
      styleOverrides: {
        root: {
          border: `solid 1px ${theme.palette.divider}`,
          borderRadius: theme.shape.borderRadius
        }
      }
    }
  };
}
