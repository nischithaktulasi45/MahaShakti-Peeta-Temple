import { useEffect, useMemo, useState } from "react";
import { contentService } from "@/services/contentService";
import { sortMediaByOrientation, type MediaOrientation } from "@/lib/mediaOrientation";

export default function ProgressGallery() {
  const [videos, setVideos] = useState<Array<{ _id: string; title: string; videoUrl: string }>>([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [orientations, setOrientations] = useState<Record<string, MediaOrientation>>({});

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const response = await contentService.getVideos();
        setVideos(response.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    loadVideos();
  }, []);

  const sortedVideos = useMemo(() => {
    return sortMediaByOrientation(videos, (video) => orientations[video._id]);
  }, [orientations, videos]);

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
            const orientation = orientations[video._id] || "landscape";
            const aspectClass =
              orientation === "portrait" ? "aspect-[9/16]" : "aspect-[16/9]";

            return (
              <article
                key={video._id}
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
                      const detectedOrientation: MediaOrientation =
                        media.videoWidth >= media.videoHeight ? "landscape" : "portrait";

                      setOrientations((current) =>
                        current[video._id] === detectedOrientation
                          ? current
                          : { ...current, [video._id]: detectedOrientation }
                      );
                    }}
                    onClick={() => setActiveVideo(video.videoUrl)}
                  >
                    <source src={video.videoUrl} type="video/mp4" />
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