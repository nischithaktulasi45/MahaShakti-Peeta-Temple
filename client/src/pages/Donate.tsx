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
const PHONE_REGEX = /^\d{10}$/;

export default function Donate() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState<DonationFormState>(initialFormState);
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    if (name === "phone") {
      const sanitizedValue = value.replace(/\D/g, "").slice(0, 10);
      setPhoneError("");
      setFormData((currentValue) => ({
        ...currentValue,
        phone: sanitizedValue,
      }));
      return;
    }

    if (name === "email") {
      setEmailError("");
    }

    setFormData((currentValue) => ({
      ...currentValue,
      [name]: value,
    }));
  };

  const handleEmailInvalid = (event: React.InvalidEvent<HTMLInputElement>) => {
    event.preventDefault();
    const email = event.currentTarget.value;
    
    if (email && !email.endsWith("@gmail.com")) {
      setEmailError("Please enter a valid Gmail address (example@gmail.com).");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const sanitizedPhone = formData.phone.replace(/\D/g, "").slice(0, 10);
    if (!PHONE_REGEX.test(sanitizedPhone)) {
      setPhoneError("Phone number must contain exactly 10 digits.");
      return;
    }

    setPhoneError("");
    const payload = { ...formData, phone: sanitizedPhone };
    localStorage.setItem(DONATION_STORAGE_KEY, JSON.stringify(payload));
    navigate("/donate/qr");
  };

  return (
    <div className="w-full bg-transparent py-12 min-h-[100dvh]">
      <div className="mx-auto max-w-5xl px-3 sm:px-4 lg:px-6">
        <div className="mx-auto max-w-4xl rounded-3xl border border-[#d9e6f7] bg-white/95 p-4 shadow-[0_24px_80px_rgba(10,77,155,0.12)] backdrop-blur sm:p-5 md:p-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">Donate</p>
            <h1 className="mt-3 font-serif text-2xl text-[#083C78] sm:text-3xl md:text-4xl">Donation Form</h1>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Fill in your details and choose the donation purpose.
            </p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
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
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm transition focus:border-[#0A4D9B] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="Enter your phone number"
                />
                {phoneError ? <p className="text-xs text-red-600">{phoneError}</p> : null}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700" htmlFor="email">
                Email Address (Optional)
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onInvalid={handleEmailInvalid}
                pattern="^$|[a-zA-Z0-9._%+-]+@gmail\.com"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm transition focus:border-[#0A4D9B] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                placeholder="Enter your email"
              />
              {emailError ? <p className="text-xs text-red-600">{emailError}</p> : null}
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
                  <option>Temple Development Funds</option>
                  <option>Constructions</option>
                  <option>Annaprasadam</option>
                  <option>Medical Support</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => navigate("/contact")}
                className="inline-flex w-full min-h-[44px] items-center justify-center rounded-xl border border-slate-300 px-6 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:w-auto sm:px-8 sm:py-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex w-full min-h-[44px] items-center justify-center rounded-xl bg-[#0A4D9B] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0A4D9B]/20 transition hover:bg-[#083C78] sm:w-auto sm:px-8 sm:py-4"
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