import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import Button from '../ui/Button'; 

export default function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-20 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-800 flex items-center gap-2 hover:opacity-80 transition">
          ✈️ Travel Planner
        </Link>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:inline font-medium">
              {user.email}
            </span>
            <Button 
              variant="danger" 
              onClick={() => logout()}
              className="!py-1 !px-3 text-sm" 
            >
              Вийти
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}