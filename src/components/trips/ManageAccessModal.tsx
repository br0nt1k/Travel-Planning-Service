import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useTripsStore } from '../../store/useTripsStore';
import type { ITrip } from '../../types';
import { confirmAction } from '../../utils/toast';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import Card from '../ui/Card'; 

interface Props {
  trip: ITrip;
  onClose: () => void;
}

interface CollaboratorInfo {
  uid: string;
  email: string;
}

export default function ManageAccessModal({ trip, onClose }: Props) {
  const { revokeAccess, fetchTrips } = useTripsStore();
  const [collaborators, setCollaborators] = useState<CollaboratorInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!trip.collaborators || trip.collaborators.length === 0) {
        setCollaborators([]);
        setLoading(false);
        return;
      }

      try {
        const usersData: CollaboratorInfo[] = [];
        for (const uid of trip.collaborators) {
          const userSnap = await getDoc(doc(db, "users", uid));
          if (userSnap.exists()) {
            usersData.push(userSnap.data() as CollaboratorInfo);
          } else {
            usersData.push({ uid, email: 'Невідомий користувач' });
          }
        }
        setCollaborators(usersData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [trip.collaborators]);

  const handleRemove = (uid: string, email: string) => {
    confirmAction(
      `Забрати доступ у ${email}?`,
      async () => {
        await revokeAccess(trip.id, uid);
        setCollaborators(prev => prev.filter(c => c.uid !== uid));
        fetchTrips(trip.ownerId); 
      },
      "Скасування доступу"
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <Card className="w-full max-w-md shadow-2xl" padding={false}>
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">Учасники подорожі 👥</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6">
          {loading ? (
            <Spinner />
          ) : collaborators.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <p>У цій подорожі немає інших учасників.</p>
              <p className="text-sm mt-2">Ви можете запросити їх через кнопку "Запросити".</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {collaborators.map(user => (
                <li key={user.uid} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex-shrink-0 flex items-center justify-center font-bold text-sm">
                      {user.email[0].toUpperCase()}
                    </div>
                    <span className="text-gray-700 font-medium text-sm truncate">
                      {user.email}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => handleRemove(user.uid, user.email)}
                    className="text-red-500 hover:text-red-700 text-xs font-bold border border-red-200 hover:bg-red-50 px-2 py-1 rounded transition ml-2"
                  >
                    Видалити
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 flex justify-end">
            <Button variant="secondary" onClick={onClose}>
              Закрити
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}