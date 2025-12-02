import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useAuthStore } from './store/useAuthStore';

import AuthPage from './pages/AuthPage';
import LoginForm from './components/auth/LoginPage';       
import RegisterForm from './components/auth/RegisterPage'; 
import MyTripsPage from './pages/MyTripsPage';             
import Spinner from './components/ui/Spinner';

function App() {
  const { user, setUser, isLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [setUser]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Spinner />
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={user ? <MyTripsPage /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/login" 
        element={
          !user ? (
            <AuthPage>
              <LoginForm />
            </AuthPage>
          ) : (
            <Navigate to="/" />
          )
        } 
      />
      <Route 
        path="/register" 
        element={
          !user ? (
            <AuthPage>
              <RegisterForm />
            </AuthPage>
          ) : (
            <Navigate to="/" />
          )
        } 
      />
    </Routes>
  );
}

export default App;