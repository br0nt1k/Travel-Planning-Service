import { useState } from 'react';
import type { IPlace } from '../../types';
import { usePlacesStore } from '../../store/usePlacesStore';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface Props {
  place: IPlace;
  onClose: () => void;
}

export default function EditPlaceModal({ place, onClose }: Props) {
  const { updatePlace } = usePlacesStore();
  
  const [location, setLocation] = useState(place.locationName);
  const [day, setDay] = useState(place.dayNumber);
  const [notes, setNotes] = useState(place.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;

    setIsSubmitting(true);
    await updatePlace(place.tripId, place.id, {
      locationName: location,
      dayNumber: Number(day),
      notes: notes
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Редагувати місце ✏️</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="День" type="number" min="1" required 
            value={day} onChange={e => setDay(Number(e.target.value))}
          />
          <Input 
            label="Назва" required 
            value={location} onChange={e => setLocation(e.target.value)}
          />
          <Input 
            label="Нотатки" 
            value={notes} onChange={e => setNotes(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Скасувати
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Зберегти
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}