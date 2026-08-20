import { useEffect, useMemo, useState } from "react";
import { contentService } from "@/services/contentService";
import { sortMediaByOrientation, type MediaOrientation } from "@/lib/mediaOrientation";

interface ProgressVideo { _id: string; title: string; videoUrl: string; orientation?: MediaOrientation; }

const DEFAULT_PROGRESS_VIDEOS: ProgressVideo[] = Array.from({ length: 20 }, (_, i) => ({
  _id: `default-video-${i + 1}`,
  title: `Progress Video ${i + 1}`,
  videoUrl: `/progress/video${i + 1}.mp4`,
  orientation: "landscape" as const,
}));

export default function ProgressGallery() {
  const [videos, setVideos] = useState<ProgressVideo[]>(DEFAULT_PROGRESS_VIDEOS);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [orientations, setOrientations] = useState<Record<string, MediaOrientation>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await contentService.getVideos();
        const responseData = Array.isArray(response?.data) && response.data.length > 0 ? response.data : DEFAULT_PROGRESS_VIDEOS;
        setVideos(responseData);
      } catch (err) {
        console.error("Failed to load progress gallery videos from server, using defaults:", err);
        setVideos(DEFAULT_PROGRESS_VIDEOS);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  const sortedVideos = useMemo(() => {
    return sortMediaByOrientation(videos, (video) => video.orientation || orientations[video._id]);
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

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-600 shadow-sm">
            Loading videos...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center text-sm text-red-700">
            {error}
          </div>
        ) : sortedVideos.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-600 shadow-sm">
            No videos available.
          </div>
        ) : (
          <div className="grid max-w-full gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedVideos.map((video) => {
              const orientation = video.orientation || orientations[video._id] || "landscape";
              const aspectStyle =
                orientation === "portrait"
                  ? { aspectRatio: "9 / 16" }
                  : orientation === "square"
                  ? { aspectRatio: "1 / 1" }
                  : orientation === "vertical"
                  ? { aspectRatio: "9 / 16" }
                  : { aspectRatio: "16 / 9" };

              return (
                <article
                  key={video._id}
                  className="max-w-full overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(8,60,120,0.12)] ring-1 ring-slate-200/70 transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="relative w-full overflow-hidden bg-slate-50" style={aspectStyle}>
                    <video
                      className="absolute inset-0 h-full w-full max-w-full cursor-pointer object-contain"
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
        )}
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