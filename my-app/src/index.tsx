import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/store';
import { CssBaseline } from '@mui/material';
import './i18n';
import { AuthWrapper } from './common/AuthWrapper';
import { setupInterceptors } from './api/Api';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <CssBaseline>
        <AuthWrapper>
          <App />
        </AuthWrapper>
      </CssBaseline>
    </Provider>
  </React.StrictMode>
);

setupInterceptors(store);
