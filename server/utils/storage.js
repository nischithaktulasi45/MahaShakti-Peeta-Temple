const bcrypt = require("bcryptjs");
const { randomUUID } = require("crypto");
const mongoose = require("mongoose");

const Admin = require("../models/Admin");
const GalleryPhoto = require("../models/GalleryPhoto");
const ProgressVideo = require("../models/ProgressVideo");
const TempleEvent = require("../models/TempleEvent");

const memoryState = {
  gallery: [],
  videos: [],
  events: [],
  admins: [],
};

const isDatabaseReady = () => mongoose.connection.readyState === 1;

// ---------------------------------------------------------
// ADMIN
// ---------------------------------------------------------

const getDefaultAdminSeed = async () => {
  const email = (
    process.env.ADMIN_EMAIL || "admin@temple.com"
  ).toLowerCase();

  const passwordHash = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "Admin@1234",
    10
  );

  if (!memoryState.admins.some((admin) => admin.email === email)) {
    memoryState.admins.push({
      _id: randomUUID(),
      name: process.env.ADMIN_NAME || "Temple Admin",
      email,
      passwordHash,
      role: "admin",
      createdAt: new Date().toISOString(),
      isVerified: true,
    });
  }

  return memoryState.admins.find(
    (admin) => admin.email === email
  );
};

const createDefaultAdminIfNeeded = async () => {
  const email = (
    process.env.ADMIN_EMAIL || "admin@temple.com"
  ).toLowerCase();

  const name = process.env.ADMIN_NAME || "Temple Admin";

  const passwordHash = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "Admin@1234",
    10
  );

  if (isDatabaseReady()) {
    let admin = await Admin.findOne({ email });

    if (!admin) {
      admin = await Admin.create({
        name,
        email,
        passwordHash,
        role: "admin",
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiresAt: null,
      });

      console.log(
        `Default admin account created in MongoDB: ${email}`
      );

      return {
        admin,
        created: true,
      };
    }

    if (
      admin.isVerified === undefined ||
      admin.isVerified === null
    ) {
      admin.isVerified = true;
      admin.verificationToken = null;
      admin.verificationTokenExpiresAt = null;

      await admin.save();
    }

    return {
      admin,
      created: false,
    };
  }

  return getDefaultAdminSeed();
};

// ---------------------------------------------------------
// DEFAULT CONTENT
// ---------------------------------------------------------

const seedDefaultContentIfNeeded = async () => {
  if (memoryState.gallery.length === 0) {
    const galleryItems = [
      {
        title: "Temple Gallery 1",
        imageUrl: "/image/page_1.jpg",
        category: "General",
      },
      {
        title: "Temple Gallery 2",
        imageUrl: "/image/page_2.jpg",
        category: "General",
      },
      {
        title: "Temple Gallery 3",
        imageUrl: "/image/page_3.jpg",
        category: "General",
      },
      {
        title: "Temple Gallery 4",
        imageUrl: "/image/page_4.jpg",
        category: "General",
      },
      {
        title: "Temple Gallery 5",
        imageUrl: "/image/page_5.jpg",
        category: "General",
      },
      {
        title: "Temple Gallery 6",
        imageUrl: "/image/page_6.jpg",
        category: "General",
      },
      {
        title: "Temple Gallery 7",
        imageUrl: "/image/page_7.jpg",
        category: "General",
      },
      {
        title: "Temple Gallery 8",
        imageUrl: "/image/page_8.jpg",
        category: "General",
      },
      {
        title: "Temple Gallery 9",
        imageUrl: "/image/page_9.jpg",
        category: "General",
      },
      {
        title: "Temple Gallery 10",
        imageUrl: "/image/page_10.jpg",
        category: "General",
      },
      {
        title: "Temple Gallery 11",
        imageUrl: "/image/page_11.jpg",
        category: "General",
      },
      {
        title: "Temple Gallery 12",
        imageUrl: "/image/page_12.jpg",
        category: "General",
      },
      {
        title: "Temple Photo 1",
        imageUrl: "/image/photo1.jpeg",
        category: "General",
      },
      {
        title: "Temple Photo 2",
        imageUrl: "/image/photo2.jpeg",
        category: "General",
      },
      {
        title: "Temple Photo 3",
        imageUrl: "/image/photo3.jpeg",
        category: "General",
      },
      {
        title: "Temple Photo 4",
        imageUrl: "/image/photo4.jpeg",
        category: "General",
      },
      {
        title: "Temple Photo 5",
        imageUrl: "/image/photo5.jpeg",
        category: "General",
      },
      {
        title: "Temple Photo 6",
        imageUrl: "/image/photo6.jpeg",
        category: "General",
      },
      {
        title: "Temple Photo 7",
        imageUrl: "/image/photo7.jpeg",
        category: "General",
      },
      {
        title: "Temple Photo 8",
        imageUrl: "/image/photo8.jpeg",
        category: "General",
      },
      {
        title: "Temple Photo 9",
        imageUrl: "/image/photo9.jpeg",
        category: "General",
      },
      {
        title: "Temple Photo 10",
        imageUrl: "/image/photo10.jpeg",
        category: "General",
      },
    ];

    if (isDatabaseReady()) {
  for (const item of galleryItems) {
    await GalleryPhoto.updateOne(
      {
        imageUrl: item.imageUrl,
      },
      {
        $setOnInsert: {
          title: item.title,
          description: "",
          imageUrl: item.imageUrl,
          publicId: "",
          category: item.category || "General",
          orientation: "landscape",
          source: "default",
        },
      },
      {
        upsert: true,
      }
    );
  }
}

galleryItems.forEach((item) => {
  createGalleryPhotoRecord({
    ...item,
    source: "default",
  });
});
  }

  if (memoryState.videos.length === 0) {
    const videoItems = [
      { title: "Progress Video 1", videoUrl: "/progress/video1.mp4" },
      { title: "Progress Video 2", videoUrl: "/progress/video2.mp4" },
      { title: "Progress Video 3", videoUrl: "/progress/video3.mp4" },
      { title: "Progress Video 4", videoUrl: "/progress/video4.mp4" },
      { title: "Progress Video 5", videoUrl: "/progress/video5.mp4" },
      { title: "Progress Video 6", videoUrl: "/progress/video6.mp4" },
      { title: "Progress Video 7", videoUrl: "/progress/video7.mp4" },
      { title: "Progress Video 8", videoUrl: "/progress/video8.mp4" },
      { title: "Progress Video 9", videoUrl: "/progress/video9.mp4" },
      { title: "Progress Video 10", videoUrl: "/progress/video10.mp4" },
      { title: "Progress Video 11", videoUrl: "/progress/video11.mp4" },
      { title: "Progress Video 12", videoUrl: "/progress/video12.mp4" },
      { title: "Progress Video 13", videoUrl: "/progress/video13.mp4" },
      { title: "Progress Video 14", videoUrl: "/progress/video14.mp4" },
      { title: "Progress Video 15", videoUrl: "/progress/video15.mp4" },
      { title: "Progress Video 16", videoUrl: "/progress/video16.mp4" },
      { title: "Progress Video 17", videoUrl: "/progress/video17.mp4" },
      { title: "Progress Video 18", videoUrl: "/progress/video18.mp4" },
      { title: "Progress Video 19", videoUrl: "/progress/video19.mp4" },
      { title: "Progress Video 20", videoUrl: "/progress/video20.mp4" },
    ];

    videoItems.forEach((item) => {
      createProgressVideoRecord(item);
    });
  }

  if (memoryState.events.length === 0) {
    const eventItems = [
      {
        title: "Sidda Kannina Hani",
        description:
          "A compassionate community service focused on health, care, and village welfare.",
        tag: "Community Service",
        imageUrl: "/images/events/Sidda.jpeg",
      },
      {
        title: "Blood Donation",
        description:
          "A life-saving humanitarian initiative open to all who wish to serve others.",
        tag: "Health",
        imageUrl: "/images/events/blood.jpg",
      },
      {
        title: "Arogya Shibira",
        description:
          "A wellness camp dedicated to prevention, screening, and health awareness.",
        tag: "Health Camp",
        imageUrl: "/images/events/health.png",
      },
      {
        title: "Book Donation",
        description:
          "An educational and cultural outreach program encouraging reading and learning.",
        tag: "Education",
        imageUrl: "/images/events/book.jpg",
      },
      {
        title: "Tree Plantation",
        description:
          "A green initiative promoting environmental responsibility and collective care.",
        tag: "Environment",
        imageUrl: "/images/events/tree.jpg",
      },
      {
        title: "Vadya Ghoshi",
        description:
          "A devotional musical gathering celebrating bhakti, rhythm, and temple culture.",
        tag: "Cultural",
        imageUrl: "/images/events/vadya.jpg",
      },
      {
        title: "Dasoha",
        description:
          "The sacred temple serving of food and seva offered as a blessing to all visitors.",
        tag: "Seva",
        imageUrl: "/images/events/dasoha.avif",
      },
    ];

    if (isDatabaseReady()) {
      const existingEventCount =
        await TempleEvent.countDocuments();

      if (existingEventCount === 0) {
        await TempleEvent.insertMany(
          eventItems.map((item) => ({
            ...item,
            date: "",
            startTime: "",
            endTime: "",
            location: "",
            category: "General",
            contactInfo: "",
          }))
        );
      }
    }

    eventItems.forEach((item) => {
      createTempleEventRecord(item);
    });
  }
};

// ---------------------------------------------------------
// ADMIN LOOKUPS
// ---------------------------------------------------------

const getAdminByEmail = async (email) => {
  const normalizedEmail = (email || "").toLowerCase();

  await getDefaultAdminSeed();

  if (isDatabaseReady()) {
    const admin = await Admin.findOne({
      email: normalizedEmail,
    });

    if (admin) return admin;
  }

  return (
    memoryState.admins.find(
      (admin) => admin.email === normalizedEmail
    ) || null
  );
};

const getAdminById = async (id) => {
  await getDefaultAdminSeed();

  if (isDatabaseReady()) {
    const admin = await Admin.findById(id).select(
      "-passwordHash"
    );

    if (admin) return admin;
  }

  return (
    memoryState.admins.find(
      (admin) => admin._id === id
    ) || null
  );
};

const compareAdminPassword = async (
  password,
  passwordHash
) => {
  return bcrypt.compare(password, passwordHash);
};

// ---------------------------------------------------------
// GALLERY
// ---------------------------------------------------------

const listGalleryPhotos = () => {
  return memoryState.gallery
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );
};

const createGalleryPhotoRecord = (payload) => {
  const record = {
    _id: randomUUID(),
    title: payload.title,
    description: payload.description || "",
    imageUrl: payload.imageUrl,
    publicId: payload.publicId || null,
    category: payload.category || "General",
    orientation: payload.orientation || "landscape",
    source: payload.source || "uploaded",
    createdAt: new Date().toISOString(),
  };

  memoryState.gallery.unshift(record);

  return record;
};

const deleteGalleryPhotoRecord = (id) => {
  const index = memoryState.gallery.findIndex(
    (item) => item._id === id
  );

  if (index === -1) return null;

  const [deleted] = memoryState.gallery.splice(index, 1);

  return deleted;
};

// ---------------------------------------------------------
// PROGRESS VIDEOS
// ---------------------------------------------------------

const listProgressVideos = () => {
  return memoryState.videos
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );
};

const createProgressVideoRecord = (payload) => {
  const record = {
    _id: randomUUID(),
    title: payload.title,
    description: payload.description || "",
    videoUrl: payload.videoUrl,
    thumbnailUrl: payload.thumbnailUrl || "",
    publicId: payload.publicId || null,
    orientation: payload.orientation || "landscape",
    createdAt: new Date().toISOString(),
  };

  memoryState.videos.unshift(record);

  return record;
};

const deleteProgressVideoRecord = (id) => {
  const index = memoryState.videos.findIndex(
    (item) => item._id === id
  );

  if (index === -1) return null;

  const [deleted] = memoryState.videos.splice(index, 1);

  return deleted;
};

// ---------------------------------------------------------
// EVENTS
// ---------------------------------------------------------

const listTempleEvents = () => {
  return memoryState.events
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );
};

const createTempleEventRecord = (payload) => {
  const record = {
    _id: randomUUID(),
    tag: payload.tag || "",
    title: payload.title,
    description: payload.description || "",
    date: payload.date || "",
    startTime: payload.startTime || "",
    endTime: payload.endTime || "",
    location: payload.location || "",
    imageUrl: payload.imageUrl || "",
    category: payload.category || "General",
    contactInfo: payload.contactInfo || "",
    createdAt: new Date().toISOString(),
  };

  memoryState.events.unshift(record);

  return record;
};

const updateTempleEventRecord = (id, payload) => {
  const index = memoryState.events.findIndex(
    (item) => item._id === id
  );

  if (index === -1) return null;

  memoryState.events[index] = {
    ...memoryState.events[index],
    ...payload,
    updatedAt: new Date().toISOString(),
  };

  return memoryState.events[index];
};

const deleteTempleEventRecord = (id) => {
  const index = memoryState.events.findIndex(
    (item) => item._id === id
  );

  if (index === -1) return null;

  const [deleted] = memoryState.events.splice(index, 1);

  return deleted;
};

// ---------------------------------------------------------
// EXPORTS
// ---------------------------------------------------------

module.exports = {
  memoryState,
  getDefaultAdminSeed,
  createDefaultAdminIfNeeded,
  seedDefaultContentIfNeeded,
  getAdminByEmail,
  getAdminById,
  compareAdminPassword,
  listGalleryPhotos,
  createGalleryPhotoRecord,
  deleteGalleryPhotoRecord,
  listProgressVideos,
  createProgressVideoRecord,
  deleteProgressVideoRecord,
  listTempleEvents,
  createTempleEventRecord,
  updateTempleEventRecord,
  deleteTempleEventRecord,
};