"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, MessageCircle, RotateCcw, Send, X } from "lucide-react";
import { EASE_STUDIO } from "@/animations/variants";
import { cn } from "@/utils";
import { submitToFormspree } from "@/lib/formspree";

type StepKey =
  | "name"
  | "email"
  | "phone"
  | "company"
  | "service"
  | "budget"
  | "project"
  | "preferredTime";

interface Step {
  key: StepKey;
  question: string;
  placeholder: string;
  optional?: boolean;
  multiline?: boolean;
  validate?: (value: string) => string | null;
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRe = /^[+]?[\d\s().-]{7,}$/;
const required = (v: string) => (v.trim() ? null : "This one's required, please.");

const STEPS: Step[] = [
  { key: "name", question: "May I know your name?", placeholder: "Your full name", validate: required },
  {
    key: "email",
    question: "Lovely to meet you. What's the best email to reach you?",
    placeholder: "you@example.com",
    validate: (v) => (emailRe.test(v.trim()) ? null : "Please enter a valid email."),
  },
  {
    key: "phone",
    question: "And a phone number?",
    placeholder: "+91 …",
    validate: (v) => (phoneRe.test(v.trim()) ? null : "Please enter a valid phone number."),
  },
  { key: "company", question: "Do you have a company name? (optional)", placeholder: "Company — or skip", optional: true },
  {
    key: "service",
    question: "What service are you interested in?",
    placeholder: "Commission, wholesale, workshop…",
    validate: required,
  },
  { key: "budget", question: "Do you have a budget in mind? (optional)", placeholder: "Budget — or skip", optional: true },
  {
    key: "project",
    question: "Tell us a little about your project.",
    placeholder: "A sentence or two…",
    multiline: true,
    validate: (v) => (v.trim().length >= 5 ? null : "Just a little more detail, please."),
  },
  {
    key: "preferredTime",
    question: "Any preferred time for us to contact you? (optional)",
    placeholder: "e.g. Weekday mornings — or skip",
    optional: true,
  },
];

const LABELS: Record<StepKey, string> = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  company: "Company",
  service: "Service",
  budget: "Budget",
  project: "Project",
  preferredTime: "Preferred time",
};

interface ChatMessage {
  id: number;
  from: "bot" | "user";
  text: string;
}

type Phase = "collecting" | "confirming" | "editing" | "submitting" | "done" | "error";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function ContactChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<Partial<Record<StepKey, string>>>({});
  const [phase, setPhase] = useState<Phase>("collecting");
  const [editingKey, setEditingKey] = useState<StepKey | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const idRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  const nextId = () => (idRef.current += 1);
  const pushUser = (text: string) =>
    setMessages((prev) => [...prev, { id: nextId(), from: "user", text }]);

  const botSay = async (text: string, delay = 550) => {
    setIsTyping(true);
    await sleep(delay);
    setMessages((prev) => [...prev, { id: nextId(), from: "bot", text }]);
    setIsTyping(false);
  };

  // Auto-scroll to newest message / typing indicator.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping, phase]);

  // Kick off the conversation the first time the panel opens.
  useEffect(() => {
    if (!open || startedRef.current) return;
    startedRef.current = true;
    void (async () => {
      await botSay("👋 Hello! Thanks for visiting. I'd be happy to help.", 300);
      await botSay(STEPS[0].question, 700);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const askConfirm = async () => {
    setPhase("confirming");
    const summary = STEPS.map((s) => {
      const v = data[s.key];
      return `• ${LABELS[s.key]}: ${v && v.trim() ? v : "—"}`;
    }).join("\n");
    await botSay(`Here's what I have:\n\n${summary}\n\nWould you like to send this to our team?`, 500);
  };

  const advanceFrom = async (index: number) => {
    const next = index + 1;
    if (next < STEPS.length) {
      setStepIndex(next);
      await botSay(STEPS[next].question);
    } else {
      await askConfirm();
    }
  };

  const handleSend = async () => {
    if (phase !== "collecting") return;
    const step = STEPS[stepIndex];
    const value = input.trim();

    if (!value && !step.optional) {
      await botSay(step.validate ? step.validate("") ?? "This one's required, please." : "This one's required, please.");
      return;
    }
    if (value && step.validate) {
      const err = step.validate(value);
      if (err) {
        pushUser(value);
        setInput("");
        await botSay(err);
        return;
      }
    }

    pushUser(value || "—");
    setInput("");
    setData((prev) => ({ ...prev, [step.key]: value }));

    // If we were editing a single field, go straight back to confirm.
    if (editingKey) {
      setEditingKey(null);
      await askConfirm();
      return;
    }
    await advanceFrom(stepIndex);
  };

  const handleSkip = async () => {
    if (phase !== "collecting") return;
    const step = STEPS[stepIndex];
    if (!step.optional) return;
    pushUser("Skipped");
    setData((prev) => ({ ...prev, [step.key]: "" }));
    if (editingKey) {
      setEditingKey(null);
      await askConfirm();
      return;
    }
    await advanceFrom(stepIndex);
  };

  const handleBack = async () => {
    if (phase !== "collecting" || stepIndex === 0 || editingKey) return;
    const prev = stepIndex - 1;
    setStepIndex(prev);
    await botSay(`No problem — let's revisit that. ${STEPS[prev].question}`);
  };

  const startEdit = async (key: StepKey) => {
    setEditingKey(key);
    setPhase("collecting");
    const idx = STEPS.findIndex((s) => s.key === key);
    setStepIndex(idx);
    await botSay(`Sure — ${STEPS[idx].question}`);
  };

  const restart = async () => {
    setMessages([]);
    setData({});
    setStepIndex(0);
    setEditingKey(null);
    setErrorMsg(null);
    setPhase("collecting");
    idRef.current = 0;
    await botSay("Let's start over. 🙂", 300);
    await botSay(STEPS[0].question, 600);
  };

  const submit = async () => {
    setPhase("submitting");
    setErrorMsg(null);
    const result = await submitToFormspree({
      Name: data.name,
      Email: data.email,
      Phone: data.phone,
      Company: data.company,
      Service: data.service,
      Budget: data.budget,
      Project: data.project,
      PreferredContactTime: data.preferredTime,
      Timestamp: new Date().toISOString(),
      Source: "Chatbot",
      _subject: `New chatbot inquiry — ${data.name ?? "Visitor"}`,
    });
    if (result.ok) {
      setPhase("done");
      await botSay("✅ Thank you! Your details are on their way to our team — we'll be in touch soon.", 400);
    } else {
      setPhase("error");
      setErrorMsg(result.error ?? "Something went wrong.");
      await botSay("Hmm, that didn't go through. You can try sending again.", 400);
    }
  };

  const currentStep = STEPS[stepIndex];
  const showInput = phase === "collecting";

  return (
    <>
      {/* Floating launcher */}
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close contact assistant" : "Open contact assistant"}
        aria-expanded={open}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE_STUDIO, delay: 0.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-5 right-5 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white shadow-lift sm:bottom-6 sm:right-6"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X className="h-6 w-6" strokeWidth={1.5} />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageCircle className="h-6 w-6" strokeWidth={1.5} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE_STUDIO }}
            role="dialog"
            aria-label="Contact assistant"
            className="fixed bottom-24 right-4 z-[70] flex h-[70vh] max-h-[560px] w-[calc(100vw-2rem)] max-w-[380px] flex-col overflow-hidden rounded-3xl border border-ink/10 bg-paper shadow-lift sm:right-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 border-b border-ink/10 bg-ink px-4 py-3 text-white">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                  <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
                </span>
                <div className="leading-tight">
                  <p className="font-serif text-[15px]">Studio Assistant</p>
                  <p className="font-sans text-[10px] uppercase tracking-widest text-white/60">
                    Typically replies by email
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={restart}
                  aria-label="Restart conversation"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <RotateCcw className="h-4 w-4" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-sand-50 px-4 py-4">
              {messages.map((m) => (
                <div key={m.id} className={cn("flex", m.from === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[80%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 font-sans text-[13px] leading-relaxed",
                      m.from === "user"
                        ? "rounded-br-sm bg-ink text-white"
                        : "rounded-bl-sm bg-white text-ink shadow-card"
                    )}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-white px-3.5 py-3 shadow-card">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-ink/40"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="border-t border-ink/10 bg-paper p-3">
              {/* Confirm actions */}
              {phase === "confirming" && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={submit}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-ink px-4 py-2.5 font-sans text-[12px] uppercase tracking-widest text-white transition-colors hover:bg-charcoal"
                  >
                    <Check className="h-4 w-4" strokeWidth={1.5} /> Yes, send
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhase("editing")}
                    className="rounded-full border border-ink/20 px-4 py-2.5 font-sans text-[12px] uppercase tracking-widest text-ink transition-colors hover:border-ink"
                  >
                    Edit
                  </button>
                </div>
              )}

              {/* Edit field picker */}
              {phase === "editing" && (
                <div className="flex flex-wrap gap-2">
                  {STEPS.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => startEdit(s.key)}
                      className="rounded-full border border-ink/15 px-3 py-1.5 font-sans text-[11px] text-ink/70 transition-colors hover:border-ink hover:text-ink"
                    >
                      {LABELS[s.key]}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={askConfirm}
                    className="rounded-full px-3 py-1.5 font-sans text-[11px] uppercase tracking-widest text-ink/50 hover:text-ink"
                  >
                    Back
                  </button>
                </div>
              )}

              {/* Retry on error */}
              {phase === "error" && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={submit}
                    className="flex-1 rounded-full bg-ink px-4 py-2.5 font-sans text-[12px] uppercase tracking-widest text-white transition-colors hover:bg-charcoal"
                  >
                    Try Again
                  </button>
                  <button
                    type="button"
                    onClick={restart}
                    className="rounded-full border border-ink/20 px-4 py-2.5 font-sans text-[12px] uppercase tracking-widest text-ink transition-colors hover:border-ink"
                  >
                    Restart
                  </button>
                </div>
              )}

              {/* Text input */}
              {showInput && (
                <div>
                  <div className="flex items-end gap-2">
                    {stepIndex > 0 && !editingKey && (
                      <button
                        type="button"
                        onClick={handleBack}
                        aria-label="Go back"
                        className="flex h-10 w-10 flex-none items-center justify-center rounded-full text-ink/50 transition-colors hover:bg-sand-100 hover:text-ink"
                      >
                        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                    )}
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          void handleSend();
                        }
                      }}
                      rows={1}
                      placeholder={currentStep?.placeholder ?? "Type a message…"}
                      aria-label="Your message"
                      className="max-h-24 min-h-[40px] flex-1 resize-none rounded-2xl border border-ink/15 bg-white px-3.5 py-2.5 font-sans text-[13px] text-ink placeholder:text-ink/40 focus-visible:border-ink focus-visible:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => void handleSend()}
                      aria-label="Send"
                      className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-ink text-white transition-transform hover:scale-105"
                    >
                      <Send className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </div>
                  {currentStep?.optional && (
                    <button
                      type="button"
                      onClick={handleSkip}
                      className="mt-2 font-sans text-[11px] uppercase tracking-widest text-ink/40 hover:text-ink"
                    >
                      Skip this
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
