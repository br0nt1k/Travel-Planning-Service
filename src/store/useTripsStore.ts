import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc,
  doc, 
  query, 
  where, 
  arrayRemove,
  getDoc 
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import type { ITrip } from '../types';
import { toast } from '../utils/toast';

interface TripsState {
  trips: ITrip[];
  isLoading: boolean;
  
  fetchTrips: (userId: string) => Promise<void>;
  addTrip: (trip: Omit<ITrip, 'id' | 'ownerId' | 'collaborators'>, userId: string) => Promise<void>;
  updateTrip: (tripId: string, data: Partial<ITrip>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  inviteUser: (tripId: string, email: string) => Promise<void>;
  revokeAccess: (tripId: string, uidToRemove: string) => Promise<void>;
}

export const useTripsStore = create<TripsState>((set) => ({
  trips: [],
  isLoading: false,

  fetchTrips: async (userId) => {
    set({ isLoading: true });
    try {
      const qOwned = query(collection(db, "trips"), where("ownerId", "==", userId));
      const qShared = query(collection(db, "trips"), where("collaborators", "array-contains", userId));

      const [ownedSnap, sharedSnap] = await Promise.all([
        getDocs(qOwned),
        getDocs(qShared)
      ]);

      const ownedTrips = ownedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ITrip[];
      const sharedTrips = sharedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ITrip[];

      const allTrips = [...ownedTrips, ...sharedTrips];
      const uniqueTrips = Array.from(new Map(allTrips.map((item) => [item.id, item])).values());

      set({ trips: uniqueTrips });
    } catch (error) {
      console.error(error);
      toast.error("Не вдалося завантажити подорожі");
    } finally {
      set({ isLoading: false });
    }
  },

  addTrip: async (tripData, userId) => {
    set({ isLoading: true });
    try {
      const newTripData = {
        ...tripData,
        ownerId: userId,
        collaborators: [],
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, "trips"), newTripData);
      const newTrip: ITrip = { id: docRef.id, ...newTripData };
      
      set((state) => ({ 
        trips: [...state.trips, newTrip] 
      }));
      
      toast.success("Подорож створено!");
    } catch (error) {
      console.error(error);
      toast.error("Помилка при створенні");
    } finally {
      set({ isLoading: false });
    }
  },

  updateTrip: async (tripId, data) => {
    try {
      const tripRef = doc(db, "trips", tripId);
      await updateDoc(tripRef, data);

      set((state) => ({
        trips: state.trips.map((t) => (t.id === tripId ? { ...t, ...data } : t))
      }));

      toast.success("Зміни збережено!");
    } catch (error) {
      console.error(error);
      toast.error("Не вдалося оновити подорож");
    }
  },

  deleteTrip: async (id) => {
    try {
      await deleteDoc(doc(db, "trips", id));
      set((state) => ({
        trips: state.trips.filter(t => t.id !== id)
      }));
      toast.info("Подорож видалено");
    } catch (error) {
      console.error(error);
      toast.error("Не вдалося видалити");
    }
  },
  inviteUser: async (tripId, emailToInvite) => {
    try {
      const currentUserEmail = auth.currentUser?.email;
      if (currentUserEmail && currentUserEmail === emailToInvite) {
        toast.warning("Ви не можете запросити самого себе!");
        return;
      }
      const usersRef = collection(db, "users");
      const qUser = query(usersRef, where("email", "==", emailToInvite));
      const userSnapshot = await getDocs(qUser);

      if (userSnapshot.empty) {
        toast.warning("Користувача не знайдено! Попросіть його зареєструватися.");
        return;
      }

      const receiver = userSnapshot.docs[0].data();
      const tripRef = doc(db, "trips", tripId);
      const tripSnap = await getDoc(tripRef);
      
      if (tripSnap.exists()) {
        const tripData = tripSnap.data();
        if (tripData.collaborators?.includes(receiver.uid) || tripData.ownerId === receiver.uid) {
          toast.warning("Цей користувач вже є учасником подорожі!");
          return;
        }
      }
      const invitationsRef = collection(db, "invitations");
      const qInvite = query(
        invitationsRef, 
        where("tripId", "==", tripId),
        where("receiverUid", "==", receiver.uid)
      );
      const inviteSnap = await getDocs(qInvite);

      if (!inviteSnap.empty) {
        toast.warning("Запрошення цьому користувачу вже надіслано!");
        return;
      }
      await addDoc(collection(db, "invitations"), {
        tripId,
        tripTitle: tripSnap.data()?.title || "Подорож",
        senderEmail: currentUserEmail,
        receiverUid: receiver.uid,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      toast.success(`Запрошення для ${emailToInvite} надіслано!`);
    } catch (error) {
      console.error(error);
      toast.error("Не вдалося надіслати запрошення");
    }
  },

  revokeAccess: async (tripId, uidToRemove) => {
    try {
      const tripRef = doc(db, "trips", tripId);
      
      await updateDoc(tripRef, {
        collaborators: arrayRemove(uidToRemove)
      });

      set((state) => ({
        trips: state.trips.map(t => 
          t.id === tripId 
            ? { ...t, collaborators: t.collaborators.filter(uid => uid !== uidToRemove) }
            : t
        )
      }));

      toast.success("Доступ скасовано");
    } catch (error) {
      console.error(error);
      toast.error("Помилка при видаленні учасника");
    }
  }
}));