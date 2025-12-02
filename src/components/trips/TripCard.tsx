import { Link } from 'react-router-dom';
import type { ITrip } from '../../types';
import { useTripsStore } from '../../store/useTripsStore';
import { useAuthStore } from '../../store/useAuthStore';
import { confirmAction } from '../../utils/toast';
import { formatDate, getDuration } from '../../utils/dateHelpers'; 

interface TripCardProps {
  trip: ITrip;
}

export default function TripCard({ trip }: TripCardProps) {
  const { deleteTrip } = useTripsStore();
  const { user } = useAuthStore();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault(); 
    confirmAction(
      `Видалити подорож "${trip.title}"?`,
      () => deleteTrip(trip.id),
      'Видалення'
    );
  };

  const isOwner = user?.uid === trip.ownerId;

  return (
    <Link 
      to={`/trips/${trip.id}`} 
      className="block bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden group relative"
    >
      <div className="h-2 bg-gradient-to-r from-blue-400 to-purple-500" />
      
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition truncate pr-2">
            {trip.title}
          </h3>
          
          {isOwner ? (
            <button 
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-500 p-1 rounded transition z-10"
              title="Видалити"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          ) : (
            <span className="text-[10px] uppercase font-bold bg-purple-100 text-purple-600 px-2 py-1 rounded-full tracking-wider">
              Guest
            </span>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
          {trip.description || "Опис відсутній"}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500 font-medium bg-gray-50 p-2 rounded-lg">
          <div className="flex items-center">
            <svg className="mr-1.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {trip.startDate ? (
              <span>{formatDate(trip.startDate)} — {formatDate(trip.endDate)}</span>
            ) : (
              <span>Дати не вказано</span>
            )}
          </div>
          
          {trip.startDate && trip.endDate && (
             <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
               {getDuration(trip.startDate, trip.endDate)}
             </span>
          )}
        </div>
      </div>
    </Link>
  );
}