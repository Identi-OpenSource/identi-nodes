import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '~/ui/App/App';
import { I18nextProvider } from 'react-i18next';
import i18next from './translations';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
      <App />
    </I18nextProvider>
  </React.StrictMode>
);
