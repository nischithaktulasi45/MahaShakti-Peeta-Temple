export default function NotFound() {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#f4f8fc]">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(10,77,155,0.10),transparent_26%),radial-gradient(circle_at_85%_10%,rgba(212,175,55,0.12),transparent_22%),radial-gradient(circle_at_50%_80%,rgba(10,77,155,0.08),transparent_28%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.78)_0%,rgba(244,248,252,0.92)_100%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[100dvh] max-w-3xl items-center justify-center px-4 py-14">
        <div className="rounded-3xl border border-[#d9e6f7] bg-white/95 p-8 text-center shadow-[0_24px_80px_rgba(10,77,155,0.12)] backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">404</p>
          <h1 className="mt-3 font-serif text-4xl text-[#083C78]">Page Not Found</h1>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            The page you are looking for does not exist.
          </p>
        </div>
      </div>
    </div>
  );
}
