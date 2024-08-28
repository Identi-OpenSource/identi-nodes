import React from 'react';
import { Toolbar, Box } from '@mui/material';
import { experimentalStyled as styled } from '@mui/material/styles';

const ToolbarStyle = styled(Toolbar)(() => ({
  backgroundColor: '#09304F',
  color: 'white',
  paddingTop: 15,
  paddingBottom: 15
}));

export type HeaderProps = {
  activeDrawer?: boolean;
  handleActiveDrawer?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children?: React.ReactNode;
  titulo?: string;
};

const CustomHeader: React.FC<HeaderProps> = () => {
  return (
    <ToolbarStyle>
      <Box fontWeight={700} textAlign="center" width="100%" fontSize="28px">
        Credencial Verificable
      </Box>
    </ToolbarStyle>
  );
};

CustomHeader.defaultProps = {
  handleActiveDrawer: () => null
};

export default React.memo(CustomHeader);
