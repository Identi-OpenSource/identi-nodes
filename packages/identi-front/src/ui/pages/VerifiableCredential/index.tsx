import React, { useCallback, useEffect } from 'react';
import axios from 'axios';
// import LogoIdenti from '~/ui/assets/img/logo_identi.png';
import { useLocation } from 'react-router-dom';
import ThemeConfig from '~/ui/themes';
import LinearProgress from '~/ui/atoms/LinearProgress/LinearProgress';
import VerifiableCredentialCard from './VerifiableCredentialCard';
import { Grid, Container } from '@mui/material';
import Header from '~/ui/organisms/Header/Header';
import { HOST_API } from '~/config/environment';

const VerifiableCredential: React.FC<any> = () => {
  const accessKey = new URLSearchParams(useLocation().search).get('accessKey');
  const logo = new URLSearchParams(useLocation().search).get('logo');
  const [vc, setVc] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const _getVerifiableCredentials = useCallback(async () => {
    axios
      .get('/did/verifiable_credentials/list_shared', {
        baseURL: HOST_API,
        headers: {
          Authorization: 'Identi' + ' ' + accessKey
        }
      })
      .then((response) => {
        setVc(response.data.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [accessKey]);

  const handleActiveDrawer = useCallback(() => {
    //
  }, []);

  useEffect(() => {
    _getVerifiableCredentials();
  }, [_getVerifiableCredentials]);

  return (
    <>
      <ThemeConfig>
        <Header activeDrawer={true} handleActiveDrawer={handleActiveDrawer} titulo="" />
        <Container maxWidth="xl" style={{ marginTop: '10px' }}>
          <LinearProgress loading={isLoading} />
          <Grid container spacing={2} pb={2}>
            {vc.map((verifiableCredential, index) => (
              <React.Fragment key={`vc_${index}`}>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <VerifiableCredentialCard
                    verifiableCredential={verifiableCredential}
                    accessKey={accessKey}
                    logo={logo}
                  />
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </Container>
        {/* <Box
          style={{ position: 'absolute', bottom: 0 }}
          display="flex"
          alignItems="center"
          justifyContent="end"
          width="100%"
        >
          <strong>Verificado por:</strong>
          <img src={LogoIdenti} alt="Logo identi" width="150px" />
        </Box> */}
      </ThemeConfig>
    </>
  );
};

export default VerifiableCredential;
