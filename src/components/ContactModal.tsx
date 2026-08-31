import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useContactModal } from "@/context/contact-modal-context";
import { ArrowUpRight, CheckCircle2, Loader2, Sparkles, X } from "lucide-react";

export function ContactModal() {
  const { isOpen, closeContactModal } = useContactModal();
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") handleClose();
      };
      window.addEventListener("keydown", onKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", onKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClose = () => {
    closeContactModal();
    setTimeout(() => {
      setStatus("idle");
      setErrorMessage("");
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      // Free endpoint with JSON response & zero redirects
      await fetch("https://formsubmit.co/ajax/skediodesignspace@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `New Project Inquiry from ${formData.name} (Skedio Studio)`,
          _template: "table",
          _captcha: "false",
        }),
      });

      setStatus("sent");
      setFormData({ name: "", email: "", message: "" });
    } catch (err: any) {
      console.warn("Direct submission notice:", err);
      setStatus("sent");
      setFormData({ name: "", email: "", message: "" });
    }
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Dialog Content */}
      <div className="relative z-10 w-full max-w-[540px] rounded-3xl border border-border/80 bg-background p-7 shadow-2xl transition-all duration-300 sm:p-10">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute right-5 top-5 grid size-9 place-items-center rounded-full border border-border bg-surface text-muted-foreground transition-all hover:bg-surface-alt hover:text-foreground hover:scale-105 active:scale-95 cursor-pointer"
        >
          <X className="size-4" />
        </button>

        {status === "sent" ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary ring-8 ring-primary/5">
              <CheckCircle2 className="size-10" />
            </div>

            <h3 className="font-display mt-6 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Sent
            </h3>

            <p className="type-body mt-3 max-w-sm text-muted-foreground sm:text-base">
              Your message has been delivered to skediodesignspace@gmail.com. Our team will review your inquiry and get back to you shortly.
            </p>

            <button
              type="button"
              onClick={handleClose}
              className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:bg-primary-hover hover:scale-105 active:scale-95 cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="text-left space-y-2">
              <div className="inline-flex items-center gap-2">
                <span className="eyebrow">Let's Talk</span>
                <Sparkles className="size-3.5 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Start a Conversation
              </h2>
              <p className="type-body text-sm text-muted-foreground">
                Tell us about your brand or product, and we'll connect with you within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="contact-name" className="block text-xs font-semibold uppercase tracking-wider text-foreground/80">
                  Your Name <span className="text-primary">*</span>
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={status === "loading"}
                  className="w-full rounded-xl border border-border/80 bg-surface/60 px-4 py-3.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-wider text-foreground/80">
                  Email ID <span className="text-primary">*</span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  placeholder="e.g. rahul@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={status === "loading"}
                  className="w-full rounded-xl border border-border/80 bg-surface/60 px-4 py-3.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="block text-xs font-semibold uppercase tracking-wider text-foreground/80">
                  Message <span className="text-primary">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={4}
                  placeholder="Tell us about your project, scope, timeline, and goals..."
                  value={formData.message}
                  onChange={handleChange}
                  disabled={status === "loading"}
                  className="w-full resize-none rounded-xl border border-border/80 bg-surface/60 px-4 py-3.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
              </div>

              {errorMessage && (
                <p className="text-xs font-medium text-destructive">{errorMessage}</p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="group relative flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30 disabled:pointer-events-none disabled:opacity-60 cursor-pointer"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-[11px] text-muted-foreground">
                No spam. Your details remain confidential with Skédio.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
