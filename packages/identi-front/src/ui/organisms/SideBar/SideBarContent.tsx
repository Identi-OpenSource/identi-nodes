import React from 'react';
import { Box, Skeleton } from '@mui/material';
import Scrollbar from '~/ui/atoms/Scrollbar/Scrollbar';
import NavSection from '~/ui/molecules/NavSection/NavSection';
// import { MAvatar } from '~ui/components/@material-extend';
// import Skeleton from '@mui/lab/Skeleton';
// import { experimentalStyled as styled } from '@mui/material/styles';
import { getPaths } from '~/routes/paths';
// import PerhusaLogo from '~assets/img/perhusa_logo_2.svg';

type SideBarContentProps = {
  loadingLogo: boolean;
  // classes: any;
  logo: any;
  auth: any;
  setTitulo?: any;
  activeDrawer: boolean;
};

// const AccountStyle = styled('div')(({ theme }: any) => ({
//   display: 'flex',
//   alignItems: 'center',
//   padding: theme.spacing(2, 2.5),
//   borderRadius: '12px',
//   backgroundColor: theme.palette.grey[500_12]
// }));

const SideBarContent: React.FC<SideBarContentProps> = (props: SideBarContentProps) => {
  const { loadingLogo, logo, setTitulo, activeDrawer }: SideBarContentProps = props;
  return (
    <Scrollbar
      sx={
        activeDrawer
          ? {
              height: '100%',
              '& .simplebar-content': { height: '100%', display: 'flex', flexDirection: 'column' }
            }
          : {
              height: '100%',
              '& .simplebar-content': { height: '100%', display: 'flex', flexDirection: 'column' },
              '& .simplebar-content-wrapper': { overflow: 'hidden !important' }
            }
      }
    >
      {activeDrawer && (
        <Box sx={{ px: 2.5, py: 3 }}>
          {loadingLogo ? (
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                padding: '10px 8px'
              }}
            >
              <Skeleton animation="wave" variant="circular" width={70} height={70} />
              <Skeleton animation="wave" variant="text" width="80%" />
              <Skeleton animation="wave" variant="text" width={120} />
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                padding: '10px 8px',
                flexDirection: 'row',
                justifyContent: 'center'
              }}
            >
              <img
                src={logo}
                alt="organization_logo"
                style={{
                  height: '86px',
                  width: 'auto'
                }}
              />
            </div>
          )}
        </Box>
      )}
      {/* <Box>
        <AccountStyle>
          <MAvatar src="user" alt="user" color={'default'}>
            <Box width={'100%'} height={'100%'} display={'flex'}>
              <img
                src={logo}
                alt="agros"
                // style={{
                //   height: '80px',
                //   width: 'auto'
                // }}
              />
            </Box>
          </MAvatar>
          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
              {auth?.user?.payload?.name} {auth?.user?.payload?.family_name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Administrador
            </Typography>
          </Box>
        </AccountStyle>
      </Box> */}
      <NavSection navConfig={getPaths(false, '')} setTitulo={setTitulo} activeDrawer={activeDrawer} />
    </Scrollbar>
  );
};

export default React.memo(SideBarContent);
