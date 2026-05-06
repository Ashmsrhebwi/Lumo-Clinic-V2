import { RouterProvider } from 'react-router';
import { router } from './routes';
import { LanguageProvider } from './context/LanguageContext';
import { DashboardProvider } from './context/DashboardContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <DashboardProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" />
        </DashboardProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
