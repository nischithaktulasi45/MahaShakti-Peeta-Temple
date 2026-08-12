import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { contentService } from "@/services/contentService";
import { adminService } from "@/services/adminService";

interface GalleryItem { _id: string; title: string; imageUrl: string; category: string; createdAt?: string; }
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
  const [activeTab, setActiveTab] = useState("dashboard");
  const [form, setForm] = useState({ title: "", description: "", imageUrl: "", category: "General", videoUrl: "", thumbnailUrl: "", date: "", time: "", location: "", contactInfo: "" });

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      setLocation("/admin/login");
      return;
    }

    const loadData = async () => {
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
    const [galleryRes, videoRes, eventRes, contactRes, donationRes] = await Promise.all([
      contentService.getGallery(),
      contentService.getVideos(),
      contentService.getEvents(),
      adminService.getContactMessages(),
      adminService.getDonationRecords(),
    ]);
    setGallery(galleryRes.data || []);
    setVideos(videoRes.data || []);
    setEvents(eventRes.data || []);
    setContactMessages(contactRes.data || []);
    setDonationRecords(donationRes.data || []);
    setLoading(false);
  };

  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    await contentService.createGallery({ title: form.title, description: form.description, imageUrl: form.imageUrl, category: form.category });
    setForm({ ...form, title: "", description: "", imageUrl: "", category: "General" });
    await refreshData();
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    await contentService.createVideo({ title: form.title, description: form.description, videoUrl: form.videoUrl, thumbnailUrl: form.thumbnailUrl });
    setForm({ ...form, title: "", description: "", videoUrl: "", thumbnailUrl: "" });
    await refreshData();
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    await contentService.createEvent({ title: form.title, description: form.description, date: form.date, startTime: form.time, location: form.location, contactInfo: form.contactInfo, category: form.category, imageUrl: form.imageUrl });
    setForm({ ...form, title: "", description: "", date: "", time: "", location: "", contactInfo: "", category: "General", imageUrl: "" });
    await refreshData();
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
                <h2 className="text-xl font-semibold">Add Gallery Photo</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <input className="rounded-xl border border-slate-700 bg-slate-800 p-3" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                  <input className="rounded-xl border border-slate-700 bg-slate-800 p-3" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                  <input className="rounded-xl border border-slate-700 bg-slate-800 p-3 md:col-span-2" placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} required />
                  <textarea className="rounded-xl border border-slate-700 bg-slate-800 p-3 md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <button className="mt-4 rounded-xl bg-[#D4AF37] px-4 py-2 font-semibold text-slate-900">Save Photo</button>
              </form>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold">Gallery Photos</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {gallery.map((item) => (
                    <div key={item._id} className="rounded-xl border border-slate-800 p-3">
                      {item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="h-40 w-full rounded-lg object-cover" /> : null}
                      <p className="mt-2 font-semibold">{item.title}</p>
                      <p className="text-sm text-slate-400">{item.category}</p>
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
                <h2 className="text-xl font-semibold">Add Progress Video</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <input className="rounded-xl border border-slate-700 bg-slate-800 p-3" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                  <input className="rounded-xl border border-slate-700 bg-slate-800 p-3" placeholder="Video URL" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} required />
                  <input className="rounded-xl border border-slate-700 bg-slate-800 p-3" placeholder="Thumbnail URL" value={form.thumbnailUrl} onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })} />
                  <textarea className="rounded-xl border border-slate-700 bg-slate-800 p-3 md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <button className="mt-4 rounded-xl bg-[#D4AF37] px-4 py-2 font-semibold text-slate-900">Save Video</button>
              </form>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold">Progress Videos</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {videos.map((item) => (
                    <div key={item._id} className="rounded-xl border border-slate-800 p-3">
                      <p className="font-semibold">{item.title}</p>
                      <p className="mt-2 text-sm text-slate-400">{item.videoUrl}</p>
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
                <h2 className="text-xl font-semibold">Add Event</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <input className="rounded-xl border border-slate-700 bg-slate-800 p-3" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                  <input className="rounded-xl border border-slate-700 bg-slate-800 p-3" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                  <input className="rounded-xl border border-slate-700 bg-slate-800 p-3" placeholder="Date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                  <input className="rounded-xl border border-slate-700 bg-slate-800 p-3" placeholder="Time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                  <input className="rounded-xl border border-slate-700 bg-slate-800 p-3" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                  <input className="rounded-xl border border-slate-700 bg-slate-800 p-3" placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
                  <textarea className="rounded-xl border border-slate-700 bg-slate-800 p-3 md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  <textarea className="rounded-xl border border-slate-700 bg-slate-800 p-3 md:col-span-2" placeholder="Contact Info" value={form.contactInfo} onChange={(e) => setForm({ ...form, contactInfo: e.target.value })} />
                </div>
                <button className="mt-4 rounded-xl bg-[#D4AF37] px-4 py-2 font-semibold text-slate-900">Save Event</button>
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
                    <p className="text-slate-400">No contact messages yet.</p>
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
