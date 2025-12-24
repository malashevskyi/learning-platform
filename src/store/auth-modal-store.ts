import { create } from "zustand";
import type { EmailVerificationVariant } from "@/components/auth/EmailVerificationModal";
import type { MismatchProvider } from "@/components/auth/ProviderMismatchModal";

export type ModalType =
  | "verification"
  | "alreadyRegistered"
  | "verificationError"
  | "providerMismatch"
  | "passwordReset"
  | null;

interface AuthModalState {
  activeModal: ModalType;
  registeredEmail: string;
  verificationVariant: EmailVerificationVariant;
  providerMismatchType: MismatchProvider;
}

interface AuthModalActions {
  showVerificationModal: (
    email: string,
    variant: EmailVerificationVariant
  ) => void;
  showAlreadyRegisteredModal: (email: string) => void;
  showPasswordResetModal: (email?: string) => void;
  showProviderMismatchModal: (
    email: string,
    provider: MismatchProvider
  ) => void;
  closeAllModals: () => void;
  setRegisteredEmail: (email: string) => void;
}

type AuthModalStore = AuthModalState & AuthModalActions;

export const useAuthModalStore = create<AuthModalStore>((set) => ({
  // Initial state
  activeModal: null,
  registeredEmail: "",
  verificationVariant: "new-registration",
  providerMismatchType: "google",

  // Actions
  showVerificationModal: (email, variant) =>
    set({
      activeModal: "verification",
      registeredEmail: email,
      verificationVariant: variant,
    }),

  showAlreadyRegisteredModal: (email) =>
    set({
      activeModal: "alreadyRegistered",
      registeredEmail: email,
    }),

  showPasswordResetModal: (email) =>
    set({
      activeModal: "passwordReset",
      registeredEmail: email || "",
    }),

  showProviderMismatchModal: (email, provider) =>
    set({
      activeModal: "providerMismatch",
      registeredEmail: email,
      providerMismatchType: provider,
    }),

  closeAllModals: () =>
    set({
      activeModal: null,
    }),

  setRegisteredEmail: (email) =>
    set({
      registeredEmail: email,
    }),
}));
