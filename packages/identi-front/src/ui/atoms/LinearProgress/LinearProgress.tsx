import React from 'react';
import MaterialLinearProgress from '@mui/material/LinearProgress';

type LinearProgressProps = {
  loading: boolean;
};

const LinearProgress: React.FC<LinearProgressProps> = (props: LinearProgressProps) => {
  
  const { loading } = props;

  return <>{loading && <MaterialLinearProgress sx={{
    backgroundColor: '#b2dfdb'
  }}  />}</>;
};

export default LinearProgress;
