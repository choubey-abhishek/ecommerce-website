"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, MapPin, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";

/**
 * Client-side address book, persisted to localStorage — the same
 * guest-friendly pattern used by the cart and wishlist. No backend or
 * schema change; once a real accounts database exists, this is the single
 * layer to swap for a server-synced address list.
 */
const STORAGE_KEY = "kopal-seth-studio:addresses";

const addressSchema = z.object({
  fullName: z.string().min(1, "Full name is required."),
  line1: z.string().min(1, "Address line 1 is required."),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required."),
  state: z.string().min(1, "State / region is required."),
  postalCode: z.string().min(3, "Postal code is required."),
  country: z.string().min(1, "Country is required."),
  phone: z.string().optional(),
});

type AddressValues = z.infer<typeof addressSchema>;

interface Address extends AddressValues {
  id: string;
  isDefault: boolean;
}

const inputClass =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 font-sans text-[14px] text-ink placeholder:text-ink/40 focus-visible:border-ink focus-visible:outline-none";

export function AddressBook() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressValues>({ resolver: zodResolver(addressSchema) });

  // Load / persist — mirrors CartContext / WishlistContext.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setAddresses(JSON.parse(stored));
    } catch {
      // Corrupt/inaccessible storage — start empty.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  }, [addresses, hydrated]);

  const openAdd = () => {
    setEditingId(null);
    reset({
      fullName: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      phone: "",
    });
    setFormOpen(true);
  };

  const openEdit = (address: Address) => {
    setEditingId(address.id);
    reset(address);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
  };

  const onSubmit = (values: AddressValues) => {
    setAddresses((prev) => {
      if (editingId) {
        return prev.map((a) => (a.id === editingId ? { ...a, ...values } : a));
      }
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : String(Date.now());
      // First address added becomes the default automatically.
      return [...prev, { ...values, id, isDefault: prev.length === 0 }];
    });
    closeForm();
  };

  const remove = (id: string) => {
    setAddresses((prev) => {
      const next = prev.filter((a) => a.id !== id);
      // If we removed the default, promote the first remaining address.
      if (!next.some((a) => a.isDefault) && next.length > 0) {
        next[0] = { ...next[0], isDefault: true };
      }
      return next;
    });
  };

  const setDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  if (!hydrated) {
    return (
      <div className="space-y-4" aria-hidden="true">
        {[0, 1].map((i) => (
          <div key={i} className="skeleton h-32 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="font-serif text-xl text-ink">Saved Addresses</h2>
        {!formOpen && (
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            Add Address
          </Button>
        )}
      </div>

      {/* Form */}
      {formOpen && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mb-8 rounded-3xl border border-ink/10 bg-sand-50 p-6"
        >
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-serif text-lg text-ink">
              {editingId ? "Edit Address" : "New Address"}
            </h3>
            <button
              type="button"
              onClick={closeForm}
              aria-label="Cancel"
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink/50 transition-colors hover:bg-sand-200 hover:text-ink"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full name" error={errors.fullName?.message}>
              <input className={inputClass} autoComplete="name" {...register("fullName")} />
            </Field>
            <Field label="Phone (optional)" error={errors.phone?.message}>
              <input className={inputClass} autoComplete="tel" {...register("phone")} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Address line 1" error={errors.line1?.message}>
                <input
                  className={inputClass}
                  autoComplete="address-line1"
                  {...register("line1")}
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Address line 2 (optional)" error={errors.line2?.message}>
                <input
                  className={inputClass}
                  autoComplete="address-line2"
                  {...register("line2")}
                />
              </Field>
            </div>
            <Field label="City" error={errors.city?.message}>
              <input className={inputClass} autoComplete="address-level2" {...register("city")} />
            </Field>
            <Field label="State / region" error={errors.state?.message}>
              <input
                className={inputClass}
                autoComplete="address-level1"
                {...register("state")}
              />
            </Field>
            <Field label="Postal code" error={errors.postalCode?.message}>
              <input
                className={inputClass}
                autoComplete="postal-code"
                {...register("postalCode")}
              />
            </Field>
            <Field label="Country" error={errors.country?.message}>
              <input className={inputClass} autoComplete="country-name" {...register("country")} />
            </Field>
          </div>

          <div className="mt-6 flex gap-3">
            <Button type="submit" size="sm">
              {editingId ? "Save Changes" : "Save Address"}
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={closeForm}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Empty state */}
      {addresses.length === 0 && !formOpen && (
        <div className="flex flex-col items-center gap-5 rounded-3xl border border-dashed border-ink/15 bg-sand-50 py-20 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-ink/40 shadow-card">
            <MapPin className="h-6 w-6" strokeWidth={1.25} aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-serif text-xl text-ink">No saved addresses</h3>
            <p className="mx-auto mt-2 max-w-xs font-sans text-[14px] leading-relaxed text-ink/60">
              Save a shipping address to reuse it at checkout on future orders.
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={openAdd}>
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            Add Your First Address
          </Button>
        </div>
      )}

      {/* List */}
      {addresses.length > 0 && (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <li
              key={address.id}
              className={cn(
                "relative rounded-3xl border bg-paper p-6",
                address.isDefault ? "border-ink/30" : "border-ink/10"
              )}
            >
              {address.isDefault && (
                <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-clay-100 px-2.5 py-1 font-sans text-[10px] uppercase tracking-widest text-clay-600">
                  <Star className="h-3 w-3 fill-clay-500 text-clay-500" strokeWidth={1.5} />
                  Default
                </span>
              )}
              <p className="font-serif text-[17px] text-ink">{address.fullName}</p>
              <address className="mt-2 not-italic font-sans text-[14px] leading-relaxed text-ink/70">
                {address.line1}
                {address.line2 && <>, {address.line2}</>}
                <br />
                {address.city}, {address.state} {address.postalCode}
                <br />
                {address.country}
                {address.phone && (
                  <>
                    <br />
                    {address.phone}
                  </>
                )}
              </address>

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-sans text-[12px] uppercase tracking-widest">
                {!address.isDefault && (
                  <button
                    type="button"
                    onClick={() => setDefault(address.id)}
                    className="inline-flex items-center gap-1.5 text-ink/60 transition-colors hover:text-ink"
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={1.5} />
                    Set default
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => openEdit(address)}
                  className="inline-flex items-center gap-1.5 text-ink/60 transition-colors hover:text-ink"
                >
                  <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => remove(address.id)}
                  className="inline-flex items-center gap-1.5 text-ink/60 transition-colors hover:text-terracotta-600"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-sans text-[12px] font-medium tracking-wide text-ink/70">
        {label}
      </span>
      {children}
      {error && (
        <span className="mt-1 block font-sans text-[12px] text-terracotta-600">{error}</span>
      )}
    </label>
  );
}
