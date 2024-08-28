import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from '~/ui/atoms/ScrollToTop/ScrollToTop';
import { SnackbarProvider } from 'notistack';
import Router from './Router';
import './App.css';

const App: React.FC<any> = () => {
  return (
    <HelmetProvider>
      <BrowserRouter basename="/">
        <SnackbarProvider>
          <ScrollToTop />
          <Router />
        </SnackbarProvider>
        {/* <div>
        <Map />
      </div> */}
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default React.memo(App);
