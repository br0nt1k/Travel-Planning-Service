import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTripsStore } from '../store/useTripsStore';
import { usePlacesStore } from '../store/usePlacesStore';
import { useAuthStore } from '../store/useAuthStore';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card'; 
import AddPlaceForm from '../components/places/AddPlaceForm';
import PlacesList from '../components/places/PlacesList'; 
import Spinner from '../components/ui/Spinner';
import InviteUserModal from '../components/trips/InviteUserModal';
import EditTripModal from '../components/trips/EditTripModal';
import ManageAccessModal from '../components/trips/ManageAccessModal';

export default function TripDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const { trips, fetchTrips } = useTripsStore();
  const { places, fetchPlaces, isLoading: placesLoading } = usePlacesStore();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAccessOpen, setIsAccessOpen] = useState(false);

  const trip = trips.find(t => t.id === id);
  const isOwner = user && trip && user.uid === trip.ownerId;
  useEffect(() => {
    if (user && trips.length === 0) fetchTrips(user.uid);
  }, [user, trips.length, fetchTrips]);
  useEffect(() => {
    if (id) fetchPlaces(id);
  }, [id, fetchPlaces]);

  if (!trip) return <div className="p-10"><Spinner /></div>;

  return (
    <Layout>
      <Link to="/" className="text-gray-500 hover:text-blue-600 text-sm mb-4 inline-block transition">
        ← Назад до списку
      </Link>
      <Card className="mb-8 border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">{trip.title}</h1>
              {isOwner && (
                <button 
                  onClick={() => setIsEditOpen(true)} 
                  className="text-gray-400 hover:text-blue-600 transition"
                  title="Редагувати"
                >
                  ✏️
                </button>
              )}
            </div>
            <p className="text-gray-600 mt-2">{trip.description || "Без опису"}</p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <span className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-medium">
              📅 {trip.startDate || "?"} — {trip.endDate || "?"}
            </span>
            {isOwner && (
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setIsAccessOpen(true)} className="!py-1 !text-sm">
                  👥 Учасники ({trip.collaborators?.length || 0})
                </Button>
                <Button variant="primary" onClick={() => setIsInviteOpen(true)} className="!py-1 !text-sm">
                  + Запросити
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
      <AddPlaceForm tripId={trip.id} />
      {placesLoading ? <Spinner /> : <PlacesList places={places} />}
      {isInviteOpen && <InviteUserModal tripId={trip.id} onClose={() => setIsInviteOpen(false)} />}
      {isEditOpen && <EditTripModal trip={trip} onClose={() => setIsEditOpen(false)} />}
      {isAccessOpen && <ManageAccessModal trip={trip} onClose={() => setIsAccessOpen(false)} />}
    </Layout>
  );
}