// import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import { Theme } from '@mui/material/styles';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Select(theme: Theme) {
  return {
    MuiSelect: {
      defaultProps: {
        IconComponent: ExpandMoreRoundedIcon
      },

      styleOverrides: {
        root: {}
      }
    }
  };
}
