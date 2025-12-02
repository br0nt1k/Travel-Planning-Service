import { useMemo } from 'react';
import type { IPlace } from '../../types';
import PlaceItem from './PlaceItem';

interface Props {
  places: IPlace[];
}

export default function PlacesList({ places }: Props) {
  const placesByDay = useMemo(() => {
    const grouped: Record<number, IPlace[]> = {};
    places.forEach(place => {
      if (!grouped[place.dayNumber]) {
        grouped[place.dayNumber] = [];
      }
      grouped[place.dayNumber].push(place);
    });
    return grouped;
  }, [places]);

  if (places.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
        <p>Поки що пусто. Додайте перше місце!</p>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      {Object.keys(placesByDay)
        .sort((a, b) => Number(a) - Number(b)) 
        .map((dayNum) => (
          <div key={dayNum} className="animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2 flex items-center gap-2">
              <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-sm">
                День {dayNum}
              </span>
            </h3>
            <div className="space-y-3">
              {placesByDay[Number(dayNum)].map(place => (
                <PlaceItem key={place.id} place={place} />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}