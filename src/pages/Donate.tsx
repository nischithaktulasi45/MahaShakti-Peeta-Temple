import { useState, type ChangeEvent, type FormEvent } from "react";
import { useLocation } from "wouter";

type DonationFormState = {
  name: string;
  phone: string;
  email: string;
  amount: string;
  purpose: string;
};

const initialFormState: DonationFormState = {
  name: "",
  phone: "",
  email: "",
  amount: "",
  purpose: "Temple Development",
};

const DONATION_STORAGE_KEY = "temple_donation_form";

export default function Donate() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState<DonationFormState>(initialFormState);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((currentValue) => ({
      ...currentValue,
      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem(DONATION_STORAGE_KEY, JSON.stringify(formData));
    navigate("/donate/qr");
  };

  return (
    <div className="w-full bg-transparent py-12 min-h-[100dvh]">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mx-auto max-w-4xl rounded-3xl border border-[#d9e6f7] bg-white/95 p-5 shadow-[0_24px_80px_rgba(10,77,155,0.12)] backdrop-blur md:p-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">Donate</p>
            <h1 className="mt-3 font-serif text-3xl text-[#083C78] md:text-4xl">Donation Form</h1>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Fill in your details and choose the donation purpose.
            </p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm transition focus:border-[#0A4D9B] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm transition focus:border-[#0A4D9B] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm transition focus:border-[#0A4D9B] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                placeholder="Enter your email"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700" htmlFor="amount">
                  Rupees
                </label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  min="1"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm transition focus:border-[#0A4D9B] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="Enter amount"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700" htmlFor="purpose">
                  Donation Purpose
                </label>
                <select
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm transition focus:border-[#0A4D9B] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  <option>Temple Development</option>
                  <option>Annaprasadam</option>
                  <option>Medical Support</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => navigate("/contact")}
                className="inline-flex min-w-[120px] items-center justify-center rounded-xl border border-slate-300 px-8 py-4 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex min-w-[180px] items-center justify-center rounded-xl bg-[#0A4D9B] px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-[#0A4D9B]/20 transition hover:bg-[#083C78]"
              >
                Submit &amp; Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}