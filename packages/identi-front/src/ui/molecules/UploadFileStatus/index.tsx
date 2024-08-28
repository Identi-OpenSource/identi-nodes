import React, { useCallback } from 'react';
import { Box, Typography, Icon, IconButton, styled } from '@mui/material';
// import { createStyles, makeStyles } from '@mui/styles';
import UploadFile from './UploadFile';
import UploadImage from '~/ui/assets/img/Upload.png';

import { showMessage } from '~/utils/Messages';
import { Delete } from '@mui/icons-material';

// const useStyles = makeStyles(() =>
//   createStyles({
//     rotateIcon: {
//       animation: '$spin 2s linear infinite'
//     },
//     '@keyframes spin': {
//       '0%': {
//         transform: 'rotate(360deg)'
//       },
//       '100%': {
//         transform: 'rotate(0deg)'
//       }
//     }
//   })
// );

const RotateIcon = styled(Icon)(() => ({
  animation: '$spin 2s linear infinite',
  '@keyframes spin': {
    '0%': {
      transform: 'rotate(360deg)'
    },
    '100%': {
      transform: 'rotate(0deg)'
    }
  }
}));

type UploadFileStatusProps = {
  uploadFileStatus: 'PENDING' | 'UPLOADING' | 'SUCCESS' | 'FAILED';
  file: File | undefined;
  onDropFile: (file: File) => void;
  clearDocument?: () => void;
};

const UploadFileStatus: React.FC<UploadFileStatusProps> = (props: UploadFileStatusProps) => {
  const { uploadFileStatus, file: currentFile, onDropFile, clearDocument } = props;
  // const classes = useStyles();

  const handleDropFile = useCallback(
    (acceptedFiles: any) => {
      const file = acceptedFiles[0];
      if (file) {
        if (file.size >= 2.5e7) {
          showMessage('', 'El archivo es muy pesado.', 'error', true);
          return;
        }
        onDropFile(file);
      }
    },
    [onDropFile]
  );

  switch (uploadFileStatus) {
    case 'PENDING':
      return (
        <>
          <UploadFile
            icon={<img src={UploadImage} alt="UploadImage" />}
            sx={{
              color: '#0B73DA',
              backgroundColor: '#CDE5FECC',
              p: 5,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              minHeight: '200px'
            }}
            // accept=".xlsx,.xls"
            onDrop={handleDropFile}
            caption={
              <>
                {currentFile === undefined ? (
                  <Box>
                    <Typography>Arrastra tu archivo aquí</Typography>
                    <Box>
                      o
                      <Typography my={1} display="inline" fontWeight={600}>
                        {' '}
                        selecciónalo desde tu computador.
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Typography display="inline">Archivo:</Typography>
                    <Typography display="inline" fontWeight={600}>
                      {' '}
                      {currentFile.name}
                    </Typography>
                  </Box>
                )}
              </>
            }
          />
        </>
      );
    case 'UPLOADING':
      return (
        <>
          <Box
            sx={{
              color: '#0B73DA',
              backgroundColor: '#CDE5FECC',
              p: 5,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              minHeight: '200px'
            }}
          >
            <RotateIcon sx={{ fontSize: '50px !important' }}>cached_rounded</RotateIcon>
            <Typography my={1}>Subiendo...</Typography>
            <Typography my={1} fontWeight={600}>
              {currentFile?.name}
            </Typography>
          </Box>
        </>
      );
    case 'SUCCESS':
      return (
        <>
          <Box
            sx={{
              borderRadius: 2,
              color: '#00822B',
              backgroundColor: '#D7F4E8',
              p: 5,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            <Icon sx={{ fontSize: '50px !important' }}>sentiment_satisfied_alt_rounded</Icon>
            <Typography my={1}>El archivo ha sido subido de forma exitosa</Typography>
            <Typography my={1} fontWeight={600}>
              {currentFile?.name}
            </Typography>
          </Box>
        </>
      );
    case 'FAILED':
      return (
        <>
          <UploadFile
            icon={<Icon sx={{ fontSize: '50px !important' }}>error_outline_rounded</Icon>}
            sx={{
              borderRadius: 2,
              color: '#D84D44',
              backgroundColor: '#FFE2E0',
              p: 5,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              minHeight: '200px'
            }}
            // accept=".xlsx,.xls"
            onDrop={handleDropFile}
            caption={
              <>
                {currentFile === undefined ? (
                  <Box>
                    <Typography my={1} textAlign="center">
                      Has ingresado un Excel de forma incorrecta, asegúrate de completar todos los campos.
                    </Typography>
                    <Box textAlign="center">
                      Arrastra tu archivo aquí
                      <Typography my={1} display="inline" fontWeight={600} textAlign="center">
                        {' '}
                        selecciónalo desde tu computador.
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Typography display="inline">Archivo:</Typography>
                    <Typography display="inline" fontWeight={600}>
                      {' '}
                      {currentFile.name}
                    </Typography>
                    {clearDocument && (
                      <>
                        <>hla</>{' '}
                        <IconButton color="error" onClick={clearDocument}>
                          <Delete />
                        </IconButton>
                      </>
                    )}
                  </Box>
                )}
              </>
            }
          />
        </>
      );
    default:
      return <></>;
  }
};

export default UploadFileStatus;
