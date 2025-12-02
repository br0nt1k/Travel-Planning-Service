import { create } from 'zustand';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  type User 
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app'; 
import { auth } from '../lib/firebase';
import { toast } from '../utils/toast';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  register: (email: string, pass: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  register: async (email, pass) => {
    set({ isLoading: true });
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
      toast.success("Акаунт створено успішно!");
    } catch (error) {
      console.error(error);
      if (error instanceof FirebaseError) {
        toast.error(getErrorMessage(error.code));
      } else {
        toast.error("Невідома помилка при реєстрації");
      }
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, pass) => {
    set({ isLoading: true });
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      toast.success("З поверненням!");
    } catch (error) {
      console.error(error);
      if (error instanceof FirebaseError) {
        toast.error(getErrorMessage(error.code));
      } else {
        toast.error("Невірний логін або пароль");
      }
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await signOut(auth);
      set({ user: null });
      toast.info("Ви вийшли з системи");
    } catch (error) {
        console.error(error);
      toast.error("Помилка при виході");
    } finally {
      set({ isLoading: false });
    }
  },

  setUser: (user) => set({ user, isLoading: false }),
}));

function getErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/invalid-email': return 'Некоректний Email';
    case 'auth/user-not-found': return 'Користувача не знайдено';
    case 'auth/wrong-password': return 'Невірний пароль';
    case 'auth/email-already-in-use': return 'Цей Email вже зайнятий';
    case 'auth/weak-password': return 'Пароль занадто простий (мін. 6 символів)';
    case 'auth/invalid-credential': return 'Невірні дані для входу'; 
    default: return 'Сталася помилка. Спробуйте ще раз.';
  }
}