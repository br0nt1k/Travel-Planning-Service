import { useState } from 'react';
import { usePlacesStore } from '../../store/usePlacesStore';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card'; 

interface Props {
  tripId: string;
}

export default function AddPlaceForm({ tripId }: Props) {
  const { addPlace } = usePlacesStore();
  
  const [location, setLocation] = useState('');
  const [day, setDay] = useState(1);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;

    setIsSubmitting(true);
    await addPlace(tripId, {
      locationName: location,
      dayNumber: Number(day),
      notes: notes,
      isVisited: false
    });
    
    setLocation('');
    setNotes('');
    setIsSubmitting(false);
  };

  return (
    <Card className="mb-8 border-blue-100">
      <form onSubmit={handleSubmit}>
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          📍 Додати нове місце
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-2">
            <Input 
              type="number" min="1" required placeholder="День"
              value={day} onChange={e => setDay(Number(e.target.value))}
            />
          </div>
          <div className="md:col-span-5">
            <Input 
              required placeholder="Назва місця..."
              value={location} onChange={e => setLocation(e.target.value)}
            />
          </div>
          <div className="md:col-span-3">
            <Input 
              placeholder="Нотатка..."
              value={notes} onChange={e => setNotes(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" isLoading={isSubmitting} className="w-full">
              Додати
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}