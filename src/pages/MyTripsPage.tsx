import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useTripsStore } from '../store/useTripsStore';
import { useInvitationsStore } from '../store/useInvitationsStore';
import type { IInvitation } from '../types';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card'; 
import TripCard from '../components/trips/TripCard';
import CreateTripModal from '../components/trips/CreateTripModal';
import Spinner from '../components/ui/Spinner';

export default function MyTripsPage() {
  const { user } = useAuthStore();
  const { trips, fetchTrips, isLoading } = useTripsStore();
  const { invitations, fetchInvitations, acceptInvitation, rejectInvitation } = useInvitationsStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      fetchTrips(user.uid);
      fetchInvitations(user.uid);
    }
  }, [user, fetchTrips, fetchInvitations]);

  const handleAccept = async (invite: IInvitation) => {
    if (!user) return;
    await acceptInvitation(invite, user.uid);
    fetchTrips(user.uid);
  };

  return (
    <Layout>
      {invitations.length > 0 && (
        <div className="mb-8 animate-fadeIn">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            📩 Вхідні запрошення
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{invitations.length}</span>
          </h3>
          <div className="grid gap-3">
            {invitations.map(invite => (
              <Card key={invite.id} className="border-blue-200 flex flex-col sm:flex-row justify-between items-center gap-4" padding={true}>
                <div>
                  <p className="text-gray-800 font-medium">
                    <span className="font-bold text-blue-600">{invite.senderEmail}</span> запрошує вас у подорож:
                  </p>
                  <p className="text-xl font-bold text-gray-900">"{invite.tripTitle}"</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => rejectInvitation(invite.id)} className="text-sm py-1">
                    Відхилити
                  </Button>
                  <Button onClick={() => handleAccept(invite)} className="text-sm py-1">
                    Прийняти
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-gray-900">Мої Подорожі</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Нова подорож
        </Button>
      </div>
      {isLoading ? (
        <Spinner />
      ) : trips.length === 0 ? (
        <Card className="text-center py-20 border-2 border-dashed border-gray-300 shadow-none">
          <div className="text-6xl mb-4">🌍</div>
          <p className="text-gray-500 text-lg mb-6">У вас ще немає планів</p>
          <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
            Створити першу подорож
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}

      {isModalOpen && <CreateTripModal onClose={() => setIsModalOpen(false)} />}
    </Layout>
  );
}