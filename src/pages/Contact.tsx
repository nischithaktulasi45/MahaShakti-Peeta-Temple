import { useState, type ChangeEvent, type FormEvent } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { submitContactMessage } from "../services/contactService";

type ContactFormState = {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
};

const initialFormState: ContactFormState = {
  name: "",
  phone: "",
  email: "",
  subject: "General Inquiry",
  message: "",
};

const MAPS_LAT = "12.9822625";
const MAPS_LNG = "77.296171875";
const MAPS_EMBED_URL = `https://maps.google.com/maps?q=${MAPS_LAT},${MAPS_LNG}&t=k&z=19&output=embed`;
const MAPS_DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${MAPS_LAT},${MAPS_LNG}`;

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((currentValue) => ({
      ...currentValue,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);
    setStatusType(null);

    try {
      const response = await submitContactMessage(formData);

      setStatusType("success");
      setStatusMessage(response.data?.message || "Your message was saved successfully.");
      setFormData(initialFormState);
    } catch (error) {
      setStatusType("error");
      setStatusMessage(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-transparent py-12 min-h-[100dvh]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="mb-4 font-serif text-2xl text-[#083C78] sm:text-3xl md:text-4xl">Contact Us</h1>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto" />
          <p className="mx-auto mt-5 max-w-3xl font-sans text-sm text-gray-600 sm:text-base md:text-lg">
            We welcome your inquiries, feedback, and requests. Please reach out to us using the details below or fill out the contact form.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col justify-between rounded-2xl border border-[#EAF4FF] bg-[#F8F9FA] p-5 text-[#083C78] shadow-xl sm:p-6 md:p-8 lg:p-10">
            <div>
              <h2 className="mb-4 font-serif text-2xl text-[#083C78] sm:text-3xl">Get in Touch</h2>
              <div className="w-20 h-1 bg-[#D4AF37] mb-8" />

              <div className="space-y-6 font-sans">
                <div className="flex flex-wrap items-start gap-4">
                  <FaMapMarkerAlt className="mt-1 flex-shrink-0 text-2xl text-[#D4AF37]" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-lg mb-1">Address</h4>
                    <p className="text-gray-600">
                      Mahashakti Peeta Temple,<br />
                      X7JW+WF3, Bhantrakuppe,<br />
                      Karnataka, India
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-start gap-4">
                  <FaPhoneAlt className="mt-1 flex-shrink-0 text-2xl text-[#D4AF37]" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-lg mb-1">Phone</h4>
                    <p className="text-gray-600">
                     +91 9876543211 <br />+91 9686903945
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-start gap-4">
                  <FaEnvelope className="mt-1 flex-shrink-0 text-2xl text-[#D4AF37]" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-lg mb-1">Email</h4>
                    <p className="text-gray-600">mahashakthipeetacharitabletres@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map container – fixed white space below map */}
            <div className="mt-8 relative w-full overflow-hidden rounded-xl border-4 border-[#D4AF37]/30 bg-gray-200 h-[260px] sm:h-[320px] md:h-[420px]">
                <iframe
                  src={MAPS_EMBED_URL}
                  title="Mahashakti Peeta location map"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  style={{ width: "100%", height: "100%", display: "block", border: 0 }}
                ></iframe>
            </div>
            <a
              href={MAPS_DIRECTIONS_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex text-sm font-semibold text-[#0A4D9B] hover:text-[#083C78] underline underline-offset-4"
            >
              Open in Google Maps
            </a>
          </div>

          <div className="rounded-2xl border border-[#EAF4FF] bg-[#F8F9FA] p-5 shadow-xl sm:p-8 md:p-10">
            <h2 className="mb-4 font-serif text-2xl text-[#083C78] sm:text-3xl">Send a Message</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mb-8" />

            <form className="space-y-6 font-sans" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
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
                    className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#0A4D9B] transition-colors"
                    placeholder="Enter your name"
                    required
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
                    className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#0A4D9B] transition-colors"
                    placeholder="Enter your phone"
                    required
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
                  className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#0A4D9B] transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700" htmlFor="subject">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#0A4D9B] transition-colors bg-white"
                >
                  <option>General Inquiry</option>
                  <option>Pooja Booking</option>
                  <option>Donation Details</option>
                  <option>Volunteer Program</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#0A4D9B] transition-colors resize-none"
                  placeholder="Type your message here..."
                  required
                />
              </div>

              {statusMessage && (
                <p
                  className={`rounded px-4 py-3 text-sm font-medium ${
                    statusType === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {statusMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-[44px] rounded bg-[#0A4D9B] py-3 font-mono font-bold uppercase tracking-wider text-white shadow-md transition-colors hover:bg-[#083C78] hover:text-[#D4AF37] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 sm:py-4"
              >
                {isSubmitting ? "Submitting..." : "Submit Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}