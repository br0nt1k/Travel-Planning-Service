import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useAuthStore } from './store/useAuthStore';
import AuthPage from './pages/AuthPage';
import LoginForm from './components/auth/LoginPage';
import RegisterForm from './components/auth/RegisterPage';

// Тимчасова заглушка для головної
const Dashboard = () => (
  <div className="p-10">
    <h1 className="text-2xl font-bold">Головна сторінка</h1>
    <button onClick={() => useAuthStore.getState().logout()} className="bg-red-500 text-white px-3 py-1 mt-4 rounded">Вихід</button>
  </div>
);

function App() {
  const { user, setUser, isLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [setUser]);

  if (isLoading) return <div className="flex h-screen items-center justify-center">Завантаження...</div>;

  return (
    <Routes>
      <Route 
        path="/" 
        element={user ? <Dashboard /> : <Navigate to="/login" />} 
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