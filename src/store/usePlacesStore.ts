import { create } from 'zustand';
import { 
  collection, addDoc, getDocs, deleteDoc, updateDoc, 
  doc, query, orderBy 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { IPlace } from '../types';
import { toast } from '../utils/toast';

interface PlacesState {
  places: IPlace[];
  isLoading: boolean;
  
  fetchPlaces: (tripId: string) => Promise<void>;
  addPlace: (tripId: string, place: Omit<IPlace, 'id' | 'tripId'>) => Promise<void>;
  updatePlace: (tripId: string, placeId: string, data: Partial<IPlace>) => Promise<void>; 
  deletePlace: (tripId: string, placeId: string) => Promise<void>;
  toggleVisited: (tripId: string, placeId: string, currentStatus: boolean) => Promise<void>;
}

export const usePlacesStore = create<PlacesState>((set) => ({
  places: [],
  isLoading: false,

  fetchPlaces: async (tripId) => {
    set({ isLoading: true });
    try {
      const q = query(collection(db, "trips", tripId, "places"), orderBy("dayNumber", "asc"));
      const snapshot = await getDocs(q);
      const loadedPlaces = snapshot.docs.map(doc => ({ id: doc.id, tripId, ...doc.data() })) as IPlace[];
      set({ places: loadedPlaces });
    } catch (error) {
      console.error(error);
      toast.error("Не вдалося завантажити місця");
    } finally {
      set({ isLoading: false });
    }
  },

  addPlace: async (tripId, placeData) => {
    try {
      const newPlaceData = { ...placeData, tripId };
      const docRef = await addDoc(collection(db, "trips", tripId, "places"), newPlaceData);
      const newPlace: IPlace = { id: docRef.id, ...newPlaceData } as IPlace;

      set(state => {
        const updatedPlaces = [...state.places, newPlace].sort((a, b) => a.dayNumber - b.dayNumber);
        return { places: updatedPlaces };
      });
      toast.success("Місце додано!");
    } catch (error) {
      console.error(error);
      toast.error("Помилка додавання");
    }
  },
  updatePlace: async (tripId, placeId, data) => {
    try {
      await updateDoc(doc(db, "trips", tripId, "places", placeId), data);
      
      set(state => {
        const updatedPlaces = state.places.map(p => 
          p.id === placeId ? { ...p, ...data } : p
        ).sort((a, b) => a.dayNumber - b.dayNumber);
        
        return { places: updatedPlaces };
      });
      
      toast.success("Місце оновлено!");
    } catch (error) {
      console.error(error);
      toast.error("Помилка оновлення");
    }
  },

  deletePlace: async (tripId, placeId) => {
    try {
      await deleteDoc(doc(db, "trips", tripId, "places", placeId));
      set(state => ({ places: state.places.filter(p => p.id !== placeId) }));
      toast.info("Місце видалено");
    } catch (error) {
      console.error(error);
      toast.error("Помилка видалення");
    }
  },

  toggleVisited: async (tripId, placeId, currentStatus) => {
    try {
      await updateDoc(doc(db, "trips", tripId, "places", placeId), { isVisited: !currentStatus });
      set(state => ({
        places: state.places.map(p => p.id === placeId ? { ...p, isVisited: !currentStatus } : p)
      }));
    } catch (error) {
      console.error(error);
      toast.error("Не вдалося оновити статус");
    }
  }
}));