import React, { useState, useCallback } from 'react';
import { Container } from '@mui/material';
import ThemeConfig from '~/ui/themes';
import Header from '~/ui/organisms/Header/Header';
import SideBar from '~/ui/organisms/SideBar/SideBar';
import { experimentalStyled as styled } from '@mui/material/styles';
import ScrollToTop from '~/ui/atoms/ScrollToTop/ScrollToTop';
import { routes } from '~/routes/_nav';
import '~/ui/assets/scss/app.scss';
// import '../../../i18next';

// import { useSnackbar } from 'notistack';
// import { getUserData } from '~services/user';
// import { COMMUNITY_BASE_URL_S3 } from '~config/environment';
import LogoOrganizationDefault from '~/ui/assets/img/perhusa_logo_4.png';
// import cover from '~/assets/img/farmer_banner.png';
// import { getRoles } from '~roles/roles';

export type Props = {
  children?: React.ReactNode;
};

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

// eslint-disable-next-line @typescript-eslint/typedef
const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  backgroundColor: '#FAFAFA',
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

// const defaultOrganizationTheme: any = {
//   initial_gps: [-5.197188653750377, -80.62666654586792],
//   farmers_profile_path_logo: cover
// };

const CompLayout: React.FC<Props> = (props: any) => {
  // const { enqueueSnackbar } = useSnackbar();
  const [activeDrawer, setActiveDrawer] = useState<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isUserDataLoading, setIsUserDataLoading] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [logo, setLogo] = useState<any>(LogoOrganizationDefault);
  const [titulo, setTitulo] = useState('');

  const handleActiveDrawer = useCallback(() => {
    setActiveDrawer((prevValue: any) => !prevValue);
  }, [setActiveDrawer]);

  // const alertMessage = useCallback(
  //   (message: string = 'Error', type: any = 'warning', duration: number = 3000) => {
  //     return enqueueSnackbar(message, {
  //       autoHideDuration: duration,
  //       variant: type,
  //       anchorOrigin: {
  //         vertical: 'top',
  //         horizontal: 'right'
  //       }
  //     });
  //   },
  //   [enqueueSnackbar]
  // );

  // const getLatLong = useCallback((center_point_str?: string) => {
  //   if (!center_point_str) {
  //     return defaultOrganizationTheme?.initial_gps;
  //   }
  //   const center_point = center_point_str.split(' ');
  //   const lat = parseFloat(center_point[1]);
  //   const long = parseFloat(center_point[0]);
  //   return [lat, long];
  // }, []);

  // useEffect(() => {
  //   getUserData()
  //     .then(async (res: any) => {
  //       const data = res?.data?.data;
  //       if (data?.organizations?.length !== 0) {
  //         const newTheme: any = {};
  //         const organization = data?.organizations[0]?.organization;
  //         newTheme['organizationId'] = organization?.id;
  //         newTheme['role'] = data?.role ?? 'ADMIN';
  //         newTheme['scope'] = getRoles(data?.role ?? 'ADMIN');
  //         if (organization?.parent_organization) {
  //           newTheme['parentOrganization'] = organization?.parent_organization;
  //         }
  //         if (
  //           organization?.logo_path !== null &&
  //           organization?.logo_path !== '' &&
  //           organization?.logo_path !== undefined
  //         ) {
  //           setLogo(COMMUNITY_BASE_URL_S3 + organization?.logo_path);
  //           newTheme['organizationLogo'] = COMMUNITY_BASE_URL_S3 + organization?.logo_path;
  //         } else {
  //           setLogo(LogoPerhusaDefault);
  //           newTheme['organizationLogo'] = LogoPerhusaDefault;
  //         }

  //         newTheme['organizationName'] = organization?.hasOwnProperty('name') ? organization?.name : '';
  //         const theme = organization?.theme;

  //         newTheme['initial_gps'] = getLatLong(organization?.department?.center_point_str ?? null);

  //         newTheme['farmers_profile_path_logo'] = theme?.hasOwnProperty('farmers_profile_path_logo')
  //           ? COMMUNITY_BASE_URL_S3 + theme?.farmers_profile_path_logo
  //           : defaultOrganizationTheme?.farmers_profile_path_logo;
  //         dispatch(updateTheme(newTheme));
  //         setIsUserDataLoading(false);
  //         return;
  //       }

  //       alertMessage('Problemas al cargar los datos del usuario.');
  //       dispatch(forceLogOut());
  //     })
  //     .catch(() => {
  //       alertMessage('Problemas al cargar los datos del usuario.');
  //       dispatch(forceLogOut());
  //     });
  // }, [alertMessage, dispatch, getLatLong]);

  if (isUserDataLoading) {
    return (
      <div className="load">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <ThemeConfig>
      <ScrollToTop />
      <RootStyle>
        <Header activeDrawer={activeDrawer} handleActiveDrawer={handleActiveDrawer} titulo={titulo} />
        <SideBar
          activeDrawer={activeDrawer}
          routes={routes}
          handleActiveDrawer={handleActiveDrawer}
          isLogoLoading={isUserDataLoading}
          logo={logo}
          setTitulo={setTitulo}
        />
        <MainStyle>
          <Container maxWidth="xl">{props.children}</Container>
        </MainStyle>
        {/* <Footer /> */}
      </RootStyle>
    </ThemeConfig>
  );
};

export const Layout = React.memo(CompLayout);
