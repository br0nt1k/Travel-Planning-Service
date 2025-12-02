import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { ITrip } from '../types/index';
import { toast } from '../utils/toast';

interface TripsState {
  trips: ITrip[];
  isLoading: boolean;
  
  fetchTrips: (userId: string) => Promise<void>;
  addTrip: (trip: Omit<ITrip, 'id' | 'ownerId' | 'collaborators'>, userId: string) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
}

export const useTripsStore = create<TripsState>((set) => ({
  trips: [],
  isLoading: false,

  fetchTrips: async (userId) => {
    set({ isLoading: true });
    try {
      const q = query(collection(db, "trips"), where("ownerId", "==", userId));
      
      const querySnapshot = await getDocs(q);
      const loadedTrips = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ITrip[];

      set({ trips: loadedTrips });
    } catch (error) {
      console.error(error);
      toast.error("Не вдалося завантажити список подорожей");
    } finally {
      set({ isLoading: false });
    }
  },

  addTrip: async (tripData, userId) => {
    set({ isLoading: true });
    try {
      const newTrip = {
        ...tripData,
        ownerId: userId,
        collaborators: [],
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, "trips"), newTrip);
      const createdTrip: ITrip = { id: docRef.id, ...newTrip };
      
      set((state) => ({ 
        trips: [...state.trips, createdTrip] 
      }));
      
      toast.success("Подорож успішно створено!");
    } catch (error) {
      console.error(error);
      toast.error("Помилка при створенні подорожі");
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTrip: async (id) => {
    try {
      await deleteDoc(doc(db, "trips", id));
      set((state) => ({
        trips: state.trips.filter((t) => t.id !== id)
      }));
      
      toast.info("Подорож видалено");
    } catch (error) {
      console.error(error);
      toast.error("Не вдалося видалити подорож");
    }
  }
}));