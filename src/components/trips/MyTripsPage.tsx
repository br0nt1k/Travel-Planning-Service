import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useTripsStore } from '../../store/useTripsStore';
import TripCard from '../../components/trips/TripCard';
import CreateTripModal from '../../components/trips/CreateTripModal';
import Spinner from '../../components/ui/Spinner';

export default function MyTripsPage() {
  const { user, logout } = useAuthStore();
  const { trips, fetchTrips, isLoading } = useTripsStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTrips(user.uid);
    }
  }, [user, fetchTrips]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            ✈️ Travel Planner
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:inline">{user?.email}</span>
            <button 
              onClick={() => logout()} 
              className="text-red-500 hover:text-red-700 font-medium text-sm border border-red-200 px-3 py-1 rounded hover:bg-red-50 transition"
            >
              Вийти
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Мої Подорожі</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Нова подорож
          </button>
        </div>

        {isLoading ? (
          <Spinner />
        ) : trips.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg mb-2">У вас ще немає подорожей 😢</p>
            <p className="text-gray-400 text-sm">Натисніть кнопку зверху, щоб створити першу!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map(trip => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </main>

      {isModalOpen && (
        <CreateTripModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}