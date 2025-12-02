import { useState } from 'react';
import { useTripsStore } from '../../store/useTripsStore';

interface Props {
  tripId: string;
  onClose: () => void;
}

export default function InviteUserModal({ tripId, onClose }: Props) {
  const { inviteUser } = useTripsStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    await inviteUser(tripId, email);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Запросити друга 🤝</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-xl">&times;</button>
        </div>
        
        <p className="text-sm text-gray-500 mb-6">
          Введіть email користувача. Він повинен бути вже зареєстрований у системі.
        </p>
        
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email друга</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg mb-6 focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="friend@gmail.com"
          />
          
          <div className="flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              Скасувати
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition shadow-md"
            >
              {loading ? 'Надсилаємо...' : 'Запросити'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}