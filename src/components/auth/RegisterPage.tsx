import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import Input from '../ui/Input';  
import Button from '../ui/Button'; 

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(email, password);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Реєстрація</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input 
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@mail.com"
        />
        
        <Input 
          label="Пароль"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Мінімум 6 символів"
        />

        <Button type="submit" isLoading={isLoading} className="w-full">
          Зареєструватися
        </Button>
      </form>

      <p className="text-center mt-6 text-sm text-gray-600">
        Вже є акаунт?{' '}
        <Link to="/login" className="text-blue-600 font-semibold hover:underline">
          Увійти
        </Link>
      </p>
    </div>
  );
}