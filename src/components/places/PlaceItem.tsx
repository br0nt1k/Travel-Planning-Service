import { useState } from 'react'; 
import type { IPlace } from '../../types';
import { usePlacesStore } from '../../store/usePlacesStore';
import { confirmAction } from '../../utils/toast';
import EditPlaceModal from './EditPlaceModal'; 

interface Props {
  place: IPlace;
}

export default function PlaceItem({ place }: Props) {
  const { toggleVisited, deletePlace } = usePlacesStore();
  const [isEditOpen, setIsEditOpen] = useState(false); 

  const handleDelete = () => {
    confirmAction(
      `Видалити "${place.locationName}"?`,
      () => deletePlace(place.tripId, place.id),
      'Видалення місця'
    );
  };

  return (
    <>
      <div className={`
        flex items-start justify-between p-4 bg-white rounded-lg border transition-all duration-300
        ${place.isVisited ? 'border-green-200 bg-green-50/50' : 'border-gray-100 shadow-sm hover:shadow-md'}
      `}>
        <div className="flex items-start gap-3">
          <button
            onClick={() => toggleVisited(place.tripId, place.id, place.isVisited)}
            className={`
              mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors
              ${place.isVisited ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-blue-500'}
            `}
          >
            {place.isVisited && (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            )}
          </button>

          <div>
            <h4 className={`font-semibold text-gray-800 ${place.isVisited ? 'line-through text-gray-400' : ''}`}>
              {place.locationName}
            </h4>
            {place.notes && (
              <p className="text-sm text-gray-500 mt-1">{place.notes}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsEditOpen(true)}
            className="text-gray-300 hover:text-blue-500 transition p-1"
            title="Редагувати"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
          </button>
          <button 
            onClick={handleDelete}
            className="text-gray-300 hover:text-red-500 transition p-1"
            title="Видалити"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
          </button>
        </div>
      </div>
      {isEditOpen && (
        <EditPlaceModal place={place} onClose={() => setIsEditOpen(false)} />
      )}
    </>
  );
}