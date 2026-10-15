import { createContext, useContext } from "react";

export interface ContactModalContextType {
  isOpen: boolean;
  openContactModal: () => void;
  closeContactModal: () => void;
}

export const ContactModalContext = createContext<ContactModalContextType | undefined>(undefined);

export function useContactModal() {
  const context = useContext(ContactModalContext);
  if (!context) {
    throw new Error("useContactModal must be used within a ContactModalProvider");
  }
  return context;
}

export const CONTACT_PAGE_URL = "https://www.skediodesign.in/contact";

export function goToContactPage() {
  if (typeof window !== "undefined") {
    window.location.href = CONTACT_PAGE_URL;
  }
}

export function triggerContactModal() {
  goToContactPage();
}
