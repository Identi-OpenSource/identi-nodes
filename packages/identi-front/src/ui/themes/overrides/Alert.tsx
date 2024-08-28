import React from 'react';
// import { Icon } from '@iconify/react';
// import infoFill from '@iconify/icons-eva/info-fill';
import InfoIcon from '@mui/icons-material/Info';
// import alertCircleFill from '@iconify/icons-eva/alert-circle-fill';
import ErrorIcon from '@mui/icons-material/Error';
// import alertTriangleFill from '@iconify/icons-eva/alert-triangle-fill';
import WarningIcon from '@mui/icons-material/Warning';
// import checkmarkCircle2Fill from '@iconify/icons-eva/checkmark-circle-2-fill';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// material
import { Theme } from '@mui/material/styles';
// @types
import { ColorSchema } from '../@types/theme';

// ----------------------------------------------------------------------

export default function Alert(theme: Theme) {
  const isLight = theme.palette.mode === 'light';

  const standardStyle = (color: ColorSchema) => ({
    color: theme.palette[color][isLight ? 'darker' : 'lighter'],
    backgroundColor: theme.palette[color][isLight ? 'lighter' : 'darker']
  });

  const filledStyle = (color: ColorSchema) => ({
    color: theme.palette[color].contrastText
  });

  const outlinedStyle = (color: ColorSchema) => ({
    color: theme.palette[color][isLight ? 'darker' : 'lighter'],
    border: `solid 1px ${theme.palette[color][isLight ? 'light' : 'dark']}`,
    backgroundColor: theme.palette[color][isLight ? 'lighter' : 'darker']
  });

  return {
    MuiAlert: {
      defaultProps: {
        iconMapping: {
          error: <InfoIcon />,
          info: <ErrorIcon />,
          success: <CheckCircleIcon />,
          warning: <WarningIcon />
        }
      },

      styleOverrides: {
        message: {
          '& .MuiAlertTitle-root': {
            marginBottom: theme.spacing(0.5)
          }
        },
        action: {
          '& button:not(:first-of-type)': {
            marginLeft: theme.spacing(1)
          }
        },

        standardInfo: standardStyle('info'),
        standardSuccess: standardStyle('success'),
        standardWarning: standardStyle('warning'),
        standardError: standardStyle('error'),

        filledInfo: filledStyle('info'),
        filledSuccess: filledStyle('success'),
        filledWarning: filledStyle('warning'),
        filledError: filledStyle('error'),

        outlinedInfo: outlinedStyle('info'),
        outlinedSuccess: outlinedStyle('success'),
        outlinedWarning: outlinedStyle('warning'),
        outlinedError: outlinedStyle('error')
      }
    }
  };
}
