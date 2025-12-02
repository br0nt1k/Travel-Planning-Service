import { useState } from 'react';
import { useTripsStore } from '../../store/useTripsStore';
import type { ITrip } from '../../types';
import { toast } from '../../utils/toast';
import Input from '../ui/Input';   
import Button from '../ui/Button'; 

interface ModalProps {
  trip: ITrip;
  onClose: () => void;
}

export default function EditTripModal({ trip, onClose }: ModalProps) {
  const { updateTrip } = useTripsStore();

  const [title, setTitle] = useState(trip.title);
  const [description, setDescription] = useState(trip.description || '');
  const [startDate, setStartDate] = useState(trip.startDate || '');
  const [endDate, setEndDate] = useState(trip.endDate || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      toast.warning("Дата початку не може бути пізніше дати завершення!");
      return;
    }

    setIsSubmitting(true);
    await updateTrip(trip.id, { title, description, startDate, endDate });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">Редагувати подорож ✏️</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input 
            label="Назва" 
            required 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Опис</label>
            <textarea 
              rows={3}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Початок" 
              type="date" 
              value={startDate} 
              onChange={e => setStartDate(e.target.value)} 
            />
            <Input 
              label="Кінець" 
              type="date" 
              min={startDate}
              value={endDate} 
              onChange={e => setEndDate(e.target.value)} 
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="ghost" onClick={onClose}>
              Скасувати
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Зберегти зміни
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}