import { create } from 'zustand';
import { 
  collection, query, where, getDocs, deleteDoc, doc, updateDoc, arrayUnion 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { IInvitation } from '../types';
import { toast } from '../utils/toast';

interface InvitationsState {
  invitations: IInvitation[];
  isLoading: boolean;
  
  fetchInvitations: (userId: string) => Promise<void>;
  acceptInvitation: (invitation: IInvitation, userId: string) => Promise<void>;
  rejectInvitation: (invitationId: string) => Promise<void>;
}

export const useInvitationsStore = create<InvitationsState>((set) => ({
  invitations: [],
  isLoading: false,

  fetchInvitations: async (userId) => {
    set({ isLoading: true });
    try {
      const q = query(
        collection(db, "invitations"), 
        where("receiverUid", "==", userId)
      );
      const snapshot = await getDocs(q);
      const invites = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as IInvitation[];
      
      set({ invitations: invites });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  acceptInvitation: async (invitation, userId) => {
    try {
      const tripRef = doc(db, "trips", invitation.tripId);
      await updateDoc(tripRef, {
        collaborators: arrayUnion(userId)
      });
      await deleteDoc(doc(db, "invitations", invitation.id));
      set(state => ({
        invitations: state.invitations.filter(i => i.id !== invitation.id)
      }));

      toast.success(`Ви приєдналися до подорожі "${invitation.tripTitle}"!`);
    } catch (error) {
      console.error(error);
      toast.error("Помилка при прийнятті");
    }
  },

  rejectInvitation: async (invitationId) => {
    try {
      await deleteDoc(doc(db, "invitations", invitationId));
      
      set(state => ({
        invitations: state.invitations.filter(i => i.id !== invitationId)
      }));
      toast.info("Запрошення відхилено");
    } catch (error) {
        console.error(error);
      toast.error("Помилка");
    }
  }
}));