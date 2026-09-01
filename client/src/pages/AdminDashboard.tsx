import { useEffect, useState, type ChangeEvent, type FormEvent, type SyntheticEvent } from "react";
import { Link, useLocation } from "wouter";
import { contentService } from "@/services/contentService";
import { adminService } from "@/services/adminService";
import { getMediaAspectRatio, type MediaOrientation } from "@/lib/mediaOrientation";

interface GalleryItem {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  orientation?: "landscape" | "portrait" | "square" | "vertical";
  createdAt?: string;
}
interface ProgressVideo {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  orientation?: "landscape" | "portrait" | "square" | "vertical";
  createdAt?: string;
}
interface EventItem {
  _id: string;
  tag?: string;
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location: string;
  imageUrl?: string;
  category?: string;
  contactInfo?: string;
  createdAt?: string;
}
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
  const [pendingDelete, setPendingDelete] = useState<{ type: "gallery" | "video" | "event"; id: string } | null>(null);

  // ---------------------------------------------------------
  // Edit state
  // ---------------------------------------------------------
  const [editingType, setEditingType] = useState<"gallery" | "video" | "event" | null>(null);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [editingVideo, setEditingVideo] = useState<ProgressVideo | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      setLocation("/admin/login");
      return;
    }

    const loadData = async () => {
      setContactError(null);
      const [galleryRes, videoRes, eventRes, contactRes, donationRes] = await Promise.allSettled([
        contentService.getGallery(),
        contentService.getVideos(),
        contentService.getEvents(),
        adminService.getContactMessages(),
        adminService.getDonationRecords(),
      ]);

      if (galleryRes.status === "fulfilled") setGallery(galleryRes.value?.data || []);
      if (videoRes.status === "fulfilled") setVideos(videoRes.value?.data || []);
      if (eventRes.status === "fulfilled") setEvents(eventRes.value?.data || []);
      if (contactRes.status === "fulfilled") {
        setContactMessages(contactRes.value?.data || []);
      } else {
        console.error(contactRes.reason);
        setContactError("Unable to load contact messages.");
      }
      if (donationRes.status === "fulfilled") {
        setDonationRecords(donationRes.value?.data || []);
      } else {
        console.error(donationRes.reason);
      }

      setLoading(false);
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
    const [galleryRes, videoRes, eventRes, contactRes, donationRes] = await Promise.allSettled([
      contentService.getGallery(),
      contentService.getVideos(),
      contentService.getEvents(),
      adminService.getContactMessages(),
      adminService.getDonationRecords(),
    ]);

    if (galleryRes.status === "fulfilled") setGallery(galleryRes.value?.data || []);
    if (videoRes.status === "fulfilled") setVideos(videoRes.value?.data || []);
    if (eventRes.status === "fulfilled") setEvents(eventRes.value?.data || []);
    if (contactRes.status === "fulfilled") {
      setContactMessages(contactRes.value?.data || []);
    } else {
      console.error(contactRes.reason);
      setContactError("Unable to refresh contact messages.");
    }
    if (donationRes.status === "fulfilled") {
      setDonationRecords(donationRes.value?.data || []);
    } else {
      console.error(donationRes.reason);
    }

    setLoading(false);
  };

  const handleAddVideo = async (e: FormEvent) => {
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
    } catch (error: any) {
      console.error(error);
      setVideoUploadStatus("error");
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to save video";
      setVideoUploadError(errorMessage);
    } finally {
      setVideoUploading(false);
    }
  };

  const handleAddEvent = async (e: FormEvent) => {
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

  const getAspectRatio = (value?: GalleryItem["orientation"] | ProgressVideo["orientation"] | "") =>
    getMediaAspectRatio(value as MediaOrientation | undefined);

  const discardGalleryForm = () => {
    setGallerySelectedFile(null);
    setGalleryPreviewUrl("");
    setGalleryPreviewName("");
    setGalleryPreviewDimensions(null);
    setGalleryPreviewOrientation("");
    setGalleryPreviewError(null);
    setGalleryImageBase64("");
  };

  const discardVideoForm = () => {
    if (selectedVideoPreviewUrl) URL.revokeObjectURL(selectedVideoPreviewUrl);
    setSelectedVideoFile(null);
    setSelectedVideoPreviewUrl("");
    setOrientation("");
    setVideoUploadError(null);
    setVideoUploadStatus("idle");
  };

  const discardEventForm = () => {
    setForm({ tag: "", title: "", description: "", imageUrl: "", category: "General", videoUrl: "", thumbnailUrl: "", date: "", time: "", location: "", contactInfo: "" });
    setEventSelectedFile(null);
    setEventPreviewUrl("");
    setEventPreviewName("");
    setEventPreviewDimensions(null);
    setEventPreviewOrientation("");
    setEventPreviewError(null);
    setEventImageBase64("");
    setEventError(null);
    setEventSuccess(null);
  };

  const handleEventFileChange = (event: ChangeEvent<HTMLInputElement>) => {
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

  const handleGalleryFileChange = (event: ChangeEvent<HTMLInputElement>) => {
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

  const handleVideoFileChange = (event: ChangeEvent<HTMLInputElement>) => {
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

  const handleEventPreviewImageLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const media = event.currentTarget;
    const dimensions = { width: media.naturalWidth, height: media.naturalHeight };
    setEventPreviewDimensions(dimensions);
    if (!eventPreviewOrientation) {
      setEventPreviewOrientation(getOrientationFromDimensions(dimensions));
    }
  };

  const handleGalleryPreviewImageLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const media = event.currentTarget;
    const dimensions = { width: media.naturalWidth, height: media.naturalHeight };
    setGalleryPreviewDimensions(dimensions);
    if (!galleryPreviewOrientation) {
      setGalleryPreviewOrientation(getOrientationFromDimensions(dimensions));
    }
  };

  const handleAddGallery = async (e: FormEvent) => {
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

  const startGalleryEdit = (item: GalleryItem) => {
    setEditingType("gallery");
    setEditingGallery({ ...item });
    setEditingVideo(null);
    setEditingEvent(null);
    setEditError(null);
  };

  const startVideoEdit = (item: ProgressVideo) => {
    setEditingType("video");
    setEditingVideo({ ...item });
    setEditingGallery(null);
    setEditingEvent(null);
    setEditError(null);
  };

  const startEventEdit = (item: EventItem) => {
    setEditingType("event");
    setEditingEvent({ ...item });
    setEditingGallery(null);
    setEditingVideo(null);
    setEditError(null);
  };

  const closeEditModal = () => {
    if (editSaving) return;
    setEditingType(null);
    setEditingGallery(null);
    setEditingVideo(null);
    setEditingEvent(null);
    setEditError(null);
  };

  const saveEditedContent = async () => {
    if (!editingType) return;

    setEditSaving(true);
    setEditError(null);

    try {
      const editableService = contentService as typeof contentService & {
        updateGallery?: (id: string, payload: Record<string, unknown>) => Promise<unknown>;
        updateVideo?: (id: string, payload: Record<string, unknown>) => Promise<unknown>;
      };

      if (editingType === "gallery" && editingGallery) {
        if (!editableService.updateGallery) {
          throw new Error("contentService.updateGallery is not available.");
        }

        await editableService.updateGallery(editingGallery._id, {
          title: editingGallery.title.trim(),
          description: editingGallery.description || "",
          category: editingGallery.category || "General",
          orientation: editingGallery.orientation || "landscape",
        });
      }

      if (editingType === "video" && editingVideo) {
        if (!editableService.updateVideo) {
          throw new Error("contentService.updateVideo is not available.");
        }

        await editableService.updateVideo(editingVideo._id, {
          title: editingVideo.title.trim(),
          description: editingVideo.description || "",
          thumbnailUrl: editingVideo.thumbnailUrl || "",
          orientation: editingVideo.orientation || "landscape",
        });
      }

      if (editingType === "event" && editingEvent) {
        await contentService.updateEvent(editingEvent._id, {
          tag: editingEvent.tag || "",
          title: editingEvent.title.trim(),
          description: editingEvent.description || "",
          date: editingEvent.date || "",
          startTime: editingEvent.startTime || "",
          endTime: editingEvent.endTime || "",
          location: editingEvent.location || "",
          imageUrl: editingEvent.imageUrl || "",
          category: editingEvent.category || "General",
          contactInfo: editingEvent.contactInfo || "",
        });
      }

      await refreshData();
      closeEditModal();
    } catch (error) {
      console.error("Failed to save edited content:", error);
      setEditError(
        error instanceof Error
          ? error.message
          : "Unable to save the changes. Please try again."
      );
    } finally {
      setEditSaving(false);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    await contentService.deleteGallery(id);
    await refreshData();
    setPendingDelete(null);
  };

  const handleDeleteVideo = async (id: string) => {
    await contentService.deleteVideo(id);
    await refreshData();
    setPendingDelete(null);
  };

  const handleDeleteEvent = async (id: string) => {
    await contentService.deleteEvent(id);
    await refreshData();
    setPendingDelete(null);
  };

  const handleDeleteContactMessage = async (id: string) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this contact submission?"
  );

  if (!confirmed) return;

  try {
    await adminService.deleteContactMessage(id);
    await refreshData();
  } catch (error) {
    console.error("Failed to delete contact message:", error);
    alert("Unable to delete the contact submission.");
  }
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
                    <div className="mx-auto mt-3 max-h-[min(60vh,32rem)] w-full max-w-md overflow-hidden rounded-xl bg-slate-900" style={{ aspectRatio: getAspectRatio(galleryPreviewOrientation || getOrientationFromDimensions(galleryPreviewDimensions)) }}>
                      <img
                        src={galleryPreviewUrl}
                        alt={galleryPreviewName}
                        onLoad={handleGalleryPreviewImageLoad}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="mt-3 text-sm text-slate-400">Detected orientation: {galleryPreviewOrientation || getOrientationFromDimensions(galleryPreviewDimensions)}</p>
                  </div>
                )}
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={uploading || !gallerySelectedFile}
                    className="rounded-xl bg-[#D4AF37] px-4 py-2 font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {uploading ? "Saving…" : "Save Photo"}
                  </button>
                  <button type="button" onClick={discardGalleryForm} className="rounded-xl border border-red-400/60 px-4 py-2 font-semibold text-red-300 transition-colors hover:bg-red-500/10">
                    Discard
                  </button>
                </div>
              </form>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold">Gallery Photos</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {gallery.map((item) => (
                    <div key={item._id} className="min-w-0 rounded-xl border border-slate-800 p-3">
                      {item.imageUrl ? <div className="w-full overflow-hidden rounded-lg bg-slate-950" style={{ aspectRatio: getAspectRatio(item.orientation) }}><img src={item.imageUrl} alt={item.title} className="h-full w-full object-contain" /></div> : null}
                      <p className="mt-2 break-words font-semibold">{item.title}</p>
                      <p className="text-sm text-slate-400">{item.category}</p>
                      <p className="text-sm text-slate-400">Orientation: {item.orientation || "landscape"}</p>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => startGalleryEdit(item)}
                          className="rounded-lg bg-[#D4AF37] px-3 py-2 text-sm font-semibold text-slate-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setPendingDelete({ type: "gallery", id: item._id })}
                          className="rounded-lg bg-red-600 px-3 py-2 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                      {pendingDelete?.type === "gallery" && pendingDelete.id === item._id ? (
                        <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                          <p>Are you sure you want to delete this photo?</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <button type="button" onClick={() => handleDeleteGallery(item._id)} className="rounded-md bg-red-600 px-3 py-2 font-semibold text-white">Confirm Delete</button>
                            <button type="button" onClick={() => setPendingDelete(null)} className="rounded-md border border-slate-600 px-3 py-2 text-slate-200">Cancel</button>
                          </div>
                        </div>
                      ) : null}
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

                {(selectedVideoPreviewUrl || orientation) && (
                  <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
                    <p className="text-sm text-slate-400">Video Preview</p>
                    <div
                      className="mx-auto mt-3 max-h-[min(60vh,32rem)] w-full max-w-md overflow-hidden rounded-xl bg-slate-900"
                      style={{
                        aspectRatio: getAspectRatio(orientation),
                      }}
                    >
                      {selectedVideoPreviewUrl ? (
                        <video
                          src={selectedVideoPreviewUrl}
                          controls
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                  </div>
                )}

                {videoUploadError ? <p className="mt-4 text-sm text-red-400">{videoUploadError}</p> : null}
                {videoUploadStatus === "success" ? <p className="mt-4 text-sm text-emerald-400">Video saved successfully</p> : null}

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={videoUploading || !selectedVideoFile || !orientation}
                    className="rounded-xl bg-[#D4AF37] px-4 py-2 font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {videoUploading ? "Uploading..." : "Save Video"}
                  </button>
                  <button type="button" onClick={discardVideoForm} className="rounded-xl border border-red-400/60 px-4 py-2 font-semibold text-red-300 transition-colors hover:bg-red-500/10">
                    Discard
                  </button>
                </div>
              </form>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold">Progress Videos</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {videos.map((item) => (
                    <div key={item._id} className="min-w-0 rounded-xl border border-slate-800 p-3">
                      <p className="break-words font-semibold">{item.title}</p>
                      <div className="mt-2 w-full max-w-md overflow-hidden rounded-lg bg-slate-950" style={{ aspectRatio: getAspectRatio(item.orientation) }}><video src={item.videoUrl} controls className="h-full w-full object-contain" /></div>
                      <p className="mt-2 text-sm text-slate-400 break-words">{item.videoUrl}</p>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => startVideoEdit(item)}
                          className="rounded-lg bg-[#D4AF37] px-3 py-2 text-sm font-semibold text-slate-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setPendingDelete({ type: "video", id: item._id })}
                          className="rounded-lg bg-red-600 px-3 py-2 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                      {pendingDelete?.type === "video" && pendingDelete.id === item._id ? (
                        <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                          <p>Are you sure you want to delete this video?</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <button type="button" onClick={() => handleDeleteVideo(item._id)} className="rounded-md bg-red-600 px-3 py-2 font-semibold text-white">Confirm Delete</button>
                            <button type="button" onClick={() => setPendingDelete(null)} className="rounded-md border border-slate-600 px-3 py-2 text-slate-200">Cancel</button>
                          </div>
                        </div>
                      ) : null}
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
                      <div className="mx-auto mt-3 max-h-[min(45vh,24rem)] w-full max-w-md overflow-hidden rounded-xl bg-slate-900" style={{ aspectRatio: getAspectRatio(eventPreviewOrientation || getOrientationFromDimensions(eventPreviewDimensions)) }}>
                        <img src={eventPreviewUrl} alt="Event preview" className="h-full w-full rounded-xl object-contain" onLoad={handleEventPreviewImageLoad} />
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

                {(form.title || form.description || eventPreviewUrl) && (
                  <div className="mt-5 min-w-0 overflow-hidden rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
                    <p className="text-sm text-slate-400">Event Preview</p>
                    <div className="mt-3 overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
                      {eventPreviewUrl ? <div className="h-40 w-full overflow-hidden bg-slate-950"><img src={eventPreviewUrl} alt="" className="h-full w-full object-contain" /></div> : null}
                      <div className="min-w-0 p-4">
                        <p className="break-words text-lg font-semibold text-white">{form.title || "Event title"}</p>
                        <p className="mt-2 break-words text-sm leading-6 text-slate-300">{form.description || "Event description"}</p>
                      </div>
                    </div>
                  </div>
                )}

                {eventError ? <p className="mt-4 text-sm text-red-400">{eventError}</p> : null}
                {eventSuccess ? <p className="mt-4 text-sm text-emerald-400">{eventSuccess}</p> : null}
                {eventPreviewError ? <p className="mt-4 text-sm text-red-400">{eventPreviewError}</p> : null}

                <div className="mt-4 flex flex-wrap gap-3">
                  <button type="submit" disabled={uploading} className="rounded-xl bg-[#D4AF37] px-4 py-2 font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-60">
                    {uploading ? "Saving..." : "Save Event"}
                  </button>
                  <button type="button" onClick={discardEventForm} className="rounded-xl border border-red-400/60 px-4 py-2 font-semibold text-red-300 transition-colors hover:bg-red-500/10">
                    Discard
                  </button>
                </div>
              </form>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold">Events</h2>
                <div className="mt-4 space-y-3">
                  {events.map((item) => (
                    <div key={item._id} className="flex min-w-0 flex-wrap items-start justify-between gap-3 rounded-xl border border-slate-800 p-3">
                      <div className="min-w-0">
                        {item.imageUrl ? <div className="mb-3 h-32 w-full max-w-xs overflow-hidden rounded-lg bg-slate-950"><img src={item.imageUrl} alt={item.title} className="h-full w-full object-contain" /></div> : null}
                        <p className="break-words font-semibold">{item.title}</p>
                        <p className="break-words text-sm text-slate-400">{item.date} • {item.location}</p>
                        <p className="mt-2 break-words text-sm text-slate-300">{item.description}</p>
                      </div>
                      <div className="flex shrink-0 flex-wrap gap-2">
                        <button
                          onClick={() => startEventEdit(item)}
                          className="rounded-lg bg-[#D4AF37] px-3 py-2 text-sm font-semibold text-slate-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setPendingDelete({ type: "event", id: item._id })}
                          className="rounded-lg bg-red-600 px-3 py-2 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                      {pendingDelete?.type === "event" && pendingDelete.id === item._id ? (
                        <div className="w-full rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                          <p>Are you sure you want to delete this event?</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <button type="button" onClick={() => handleDeleteEvent(item._id)} className="rounded-md bg-red-600 px-3 py-2 font-semibold text-white">Confirm Delete</button>
                            <button type="button" onClick={() => setPendingDelete(null)} className="rounded-md border border-slate-600 px-3 py-2 text-slate-200">Cancel</button>
                          </div>
                        </div>
                      ) : null}
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
                            <p translate="no" className="notranslate text-sm text-slate-400">{new Date(message.createdAt).toLocaleString()}</p>
                          </div>
                          <div className="space-y-1 text-right text-sm text-slate-400">
                            <p translate="no" className="notranslate">{message.email}</p>
                            <p translate="no" className="notranslate">{message.phone}</p>
                          </div>
                        </div>
                        <div className="mt-3 space-y-2 text-sm text-slate-300">
                          <p><span className="font-semibold">Subject:</span> {message.subject}</p>
                          <p><span className="font-semibold">Message:</span> {message.message}</p>
                        </div>
                        <div className="mt-4 flex justify-end">
  <button
    type="button"
    onClick={() => handleDeleteContactMessage(message._id)}
    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
  >
    Delete
  </button>
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
                            <p translate="no" className="notranslate text-sm text-slate-400">{new Date(record.createdAt).toLocaleString()}</p>
                          </div>
                          <div className="space-y-1 text-right text-sm text-slate-400">
                            <p translate="no" className="notranslate">{record.email}</p>
                            <p translate="no" className="notranslate">{record.phone}</p>
                          </div>
                        </div>
                        <div className="mt-3 grid gap-3 text-sm text-slate-300 md:grid-cols-2">
                          <p><span className="font-semibold">Amount:</span> <span translate="no" className="notranslate">₹{record.amount}</span></p>
                          <p><span className="font-semibold">Status:</span> {record.paymentStatus}</p>
                          <p><span className="font-semibold">Purpose:</span> {record.purpose}</p>
                          <p><span className="font-semibold">UTR Number:</span> <span translate="no" className="notranslate">{record.utrNumber}</span></p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
          

          {editingType && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
              <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                      Admin Editor
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold">
                      Edit {editingType === "gallery" ? "Gallery Photo" : editingType === "video" ? "Progress Video" : "Event"}
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                      Changes are saved to the backend and will appear on the public site after refresh.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeEditModal}
                    disabled={editSaving}
                    className="rounded-lg border border-slate-700 px-3 py-2 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                  >
                    ✕
                  </button>
                </div>

                {editError ? (
                  <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                    {editError}
                  </div>
                ) : null}

                {editingType === "gallery" && editingGallery && (
                  <div className="mt-6 space-y-4">
                    {editingGallery.imageUrl ? (
                      <div className="mx-auto max-h-[min(45vh,24rem)] w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-950" style={{ aspectRatio: getAspectRatio(editingGallery.orientation) }}>
                        <img
                          src={editingGallery.imageUrl}
                          alt={editingGallery.title}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    ) : null}

                    <div>
                      <label className="mb-2 block text-sm text-slate-300">Title</label>
                      <input
                        value={editingGallery.title}
                        onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-100 outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-slate-300">Description</label>
                      <textarea
                        value={editingGallery.description || ""}
                        onChange={(e) => setEditingGallery({ ...editingGallery, description: e.target.value })}
                        rows={4}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-100 outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm text-slate-300">Category</label>
                        <input
                          value={editingGallery.category || "General"}
                          onChange={(e) => setEditingGallery({ ...editingGallery, category: e.target.value })}
                          className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-100 outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm text-slate-300">Orientation</label>
                        <select
                          value={editingGallery.orientation || "landscape"}
                          onChange={(e) => setEditingGallery({ ...editingGallery, orientation: e.target.value as GalleryItem["orientation"] })}
                          className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-100 outline-none focus:border-[#D4AF37]"
                        >
                          <option value="landscape">Landscape</option>
                          <option value="portrait">Portrait</option>
                          <option value="square">Square</option>
                          <option value="vertical">Vertical</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {editingType === "video" && editingVideo && (
                  <div className="mt-6 space-y-4">
                    <div className="mx-auto max-h-[min(45vh,24rem)] w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-950" style={{ aspectRatio: getAspectRatio(editingVideo.orientation) }}>
                      <video src={editingVideo.videoUrl} controls className="h-full w-full object-contain" />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-slate-300">Title</label>
                      <input
                        value={editingVideo.title}
                        onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-100 outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-slate-300">Description</label>
                      <textarea
                        value={editingVideo.description || ""}
                        onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                        rows={4}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-100 outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm text-slate-300">Thumbnail URL</label>
                        <input
                          value={editingVideo.thumbnailUrl || ""}
                          onChange={(e) => setEditingVideo({ ...editingVideo, thumbnailUrl: e.target.value })}
                          placeholder="Optional thumbnail URL"
                          className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-100 outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm text-slate-300">Orientation</label>
                        <select
                          value={editingVideo.orientation || "landscape"}
                          onChange={(e) => setEditingVideo({ ...editingVideo, orientation: e.target.value as ProgressVideo["orientation"] })}
                          className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-100 outline-none focus:border-[#D4AF37]"
                        >
                          <option value="landscape">Landscape</option>
                          <option value="portrait">Portrait</option>
                          <option value="square">Square</option>
                          <option value="vertical">Vertical</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {editingType === "event" && editingEvent && (
                  <div className="mt-6 space-y-4">
                    {editingEvent.imageUrl ? (
                      <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
                        <img
                          src={editingEvent.imageUrl}
                          alt={editingEvent.title}
                          className="h-56 max-h-56 w-full object-contain"
                        />
                      </div>
                    ) : null}
                    <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <p className="break-words text-lg font-semibold text-white">{editingEvent.title || "Event title"}</p>
                      <p className="mt-2 break-words text-sm leading-6 text-slate-300">{editingEvent.description || "Event description"}</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm text-slate-300">Tag</label>
                        <input
                          value={editingEvent.tag || ""}
                          onChange={(e) => setEditingEvent({ ...editingEvent, tag: e.target.value })}
                          className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-100 outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm text-slate-300">Category</label>
                        <input
                          value={editingEvent.category || "General"}
                          onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                          className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-100 outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-slate-300">Title</label>
                      <input
                        value={editingEvent.title}
                        onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-100 outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-slate-300">Description</label>
                      <textarea
                        value={editingEvent.description || ""}
                        onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                        rows={4}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-100 outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm text-slate-300">Date</label>
                        <input
                          type="date"
                          value={editingEvent.date || ""}
                          onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                          className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-100 outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm text-slate-300">Location</label>
                        <input
                          value={editingEvent.location || ""}
                          onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                          className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-100 outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm text-slate-300">Start Time</label>
                        <input
                          type="time"
                          value={editingEvent.startTime || ""}
                          onChange={(e) => setEditingEvent({ ...editingEvent, startTime: e.target.value })}
                          className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-100 outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm text-slate-300">End Time</label>
                        <input
                          type="time"
                          value={editingEvent.endTime || ""}
                          onChange={(e) => setEditingEvent({ ...editingEvent, endTime: e.target.value })}
                          className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-100 outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-slate-300">Contact Information</label>
                      <input
                        value={editingEvent.contactInfo || ""}
                        onChange={(e) => setEditingEvent({ ...editingEvent, contactInfo: e.target.value })}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-100 outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end gap-3 border-t border-slate-800 pt-5">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    disabled={editSaving}
                    className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveEditedContent}
                    disabled={editSaving}
                    className="rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {editSaving ? "Saving Changes..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}