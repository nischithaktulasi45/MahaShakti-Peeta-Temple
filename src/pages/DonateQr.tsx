import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { submitDonation } from "../services/donationService";

type DonationFormState = {
  name: string;
  phone: string;
  email: string;
  amount: string;
  purpose: string;
};

const qrSources = ["/image/QR.png"];
const DONATION_STORAGE_KEY = "temple_donation_form";

export default function DonateQr() {
  const [, navigate] = useLocation();
  const [qrSourceIndex, setQrSourceIndex] = useState(0);
  const [donationData, setDonationData] = useState<DonationFormState | null>(null);
  const [utrNumber, setUtrNumber] = useState("");
  const [utrNumberMessage, setUtrNumberMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(null);
  const normalizedUtrNumber = utrNumber.trim();
  const isUtrNumberValid = normalizedUtrNumber !== "" && /^\d+$/.test(normalizedUtrNumber);

  useEffect(() => {
    const savedData = window.localStorage.getItem(DONATION_STORAGE_KEY);
    if (!savedData) {
      navigate("/donate");
      return;
    }

    try {
      setDonationData(JSON.parse(savedData) as DonationFormState);
    } catch {
      navigate("/donate");
    }
  }, [navigate]);

  const handlePaymentDone = async () => {
    if (!donationData) {
      setStatusType("error");
      setStatusMessage("Donation details are missing. Please go back and fill the form again.");
      return;
    }

    if (!isUtrNumberValid) {
      const message = "UTR number must contain numbers only.";
      setStatusType("error");
      setStatusMessage(message);
      window.alert(message);
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);
    setStatusType(null);

    try {
      await submitDonation({
        ...donationData,
        amount: Number(donationData.amount),
        utrNumber: normalizedUtrNumber,
        paymentStatus: "completed",
      });

      window.localStorage.removeItem(DONATION_STORAGE_KEY);
      setStatusType("success");
      setStatusMessage("Donation saved successfully.");
      setUtrNumber("");
    } catch (error) {
      setStatusType("error");
      setStatusMessage(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full bg-transparent py-12 min-h-[100dvh]">
      <div className="relative mx-auto max-w-6xl px-4">
        <div className="rounded-3xl border border-[#d9e6f7] bg-white/95 p-6 shadow-[0_24px_80px_rgba(10,77,155,0.12)] backdrop-blur md:p-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">Donate</p>
            <h1 className="mt-3 font-serif text-4xl text-[#083C78]">Scan to Complete Donation</h1>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Scan the QR code below, complete the payment, then enter the transaction ID and click Payment Done.
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
              <div className="mx-auto flex h-64 w-64 items-center justify-center rounded-2xl border-8 border-white bg-white p-4 shadow-inner">
                <img
                  src={qrSources[qrSourceIndex]}
                  alt="Donation QR code"
                  className="h-full w-full rounded-xl object-contain"
                  onError={() => {
                    setQrSourceIndex((currentIndex) =>
                      currentIndex < qrSources.length - 1 ? currentIndex + 1 : currentIndex,
                    );
                  }}
                />
              </div>
              <p className="mt-5 text-sm leading-6 text-slate-600">
                Scan this QR code with your UPI app and complete the payment.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-2xl font-semibold text-slate-800">Donation Details</h2>
              <div className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
                <p>
                  <span className="font-semibold text-slate-800">Name:</span>{" "}
                  {donationData?.name || "-"}
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Phone:</span>{" "}
                  {donationData?.phone || "-"}
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Email:</span>{" "}
                  {donationData?.email || "-"}
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Amount:</span>{" "}
                  {donationData?.amount ? `₹${donationData.amount}` : "-"}
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Purpose:</span>{" "}
                  {donationData?.purpose || "-"}
                </p>
              </div>

              {statusMessage && (
                <p
                  className={`mt-6 rounded px-4 py-3 text-sm font-medium ${
                    statusType === "success"
                      ? "border border-green-200 bg-green-50 text-green-700"
                      : "border border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {statusMessage}
                </p>
              )}

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/donate"
                  className="rounded-xl border border-slate-300 px-6 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel
                </Link>
                <button
                  type="button"
                  onClick={handlePaymentDone}
                  disabled={isSaving || !donationData || !isUtrNumberValid}
                  className="rounded-xl bg-[#0A4D9B] px-6 py-3 font-semibold text-white shadow-lg shadow-[#0A4D9B]/20 transition hover:bg-[#083C78] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSaving ? "Saving..." : "Payment Done"}
                </button>
              </div>

              <div className="mt-6 space-y-2">
                <label className="text-sm font-bold text-gray-700" htmlFor="utrNumber">
                  UTR Number
                </label>
                <input
                  id="utrNumber"
                  name="utrNumber"
                  type="text"
                  value={utrNumber}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    setUtrNumber(nextValue);

                    if (nextValue.trim() === "") {
                      setUtrNumberMessage(null);
                      return;
                    }

                    setUtrNumberMessage(/^\d+$/.test(nextValue.trim())
                      ? null
                      : "UTR number must contain numbers only.");
                  }}
                  className="w-full rounded border border-gray-300 px-4 py-3 transition focus:border-[#0A4D9B] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="Enter UTR number after payment"
                />
                {utrNumberMessage && (
                  <p className="text-sm font-medium text-red-600">{utrNumberMessage}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}