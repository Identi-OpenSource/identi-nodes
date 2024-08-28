import React from 'react';
// import { useSelector } from 'react-redux';
import { Drawer, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MuiDrawer from '@mui/material/Drawer';
import { experimentalStyled as styled } from '@mui/material/styles';
import { Theme, CSSObject } from '@mui/material/styles';
// import { makeStyles } from '@mui/styles';

import { MHidden } from '~/ui/components/@material-extend';
import SideBarContent from './SideBarContent';

export type SideBarProps = {
  handleActiveDrawer?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  activeDrawer: boolean;
  drawerWidth?: number;
  routes?: any[];
  isLogoLoading: boolean;
  logo: any;
  setTitulo?: any;
};

const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme }: any) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0
    // width: DRAWER_WIDTH
  }
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar
}));

const openedMixin = (theme: Theme): CSSObject => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: 'hidden'
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(8)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(9)} + 1px)`
  }
});

const CustomDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  overflow: 'hidden',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme)
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme)
  })
}));

// const useStyles: any = makeStyles((theme: Theme) => ({
//   drawerOpen: (props: SideBarProps) => ({
//     [theme.breakpoints.up('xs')]: {
//       width: `${props.drawerWidth}px`
//     }
//   }),
//   drawerClose: {
//     transition: theme.transitions.create('width', {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.leavingScreen
//     }),
//     overflowX: 'hidden',
//     width: 0
//   },
//   toolbarIcon: {
//     alignItems: 'center',
//     display: 'flex',
//     justifyContent: 'center',
//     flexDirection: 'column',
//     padding: '10px 8px'
//   },
//   toolbarLogo: {
//     display: 'flex',
//     padding: '10px 8px',
//     flexDirection: 'row',
//     justifyContent: 'center'
//   }
// }));

const CustomSideBar: React.FC<SideBarProps> = (props: SideBarProps) => {
  const { activeDrawer, setTitulo, drawerWidth, isLogoLoading, logo, handleActiveDrawer }: SideBarProps = props;

  // const classes = useStyles({ drawerWidth, isLogoLoading, logo });

  // const { auth }: any = useSelector((state: any) => state);

  // useEffect(() => {
  //   if (auth.user?.payload?.association_id) {
  //     setLogo(COMMUNITY_BASE_URL_S3 + 'associations/' + auth?.user?.payload.association_id + '/images/logo.svg');
  //   }
  // }, [auth?.association, auth?.user?.payload]);
  // const [open, setOpen] = React.useState(false);

  // const handleDrawerOpen = () => {
  //   setOpen(true);
  // };

  // const handleDrawerClose = () => {
  //   setOpen(false);
  // };

  return (
    <RootStyle>
      <MHidden width="lgUp">
        <Drawer
          open={activeDrawer}
          onClose={handleActiveDrawer}
          PaperProps={{
            sx: { width: drawerWidth, bgcolor: 'background.default' }
          }}
        >
          <SideBarContent loadingLogo={isLogoLoading} logo={logo} auth={undefined} activeDrawer={activeDrawer} />
        </Drawer>
      </MHidden>
      <MHidden width="lgDown">
        <CustomDrawer variant="permanent" open={activeDrawer}>
          <DrawerHeader>
            <IconButton onClick={handleActiveDrawer}>
              {!activeDrawer ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
          <SideBarContent
            loadingLogo={isLogoLoading}
            logo={logo}
            auth={undefined}
            setTitulo={setTitulo}
            activeDrawer={activeDrawer}
          />
        </CustomDrawer>
      </MHidden>
    </RootStyle>
  );
};

CustomSideBar.defaultProps = {
  activeDrawer: false,
  drawerWidth: 280
};

export default React.memo(CustomSideBar);
