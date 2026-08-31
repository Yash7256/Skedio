import React, { createContext, useContext, useState, useEffect } from "react";

interface ContactModalContextType {
  isOpen: boolean;
  openContactModal: () => void;
  closeContactModal: () => void;
}

const ContactModalContext = createContext<ContactModalContextType | undefined>(undefined);

export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openContactModal = () => setIsOpen(true);
  const closeContactModal = () => setIsOpen(false);

  useEffect(() => {
    // Listen for custom event
    const handleOpenEvent = () => setIsOpen(true);
    window.addEventListener("open-contact-modal", handleOpenEvent);

    // Delegated click handler for any #contact or data-contact-modal elements
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a, button");
      if (!target) return;

      const href = target.getAttribute("href");
      const isContactTrigger =
        target.hasAttribute("data-contact-modal") ||
        href === "#contact" ||
        target.textContent?.trim().toLowerCase().includes("let's talk");

      if (isContactTrigger) {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(true);
      }
    };

    document.addEventListener("click", handleGlobalClick, true);

    return () => {
      window.removeEventListener("open-contact-modal", handleOpenEvent);
      document.removeEventListener("click", handleGlobalClick, true);
    };
  }, []);

  return (
    <ContactModalContext.Provider value={{ isOpen, openContactModal, closeContactModal }}>
      {children}
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  const context = useContext(ContactModalContext);
  if (!context) {
    throw new Error("useContactModal must be used within a ContactModalProvider");
  }
  return context;
}

export function triggerContactModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-contact-modal"));
  }
}
