import { ArticleOutlined, CachedOutlined, Delete } from '@mui/icons-material';
import { Box, IconButton, Typography, Button as MatButton, CircularProgress } from '@mui/material';
import React from 'react';
import Button from '~/ui/atoms/Button/Button';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800]
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'
  }
}));

type FileProgressProps = {
  isInProgress: boolean;
  progress?: number;
  isLoading: boolean;
  totalRows?: number;
  nameFile: string;
  size_bytes: number;
  handleDelete: () => void;
  handleUpload: () => void;
  hasError?: boolean;
  handleDownloadErrors?: () => void;
  hasErrorFile?: boolean;
  handleDownloadErrorsFile?: () => void;
  isLoadingErrorsFile?: boolean;
  feedbackProgress?: React.ReactNode;
  errorText?: string;
};

const FileProgress: React.FC<FileProgressProps> = (props: FileProgressProps) => {
  const {
    isInProgress,
    progress,
    isLoading,
    nameFile,
    totalRows,
    size_bytes,
    errorText,
    handleDelete,
    handleUpload,
    hasError,
    hasErrorFile,
    handleDownloadErrors,
    handleDownloadErrorsFile,
    isLoadingErrorsFile,
    feedbackProgress
  } = props;
  const themes = useTheme();

  function parceTo100(val: number, min: number, max: number) {
    return ((val - min) / (max - min)) * 100;
  }

  const [progressL, setProgressL] = React.useState(0);
  React.useEffect(() => {
    if (progress && progress !== 0) {
      // console.log(parceTo100(progress, 0, 10));
      setProgressL(parceTo100(progress, 0, totalRows ?? 100));
    }
  }, [progress, totalRows]);

  return (
    <Box width={'100%'} height={'100%'} display={'flex'} flexDirection={'column'} justifyContent={'space-between'}>
      <Box display={'flex'} width={'100%'} alignItems={'center'} mt={4}>
        <Box px={2} display={{ xs: 'none', md: 'block' }}>
          <ArticleOutlined />
        </Box>
        <Box display={'flex'} px={2} justifyContent={'space-between'} width={'100%'}>
          <Box width={'90%'}>
            <Typography color={themes.palette.primary.main}>{nameFile ?? ''}</Typography>
            <BorderLinearProgress variant="determinate" value={progressL} />
            {hasError ? (
              <>
                <Typography color={themes.palette.error.main}>Ocurrió un problema al subir el archivo</Typography>
                {handleDownloadErrors && (
                  <Typography
                    color={themes.palette.error.main}
                    sx={{
                      textDecoration: 'underline',
                      '&:hover': {
                        cursor: 'pointer'
                      }
                    }}
                    onClick={handleDownloadErrors}
                  >
                    Descarga el detalle aquí
                  </Typography>
                )}
                {errorText && <Typography color={themes.palette.error.main}>{errorText ?? ''}</Typography>}
              </>
            ) : (
              <Typography color="#55A9EC">{(size_bytes / 1024).toFixed(1)} KB</Typography>
            )}
            {feedbackProgress}
          </Box>

          <Box>
            {hasError ? (
              <IconButton onClick={() => handleDelete()} color="error">
                <CachedOutlined />
              </IconButton>
            ) : (
              <IconButton onClick={() => handleDelete()} color="error">
                <Delete />
              </IconButton>
            )}
          </Box>
        </Box>
      </Box>
      <Box display={'flex'} width={'100%'} alignItems={'center'} justifyContent={'space-between'} mt={2}>
        {hasErrorFile && handleDownloadErrorsFile !== undefined ? (
          <MatButton
            variant="contained"
            // isLoading={isLoading}
            style={{ minWidth: '226px' }}
            color="error"
            onClick={() => {
              handleDownloadErrorsFile();
            }}
          >
            {isLoadingErrorsFile ? (
              <CircularProgress sx={{ width: '24px !important', height: '24px !important', color: 'white' }} />
            ) : (
              <>Descargar registros fallidos</>
            )}
          </MatButton>
        ) : (
          <Box></Box>
        )}
        <Button
          variant="contained"
          disabled={isLoading || isInProgress || hasError || hasErrorFile}
          isLoading={isInProgress}
          text="Guardar y continuar"
          onClick={handleUpload}
        />
      </Box>
    </Box>
  );
};

export default FileProgress;
