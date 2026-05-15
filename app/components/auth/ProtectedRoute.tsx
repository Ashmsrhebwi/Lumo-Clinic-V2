import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #1E1C4B 0%, #12112e 50%, #1a1040 100%)' }}
      >
        {/* Ambient glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(242,133,34,0.07) 0%, transparent 70%)' }}
        />

        {/* Pulse rings */}
        <div className="absolute w-64 h-64 rounded-full border border-[#F28522]/15 animate-[ping_3.5s_ease-in-out_infinite]" />
        <div className="absolute w-48 h-48 rounded-full border border-[#F28522]/25 animate-[ping_2.8s_ease-in-out_infinite_0.4s]" />
        <div className="absolute w-36 h-36 rounded-full border border-[#F28522]/40 animate-[ping_2.2s_ease-in-out_infinite_0.8s]" />

        {/* Logo card */}
        <div
          className="relative z-10 w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-7 shadow-2xl"
          style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(242,133,34,0.25)',
            boxShadow: '0 0 36px rgba(242,133,34,0.12), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          <span className="text-2xl font-black tracking-tighter text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            LC
          </span>
        </div>

        {/* Text */}
        <p className="relative z-10 text-[10px] font-black tracking-[0.4em] uppercase text-white/25 mb-2">
          Lumo Clinic
        </p>
        <p className="relative z-10 text-sm font-medium text-white/40" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          Preparing your experience&hellip;
        </p>

        {/* Shimmer bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <div
            className="absolute inset-0 animate-[shimmer_1.8s_ease-in-out_infinite]"
            style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(242,133,34,0.8) 50%, transparent 100%)' }}
          />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
