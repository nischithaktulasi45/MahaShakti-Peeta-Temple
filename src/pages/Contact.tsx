import { useState, type ChangeEvent, type FormEvent } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

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

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
const MAPS_QUERY = "X7JW+WF3 Bhantrakuppe, Karnataka";
const MAPS_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(MAPS_QUERY)}&output=embed`;
const MAPS_DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAPS_QUERY)}`;

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
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || "Failed to send message");
      }

      setStatusType("success");
      setStatusMessage("Your message was saved successfully.");
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
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl md:text-4xl text-[#083C78] mb-4">Contact Us</h1>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto" />
          <p className="mt-5 text-base md:text-lg text-gray-600 max-w-3xl mx-auto font-sans">
            We welcome your inquiries, feedback, and requests. Please reach out to us using the details below or fill out the contact form.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-[#F8F9FA] text-[#083C78] p-8 md:p-10 rounded-2xl shadow-xl border border-[#EAF4FF] flex flex-col justify-between">
            <div>
              <h2 className="font-serif text-3xl text-[#083C78] mb-4">Get in Touch</h2>
              <div className="w-20 h-1 bg-[#D4AF37] mb-8" />

              <div className="space-y-6 font-sans">
                <div className="flex items-start gap-4">
                  <FaMapMarkerAlt className="text-[#D4AF37] text-2xl mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg mb-1">Address</h4>
                    <p className="text-gray-600">
                      Mahashakti Peeta Temple,<br />
                      X7JW+WF3, Bhantrakuppe,<br />
                      Karnataka, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <FaPhoneAlt className="text-[#D4AF37] text-2xl mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg mb-1">Phone</h4>
                    <p className="text-gray-600">
                      +91 9876543210<br />+91 9876543211 <br />+91 9686903945
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <FaEnvelope className="text-[#D4AF37] text-2xl mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg mb-1">Email</h4>
                    <p className="text-gray-600">mahashakthipeetacharitabletres@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-xl overflow-hidden border-4 border-[#D4AF37]/30 h-44 w-full bg-gray-200">
              <iframe
                src={MAPS_EMBED_URL}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mahashakti Peeta location map"
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

          <div className="p-8 md:p-10 bg-[#F8F9FA] rounded-2xl shadow-xl border border-[#EAF4FF]">
            <h2 className="font-serif text-3xl text-[#083C78] mb-4">Send a Message</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mb-8" />

            <form className="space-y-6 font-sans" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
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
                ></textarea>
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
                className="w-full bg-[#0A4D9B] text-white py-4 rounded font-bold uppercase tracking-wider hover:bg-[#083C78] hover:text-[#D4AF37] transition-colors font-mono shadow-md hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
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
