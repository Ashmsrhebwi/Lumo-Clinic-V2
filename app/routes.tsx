import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { Root } from './Root';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PremiumLoader } from './components/ui/PremiumLoader';

// Lazy load the dashboard
const Dashboard = React.lazy(async () => ({ default: (await import('./pages/Dashboard')).Dashboard }));
const ArticleDetail = React.lazy(async () => ({ default: (await import('./pages/ArticleDetail')).ArticleDetail }));

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    HydrateFallback: PremiumLoader,
    children: [
      { index: true, lazy: async () => ({ Component: (await import('./pages/Home')).Home }) },
      { path: 'dental', element: <Navigate to="/" replace /> },
      { path: 'hair', element: <Navigate to="/" replace /> },
      { path: 'blog', lazy: async () => ({ Component: (await import('./pages/Articles')).Articles }) },
      { path: 'blog/:slug', element: <Suspense fallback={<div className="min-h-screen bg-[#F8F9FE]" />}><ArticleDetail /></Suspense> },
      { path: 'articles', element: <Navigate to="/blog" replace /> },
      { path: 'doctors', lazy: async () => ({ Component: (await import('./pages/Doctors')).Doctors }) },
      { path: 'appointment', lazy: async () => ({ Component: (await import('./pages/Booking')).Booking }) },
      { path: 'booking', element: <Navigate to="/appointment" replace /> },
      { path: 'contact', lazy: async () => ({ Component: (await import('./pages/Contact')).Contact }) },
      
      // Specialist Treatment Routes (Fixed Slug Mappings)
      { path: 'treatment/:slug', lazy: async () => ({ Component: (await import('./pages/TreatmentDetailPage')).TreatmentDetailPage }) },
      { path: 'treatments', element: <Navigate to="/#treatments" replace /> },
      { path: 'contact-us', element: <Navigate to="/contact" replace /> },
      { path: 'plastic-surgery', lazy: async () => ({ Component: (await import('./pages/PlasticSurgery')).PlasticSurgery }) },

      { path: 'hollywood-smile', element: <Navigate to="/treatment/hollywood-smile" replace /> },
      { path: 'hair/male', element: <Navigate to="/treatment/male-hair-transplant" replace /> },
      { path: 'hair/female', element: <Navigate to="/treatment/female-hair-transplant" replace /> },
      { path: 'hair/beard', element: <Navigate to="/treatment/beard-moustache-transplant" replace /> },
      { path: 'hair/eyebrow', element: <Navigate to="/treatment/eyebrow-transplant" replace /> },
      { path: 'login', lazy: async () => ({ Component: (await import('./pages/auth/Login')).Login }) },
      { path: 'otp', lazy: async () => ({ Component: (await import('./pages/auth/OTP')).OTP }) },
      { path: 'forgot-password', lazy: async () => ({ Component: (await import('./pages/auth/ForgotPassword')).ForgotPassword }) },
      { path: 'reset-password', lazy: async () => ({ Component: (await import('./pages/auth/ResetPassword')).ResetPassword }) },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PremiumLoader />}>
          <Dashboard />
        </Suspense>
      </ProtectedRoute>
    ),
  },
], {
  future: {
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  },
});
