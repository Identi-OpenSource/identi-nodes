import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const VerifiableCredentialPage = lazy(() => import('../pages/VerifiableCredential'));
const Page404 = lazy(() => import('../pages/errors/404'));

const Router = () => {
  return (
    //   <Root>
    <Routes>
      <Route path="/verifiable_credentials" element={<VerifiableCredentialPage />} />

      <Route path="*" element={<Page404 />} />
    </Routes>
    //   </Root>
  );
};

export default React.memo(Router);
