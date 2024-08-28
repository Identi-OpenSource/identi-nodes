import React, { useCallback } from 'react';
import { CardContent, Card, Typography, Box, Chip, CircularProgress, Icon } from '@mui/material';
import axios from 'axios';
import LogoIdenti from '~/ui/assets/img/logo_identi_white.svg';
import CIMMYTIdenti from '~/ui/assets/img/cimmyt_logo.svg';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { capitalizeAllWords } from '~/utils/Word';
import Button from '~/ui/atoms/Button/Button';
import { HOST_API } from '~/config/environment';

type VerifiableCredentialCardProps = {
  accessKey?: string | null;
  logo?: string | null;
  verifiableCredential: {
    hash: string;
    verifiableCredential: any;
  };
};

const VerifiableCredentialCard: React.FC<VerifiableCredentialCardProps> = (props: VerifiableCredentialCardProps) => {
  const { verifiableCredential, accessKey, logo } = props;
  const [verifyVC, setIsVerifyVC] = React.useState<'pending' | 'loading' | 'verified' | 'not_verified'>('pending');

  const _verifyCredential = useCallback(
    async (verifiableCredential: any) => {
      setIsVerifyVC('loading');
      axios
        .post(
          '/did/verifiable_credentials/verify',
          {
            credential: verifiableCredential
          },
          {
            baseURL: HOST_API,
            headers: { Authorization: 'Identi' + ' ' + accessKey }
          }
        )
        .then((response) => {
          if (response.data.verified) {
            setIsVerifyVC('verified');
            return;
          }
          setIsVerifyVC('not_verified');
        })
        .catch(() => {
          setIsVerifyVC('not_verified');
        });
    },
    [accessKey]
  );

  const formatType = useCallback((value: string) => {
    return value
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .toLowerCase()
      .replace(/ /g, ' ');
  }, []);

  const renderValue = useCallback((key: any, value: any): any => {
    if (String(value).startsWith('http://') || String(value).startsWith('https://')) {
      return (
        <Typography style={{ wordWrap: 'break-word', display: 'flex' }}>
          <strong>{key}:</strong>
          <a
            target="_blank"
            href={String(value)}
            rel="noopener noreferrer"
            style={{
              marginLeft: '5px',
              marginTop: '0',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              color: '#7676c5',
              backgroundColor: 'white',
              padding: '0px 2px',
              borderRadius: '10px',
              width: '115px',
              justifyContent: 'center'
            }}
          >
            <Icon>visibility</Icon>
            Ir
          </a>
        </Typography>
      );
    }
    return (
      <Typography style={{ wordWrap: 'break-word', marginBottom: '10px' }}>
        <strong>{key}:</strong> {value}
      </Typography>
    );
  }, []);

  return (
    <>
      <Card
        style={{
          borderRadius: '10px',
          background: 'linear-gradient(90.39deg, #09304F 0.34%, #054A81 99.69%)',
          padding: '30px 10px',
          color: 'white',
          position: 'relative'
        }}
      >
        <CardContent>
          {logo === 'CIMMYT' ? (
            <img src={CIMMYTIdenti} width="90%" alt="CIMMYT" style={{ marginBottom: '20px' }} />
          ) : (
            <img src={LogoIdenti} alt="Identi" style={{ marginBottom: '20px' }} />
          )}

          <Typography variant="body1" fontWeight={600} pb={3}>
            Tipo: {formatType(verifiableCredential.verifiableCredential.type[1])}
          </Typography>

          {Object.entries(verifiableCredential.verifiableCredential.credentialSubject).map(([key, value], index) => {
            if (key === 'id') return;
            return (
              <Box width="100%" mb="5px" key={`attribute_${index}`}>
                {renderValue(key, String(value) ?? '')}
              </Box>
            );
          })}
          <Typography variant="body1" fontWeight={600} pt={3} pb={2}>
            Fecha de emisión:{' '}
            {capitalizeAllWords(
              format(new Date(verifiableCredential.verifiableCredential.issuanceDate), 'dd MMMM yyyy', { locale: es })
            )}
          </Typography>
        </CardContent>

        <Box style={{ position: 'absolute', top: 10, right: '20px', zIndex: 2 }}>
          {verifyVC === 'pending' && <Chip label="Sin verificar" style={{ color: 'white', background: 'grey' }} />}
          {verifyVC === 'loading' && (
            <Chip label="Verificando..." color="warning" icon={<CircularProgress size={20} />} />
          )}
          {verifyVC === 'verified' && <Chip label="Verificado" color="secondary" icon={<Icon>check_circle</Icon>} />}

          {verifyVC === 'not_verified' && <Chip label="No verificado" color="error" icon={<Icon>error</Icon>} />}
        </Box>

        <Box style={{ position: 'absolute', top: 0, right: '0px', zIndex: 1, opacity: 0.8, height: '100%' }}>
          <Box style={{ height: '100%' }}>
            <svg width="195" height="100%" viewBox="0 0 195 389" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                opacity="0.6"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M309.123 11.2734L203.097 259.724C197.133 273.7 178.217 275.99 169.041 263.847L6.05798 48.1545C-3.11772 36.0114 4.3249 18.5374 19.4575 16.6947L288.466 -16.0633C303.611 -17.9075 315.092 -2.71398 309.123 11.2734ZM288.216 -18.0904C304.927 -20.1254 317.596 -3.36017 311.009 12.0742L204.983 260.525C198.402 275.947 177.529 278.474 167.404 265.075L4.42115 49.3819C-5.70376 35.9825 2.50878 16.7009 19.2069 14.6675L288.216 -18.0904ZM166.499 321.379L140.374 380.819C137.634 387.055 129.144 387.991 125.089 382.503L86.476 330.246C82.4215 324.759 85.8414 316.962 92.6332 316.208L157.371 309.026C164.169 308.272 169.242 315.138 166.499 321.379ZM157.142 306.996C165.508 306.068 171.752 314.518 168.376 322.2L142.252 381.64C138.879 389.315 128.43 390.467 123.439 383.713L84.8261 331.456C79.836 324.702 84.045 315.106 92.4042 314.179L157.142 306.996Z"
                fill="#2F95E7"
              />
            </svg>
          </Box>
        </Box>
        <Box>
          <Typography pl={2} style={{ wordWrap: 'break-word' }}>
            <strong>Hash:</strong> {verifiableCredential.hash}
          </Typography>
        </Box>
      </Card>
      <Box display="flex" justifyContent="center">
        <Button
          text="Verificar"
          variant="contained"
          color="primary"
          isLoading={verifyVC === 'loading'}
          disabled={verifyVC === 'loading' || verifyVC === 'verified'}
          onClick={() => _verifyCredential(verifiableCredential.verifiableCredential)}
        ></Button>
      </Box>
    </>
  );
};

export default VerifiableCredentialCard;
