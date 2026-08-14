import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { contentService } from "@/services/contentService";
import { adminService } from "@/services/adminService";

interface GalleryItem { _id: string; title: string; imageUrl: string; category: string; orientation?: "landscape" | "portrait" | "square" | "vertical"; createdAt?: string; }
interface ProgressVideo { _id: string; title: string; videoUrl: string; createdAt?: string; }
interface EventItem { _id: string; title: string; date: string; location: string; createdAt?: string; }
interface ContactMessage { _id: string; name: string; email: string; phone: string; subject: string; message: string; createdAt: string; }
interface DonationRecord { _id: string; name: string; email: string; phone: string; amount: number; purpose: string; utrNumber: string; paymentStatus: string; createdAt: string; }

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [videos, setVideos] = useState<ProgressVideo[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [donationRecords, setDonationRecords] = useState<DonationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactError, setContactError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [form, setForm] = useState({ tag: "", title: "", description: "", imageUrl: "", category: "General", videoUrl: "", thumbnailUrl: "", date: "", time: "", location: "", contactInfo: "" });

  const [eventSelectedFile, setEventSelectedFile] = useState<File | null>(null);
  const [eventPreviewUrl, setEventPreviewUrl] = useState<string>("");
  const [eventPreviewName, setEventPreviewName] = useState<string>("");
  const [eventPreviewDimensions, setEventPreviewDimensions] = useState<{ width: number; height: number } | null>(null);
  const [eventPreviewOrientation, setEventPreviewOrientation] = useState<"landscape" | "portrait" | "square" | "vertical" | "">("");
  const [eventPreviewError, setEventPreviewError] = useState<string | null>(null);
  const [eventImageBase64, setEventImageBase64] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [eventError, setEventError] = useState<string | null>(null);
  const [eventSuccess, setEventSuccess] = useState<string | null>(null);

  const [gallerySelectedFile, setGallerySelectedFile] = useState<File | null>(null);
  const [galleryPreviewUrl, setGalleryPreviewUrl] = useState<string>("");
  const [galleryPreviewName, setGalleryPreviewName] = useState<string>("");
  const [galleryPreviewDimensions, setGalleryPreviewDimensions] = useState<{ width: number; height: number } | null>(null);
  const [galleryPreviewOrientation, setGalleryPreviewOrientation] = useState<"landscape" | "portrait" | "square" | "vertical" | "">("");
  const [galleryPreviewError, setGalleryPreviewError] = useState<string | null>(null);
  const [galleryImageBase64, setGalleryImageBase64] = useState<string>("");

  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [selectedVideoPreviewUrl, setSelectedVideoPreviewUrl] = useState<string>("");
  const [orientation, setOrientation] = useState<"landscape" | "portrait" | "square" | "vertical" | "">("");
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoUploadStatus, setVideoUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [videoUploadError, setVideoUploadError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      setLocation("/admin/login");
      return;
    }

    const loadData = async () => {
      try {
        setContactError(null);
        const [galleryRes, videoRes, eventRes, contactRes, donationRes] = await Promise.all([
          contentService.getGallery(),
          contentService.getVideos(),
          contentService.getEvents(),
          adminService.getContactMessages(),
          adminService.getDonationRecords(),
        ]);
        setGallery(galleryRes || []);
        setVideos(videoRes || []);
        setEvents(eventRes || []);
        setContactMessages(contactRes?.data || []);
        setDonationRecords(donationRes?.data || []);
      } catch (error) {
        console.error(error);
        setContactError("Unable to load contact messages.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [setLocation]);

  const handleLogout = async () => {
    try {
      await adminService.logout();
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("admin-token");
      setLocation("/admin/login");
    }
  };

  const refreshData = async () => {
    setLoading(true);
    setContactError(null);
    try {
      const [galleryRes, videoRes, eventRes, contactRes, donationRes] = await Promise.all([
        contentService.getGallery(),
        contentService.getVideos(),
        contentService.getEvents(),
        adminService.getContactMessages(),
        adminService.getDonationRecords(),
      ]);
      setGallery(galleryRes || []);
      setVideos(videoRes || []);
      setEvents(eventRes || []);
      setContactMessages(contactRes?.data || []);
      setDonationRecords(donationRes?.data || []);
    } catch (error) {
      console.error(error);
      setContactError("Unable to refresh contact messages.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedVideoFile) {
      setVideoUploadError("Please select a video file before saving.");
      return;
    }

    if (!orientation) {
      setVideoUploadError("Please select the video orientation before saving.");
      return;
    }

    setVideoUploading(true);
    setVideoUploadError(null);
    setVideoUploadStatus("idle");

    try {
      const formData = new FormData();
      formData.append("file", selectedVideoFile);
      formData.append("orientation", orientation);

      const uploadRes = await contentService.uploadProgressVideo(formData);
      const videoUrl = uploadRes?.data?.videoUrl || "";
      const publicId = uploadRes?.data?.publicId || "";

      if (!videoUrl) {
        throw new Error("Upload failed");
      }

      const title = selectedVideoFile.name.replace(/\.[^/.]+$/, "") || "Progress Video";

      await contentService.createVideo({
        title,
        description: "",
        videoUrl,
        thumbnailUrl: "",
        publicId,
        orientation,
      });

      setVideoUploadStatus("success");
      setSelectedVideoFile(null);
      setOrientation("");

      if (selectedVideoPreviewUrl) {
        URL.revokeObjectURL(selectedVideoPreviewUrl);
      }
      setSelectedVideoPreviewUrl("");
      await refreshData();
    } catch (error) {
      console.error(error);
      setVideoUploadStatus("error");
      setVideoUploadError("Failed to save video");
    } finally {
      setVideoUploading(false);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setEventError("Please enter an event title.");
      setEventSuccess(null);
      return;
    }

    if (!form.description.trim()) {
      setEventError("Please enter an event description.");
      setEventSuccess(null);
      return;
    }

    if (!eventSelectedFile) {
      setEventError("Please select an event photo.");
      setEventSuccess(null);
      return;
    }

    setUploading(true);
    setEventError(null);
    setEventSuccess(null);

    try {
      const formData = new FormData();
      formData.append("file", eventSelectedFile);

      const uploadRes = await contentService.uploadEventImage(formData);
      const imageUrl = uploadRes?.data?.imageUrl || uploadRes?.imageUrl || "";

      if (!imageUrl) {
        throw new Error("Unable to upload the selected event photo.");
      }

      await contentService.createEvent({
        tag: form.tag.trim(),
        title: form.title.trim(),
        description: form.description.trim(),
        imageUrl,
        category: form.category || "General",
        date: form.date,
        startTime: form.time,
        location: form.location,
        contactInfo: form.contactInfo,
      });

      setForm({ ...form, tag: "", title: "", description: "", date: "", time: "", location: "", contactInfo: "", category: "General", imageUrl: "" });
      setEventSelectedFile(null);
      setEventPreviewUrl("");
      setEventPreviewName("");
      setEventPreviewDimensions(null);
      setEventPreviewOrientation("");
      setEventImageBase64("");
      setEventSuccess("Event saved successfully.");
      await refreshData();
    } catch (error) {
      console.error(error);
      setEventError("Unable to save event.");
    } finally {
      setUploading(false);
    }
  };

  const getOrientationFromDimensions = (dimensions: { width: number; height: number } | null) => {
    if (!dimensions) return "landscape" as const;
    const { width, height } = dimensions;
    if (width === height) return "square" as const;
    if (height / width >= 1.3) return "vertical" as const;
    if (height > width) return "portrait" as const;
    return "landscape" as const;
  };

  const handleEventFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setEventSelectedFile(null);
      setEventPreviewUrl("");
      setEventPreviewName("");
      setEventPreviewDimensions(null);
      setEventImageBase64("");
      setEventPreviewError(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setEventPreviewError("Please choose a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setEventSelectedFile(file);
        setEventPreviewUrl(result);
        setEventPreviewName(file.name);
        setEventImageBase64(result);
        setEventPreviewDimensions(null);
        setEventPreviewOrientation("");
        setEventPreviewError(null);
      }
    };
    reader.onerror = () => setEventPreviewError("Unable to read the selected image.");
    reader.readAsDataURL(file);
  };

  const handleGalleryFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setGallerySelectedFile(null);
      setGalleryPreviewUrl("");
      setGalleryPreviewName("");
      setGalleryPreviewDimensions(null);
      setGalleryImageBase64("");
      setGalleryPreviewError(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setGalleryPreviewError("Please choose a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setGallerySelectedFile(file);
        setGalleryPreviewUrl(result);
        setGalleryPreviewName(file.name);
        setGalleryImageBase64(result);
        setGalleryPreviewDimensions(null);
        setGalleryPreviewOrientation("");
        setGalleryPreviewError(null);
      }
    };
    reader.onerror = () => setGalleryPreviewError("Unable to read the selected image.");
    reader.readAsDataURL(file);
  };

  const handleVideoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      if (selectedVideoPreviewUrl) {
        URL.revokeObjectURL(selectedVideoPreviewUrl);
      }
      setSelectedVideoFile(null);
      setSelectedVideoPreviewUrl("");
      setOrientation("");
      setVideoUploadError(null);
      setVideoUploadStatus("idle");
      return;
    }

    if (!file.type.startsWith("video/")) {
      setVideoUploadError("Please choose a supported video file.");
      return;
    }

    if (selectedVideoPreviewUrl) {
      URL.revokeObjectURL(selectedVideoPreviewUrl);
    }

    setSelectedVideoFile(file);
    setSelectedVideoPreviewUrl(URL.createObjectURL(file));
    setOrientation("");
    setVideoUploadError(null);
    setVideoUploadStatus("idle");
  };

  const handleEventPreviewImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const media = event.currentTarget;
    const dimensions = { width: media.naturalWidth, height: media.naturalHeight };
    setEventPreviewDimensions(dimensions);
    if (!eventPreviewOrientation) {
      setEventPreviewOrientation(getOrientationFromDimensions(dimensions));
    }
  };

  const handleGalleryPreviewImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const media = event.currentTarget;
    const dimensions = { width: media.naturalWidth, height: media.naturalHeight };
    setGalleryPreviewDimensions(dimensions);
    if (!galleryPreviewOrientation) {
      setGalleryPreviewOrientation(getOrientationFromDimensions(dimensions));
    }
  };

  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setGalleryPreviewError(null);

    try {
      if (!gallerySelectedFile) {
        setGalleryPreviewError("Please select an image file before saving.");
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", gallerySelectedFile);

      const uploadRes = await contentService.uploadGalleryImage(formData);
      const imageUrl = uploadRes?.data?.imageUrl || "";
      const publicId = uploadRes?.data?.publicId;

      if (!imageUrl) {
        setGalleryPreviewError("Unable to upload the selected image.");
        setUploading(false);
        return;
      }

      const orientation = galleryPreviewOrientation || getOrientationFromDimensions(galleryPreviewDimensions);
      const title = gallerySelectedFile.name.replace(/\.[^/.]+$/, "") || "Gallery Photo";
      const category = "General";

      await contentService.createGallery({
        title,
        imageUrl,
        publicId,
        category,
        orientation,
      });

      setForm({ ...form, title: "", imageUrl: "", category: "General" });
      setGallerySelectedFile(null);
      setGalleryPreviewUrl("");
      setGalleryPreviewName("");
      setGalleryPreviewDimensions(null);
      setGalleryPreviewOrientation("");
      setGalleryImageBase64("");
      await refreshData();
    } catch (error) {
      console.error(error);
      setGalleryPreviewError("Unable to save gallery photo.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;
    await contentService.deleteGallery(id);
    await refreshData();
  };

  const handleDeleteVideo = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    await contentService.deleteVideo(id);
    await refreshData();
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    await contentService.deleteEvent(id);
    await refreshData();
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 p-8 text-white">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full bg-slate-900 p-6 lg:w-72">
          <h2 className="text-2xl font-semibold">Temple Admin</h2>
          <p className="mt-2 text-sm text-slate-400">Manage temple content</p>
          <nav className="mt-8 space-y-2">
            {[
              ["dashboard", "Dashboard"],
              ["contacts", "Contact Messages"],
              ["donations", "Donation Records"],
              ["gallery", "Gallery Photos"],
              ["videos", "Progress Videos"],
              ["events", "Events"],
            ].map(([key, label]) => (
              <button key={key} onClick={() => setActiveTab(key)} className={`block w-full rounded-xl px-4 py-3 text-left ${activeTab === key ? "bg-[#D4AF37] text-slate-900" : "bg-slate-800 text-slate-200"}`}>
                {label}
              </button>
            ))}
            <button onClick={handleLogout} className="mt-6 block w-full rounded-xl bg-red-600 px-4 py-3 text-left">Logout</button>
          </nav>
        </aside>

        <main className="flex-1 p-6 lg:p-10">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
              <p className="text-slate-400">Content is stored in MongoDB Atlas and reflected on the public site.</p>
            </div>
            <Link href="/" className="rounded-xl border border-slate-700 px-4 py-2 text-sm">View Site</Link>
          </div>

          {activeTab === "dashboard" && (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6"><p className="text-slate-400">Gallery Photos</p><p className="mt-3 text-4xl font-semibold">{gallery.length}</p></div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6"><p className="text-slate-400">Progress Videos</p><p className="mt-3 text-4xl font-semibold">{videos.length}</p></div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6"><p className="text-slate-400">Events</p><p className="mt-3 text-4xl font-semibold">{events.length}</p></div>
            </div>
          )}

          {activeTab === "gallery" && (
            <div className="space-y-6">
              <form onSubmit={handleAddGallery} className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold">Add Photo</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm text-slate-300">Select Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleGalleryFileChange}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-100"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm text-slate-300">Orientation</label>
                    <select
                      value={galleryPreviewOrientation || ""}
                      onChange={(e) => setGalleryPreviewOrientation(e.target.value as "landscape" | "portrait" | "square" | "vertical")}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-100"
                    >
                      <option value="">Auto detect from image</option>
                      <option value="landscape">Landscape</option>
                      <option value="portrait">Portrait</option>
                      <option value="square">Square</option>
                      <option value="vertical">Vertical</option>
                    </select>
                  </div>
                </div>
                {galleryPreviewError ? <p className="mt-4 text-sm text-red-400">{galleryPreviewError}</p> : null}
                {galleryPreviewUrl && (
                  <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
                    <p className="text-sm text-slate-400">Preview: {galleryPreviewName}</p>
                    <div className="mt-3 overflow-hidden rounded-xl bg-slate-900">
                      <img
                        src={galleryPreviewUrl}
                        alt={galleryPreviewName}
                        onLoad={handleGalleryPreviewImageLoad}
                        className="h-72 max-h-72 w-full object-contain"
                      />
                    </div>
                    <p className="mt-3 text-sm text-slate-400">Detected orientation: {galleryPreviewOrientation || getOrientationFromDimensions(galleryPreviewDimensions)}</p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={uploading || !gallerySelectedFile}
                  className="mt-4 rounded-xl bg-[#D4AF37] px-4 py-2 font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploading ? "Saving…" : "Save Photo"}
                </button>
              </form>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold">Gallery Photos</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {gallery.map((item) => (
                    <div key={item._id} className="rounded-xl border border-slate-800 p-3">
                      {item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="h-40 w-full rounded-lg object-cover" /> : null}
                      <p className="mt-2 font-semibold">{item.title}</p>
                      <p className="text-sm text-slate-400">{item.category}</p>
                      <p className="text-sm text-slate-400">Orientation: {item.orientation || "landscape"}</p>
                      <button onClick={() => handleDeleteGallery(item._id)} className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-sm">Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "videos" && (
            <div className="space-y-6">
              <form onSubmit={handleAddVideo} className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold">Add Video</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm text-slate-300">Select Video</label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFileChange}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-100"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm text-slate-300">Orientation</label>
                    <select
                      value={orientation || ""}
                      onChange={(e) => setOrientation(e.target.value as "landscape" | "portrait" | "square" | "vertical")}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-100"
                      required
                    >
                      <option value="">Select orientation</option>
                      <option value="landscape">Landscape</option>
                      <option value="portrait">Portrait</option>
                      <option value="square">Square</option>
                      <option value="vertical">Vertical</option>
                    </select>
                  </div>
                </div>

                {selectedVideoPreviewUrl && (
                  <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
                    <p className="text-sm text-slate-400">Video Preview</p>
                    <div className="mt-3 overflow-hidden rounded-xl bg-slate-900">
                      <video
                        src={selectedVideoPreviewUrl}
                        controls
                        className="h-72 max-h-72 w-full object-contain"
                      />
                    </div>
                  </div>
                )}

                {videoUploadError ? <p className="mt-4 text-sm text-red-400">{videoUploadError}</p> : null}
                {videoUploadStatus === "success" ? <p className="mt-4 text-sm text-emerald-400">Video saved successfully</p> : null}
                {videoUploadStatus === "error" ? <p className="mt-4 text-sm text-red-400">Failed to save video</p> : null}

                <button
                  type="submit"
                  disabled={videoUploading || !selectedVideoFile || !orientation}
                  className="mt-4 rounded-xl bg-[#D4AF37] px-4 py-2 font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {videoUploading ? "Uploading..." : "Save Video"}
                </button>
              </form>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold">Progress Videos</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {videos.map((item) => (
                    <div key={item._id} className="rounded-xl border border-slate-800 p-3">
                      <p className="font-semibold">{item.title}</p>
                      <p className="mt-2 text-sm text-slate-400 break-words">{item.videoUrl}</p>
                      <button onClick={() => handleDeleteVideo(item._id)} className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-sm">Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "events" && (
            <div className="space-y-6">
              <form onSubmit={handleAddEvent} className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold">ADD EVENT</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm text-slate-300">Tag (Optional)</label>
                    <input
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-100"
                      placeholder="Enter event tag"
                      value={form.tag}
                      onChange={(e) => setForm({ ...form, tag: e.target.value })}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm text-slate-300">Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEventFileChange}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-100"
                    />
                  </div>

                  {eventPreviewUrl && (
                    <div className="md:col-span-2 rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
                      <p className="text-sm text-slate-400">Photo Preview</p>
                      <div className="mt-3 overflow-hidden rounded-xl bg-slate-900">
                        <img src={eventPreviewUrl} alt="Event preview" className="h-72 max-h-72 w-full rounded-xl object-contain" onLoad={handleEventPreviewImageLoad} />
                      </div>
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm text-slate-300">Title</label>
                    <input
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-100"
                      placeholder="Enter event title"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm text-slate-300">Description</label>
                    <textarea
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-100"
                      placeholder="Enter event description"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={5}
                    />
                  </div>
                </div>

                {eventError ? <p className="mt-4 text-sm text-red-400">{eventError}</p> : null}
                {eventSuccess ? <p className="mt-4 text-sm text-emerald-400">{eventSuccess}</p> : null}
                {eventPreviewError ? <p className="mt-4 text-sm text-red-400">{eventPreviewError}</p> : null}

                <button type="submit" disabled={uploading} className="mt-4 rounded-xl bg-[#D4AF37] px-4 py-2 font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-60">
                  {uploading ? "Saving..." : "Save Event"}
                </button>
              </form>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold">Events</h2>
                <div className="mt-4 space-y-3">
                  {events.map((item) => (
                    <div key={item._id} className="flex items-center justify-between rounded-xl border border-slate-800 p-3">
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-sm text-slate-400">{item.date} • {item.location}</p>
                      </div>
                      <button onClick={() => handleDeleteEvent(item._id)} className="rounded-lg bg-red-600 px-3 py-2 text-sm">Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "contacts" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold">Contact Messages</h2>
                <div className="mt-4 divide-y divide-slate-800">
                  {contactMessages.length === 0 ? (
                    contactError ? (
                      <p className="text-red-400">{contactError}</p>
                    ) : (
                      <p className="text-slate-400">No contact messages yet.</p>
                    )
                  ) : (
                    contactMessages.map((message) => (
                      <div key={message._id} className="rounded-2xl border border-slate-800 p-4 even:bg-slate-950/50">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold">{message.name}</p>
                            <p className="text-sm text-slate-400">{new Date(message.createdAt).toLocaleString()}</p>
                          </div>
                          <div className="space-y-1 text-right text-sm text-slate-400">
                            <p>{message.email}</p>
                            <p>{message.phone}</p>
                          </div>
                        </div>
                        <div className="mt-3 space-y-2 text-sm text-slate-300">
                          <p><span className="font-semibold">Subject:</span> {message.subject}</p>
                          <p><span className="font-semibold">Message:</span> {message.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "donations" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold">Donation Records</h2>
                <div className="mt-4 divide-y divide-slate-800">
                  {donationRecords.length === 0 ? (
                    <p className="text-slate-400">No donation records yet.</p>
                  ) : (
                    donationRecords.map((record) => (
                      <div key={record._id} className="rounded-2xl border border-slate-800 p-4 even:bg-slate-950/50">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold">{record.name}</p>
                            <p className="text-sm text-slate-400">{new Date(record.createdAt).toLocaleString()}</p>
                          </div>
                          <div className="space-y-1 text-right text-sm text-slate-400">
                            <p>{record.email}</p>
                            <p>{record.phone}</p>
                          </div>
                        </div>
                        <div className="mt-3 grid gap-3 text-sm text-slate-300 md:grid-cols-2">
                          <p><span className="font-semibold">Amount:</span> ₹{record.amount}</p>
                          <p><span className="font-semibold">Status:</span> {record.paymentStatus}</p>
                          <p><span className="font-semibold">Purpose:</span> {record.purpose}</p>
                          <p><span className="font-semibold">UTR Number:</span> {record.utrNumber}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
