import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore'; 

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Вхід</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="example@mail.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition font-semibold"
        >
          {isLoading ? 'Входимо...' : 'Увійти'}
        </button>
      </form>

      <p className="text-center mt-6 text-sm text-gray-600">
        Ще не маєте акаунту?{' '}
        <Link to="/register" className="text-blue-600 font-semibold hover:underline">
          Зареєструватися
        </Link>
      </p>
    </div>
  );
}