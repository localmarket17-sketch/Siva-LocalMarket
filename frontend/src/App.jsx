import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { NotificationProvider } from './contexts/NotificationContext';

const App = () => {
  return (
    <NotificationProvider>
      <AppRoutes />
    </NotificationProvider>
  );
};

export default App;
