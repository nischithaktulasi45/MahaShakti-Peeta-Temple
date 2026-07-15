import { useEffect, useMemo, useState } from "react";

const PROGRESS_VIDEOS = [
  { id: 1, src: "/progress/video1.mp4" },
  { id: 2, src: "/progress/video2.mp4" },
  { id: 3, src: "/progress/video3.mp4" },
  { id: 4, src: "/progress/video4.mp4" },
  { id: 5, src: "/progress/video5.mp4" },
  { id: 6, src: "/progress/video6.mp4" },
  { id: 7, src: "/progress/video7.mp4" },
  { id: 8, src: "/progress/video8.mp4" },
  { id: 9, src: "/progress/video9.mp4" },
  { id: 10, src: "/progress/video10.mp4" },
  { id: 11, src: "/progress/video11.mp4" },
  { id: 12, src: "/progress/video12.mp4" },
  { id: 13, src: "/progress/video13.mp4" },
  { id: 14, src: "/progress/video14.mp4" },
  { id: 15, src: "/progress/video15.mp4" },
  { id: 16, src: "/progress/video16.mp4" },
  { id: 17, src: "/progress/video17.mp4" },
  { id: 18, src: "/progress/video18.mp4" },
  { id: 19, src: "/progress/video19.mp4" },
  // 🆕 New video20 – muted by default (all videos have muted attribute)
 
];

type Orientation = "horizontal" | "vertical";

export default function ProgressGallery() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [orientations, setOrientations] = useState<Record<number, Orientation>>({});

  const sortedVideos = useMemo(() => {
    return [...PROGRESS_VIDEOS].sort((a, b) => {
      const aOrientation = orientations[a.id] || "horizontal";
      const bOrientation = orientations[b.id] || "horizontal";

      if (aOrientation === bOrientation) {
        return a.id - b.id;
      }

      return aOrientation === "horizontal" ? -1 : 1;
    });
  }, [orientations]);

  useEffect(() => {
    if (!activeVideo) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveVideo(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeVideo]);

  return (
    <div className="min-h-[100dvh] bg-transparent py-12">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="mb-4 font-serif text-2xl text-[#083C78] sm:text-3xl md:text-4xl">
            Progress Gallery
          </h1>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto" />
          <p className="mx-auto mt-5 max-w-3xl font-sans text-sm text-gray-600 sm:text-base md:text-lg">
            A visual journey through the sacred moments, construction updates,
            and milestones of Mahashakti Peeta Temple.
          </p>
        </div>

        <div className="mb-10 flex justify-center">
          <span className="rounded-full bg-[#0A4D9B] px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-[#0A4D9B]/30 sm:px-8">
            All
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedVideos.map((video) => {
            const orientation = orientations[video.id] || "horizontal";
            const aspectClass =
              orientation === "vertical" ? "aspect-[9/16]" : "aspect-[16/9]";

            return (
              <article
                key={video.id}
                className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(8,60,120,0.12)] ring-1 ring-slate-200/70 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className={`relative w-full overflow-hidden bg-slate-50 ${aspectClass}`}>
                  <video
                    className="absolute inset-0 h-full w-full cursor-pointer object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    onLoadedMetadata={(event) => {
                      const media = event.currentTarget;
                      const detectedOrientation: Orientation =
                        media.videoWidth >= media.videoHeight ? "horizontal" : "vertical";

                      setOrientations((current) =>
                        current[video.id] === detectedOrientation
                          ? current
                          : { ...current, [video.id]: detectedOrientation }
                      );
                    }}
                    onClick={() => setActiveVideo(video.src)}
                  >
                    <source src={video.src} type="video/mp4" />
                  </video>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {activeVideo && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 px-4 py-8 backdrop-blur-sm"
          onClick={() => setActiveVideo(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            onClick={() => setActiveVideo(null)}
          >
            Close
          </button>

          <video
            className="max-h-[90vh] max-w-[95vw] rounded-2xl bg-black shadow-2xl"
            controls
            autoPlay
            muted
            playsInline
            onClick={(event) => event.stopPropagation()}
          >
            <source src={activeVideo} type="video/mp4" />
          </video>
        </div>
      )}
    </div>
  );
}