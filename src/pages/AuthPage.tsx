import type { ReactNode } from 'react';

interface AuthPageProps {
  children: ReactNode;
}

export default function AuthPage({ children }: AuthPageProps) {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop')" }}
      ></div>
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white tracking-wide drop-shadow-md">
            Travel Planner ✈️
          </h1>
          <p className="text-gray-200 mt-2 font-light">
            Плануй свої найкращі пригоди
          </p>
        </div>
        {children} 
      </div>
    </div>
  );
}