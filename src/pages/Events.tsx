type EventCard = {
  title: string;
  description: string;
  image: string;
  tag?: string;
};

const events: EventCard[] = [
  {
    title: "Siddha Eye Drops",
    description:
      "Distribution of Siddha eye drops every month for community wellness and support.",
    image: "/image/event/Sidda.png",
    tag: "Every 30",
  },
  {
    title: "Blood Donation",
    description:
      "A monthly blood donation drive that encourages lifesaving service and community participation.",
    image: "/image/event/blood.jpg",
    tag: "Monthly",
  },
   {
    title: "Book Donation",
    description:
      "Donate books and support reading, learning, and spiritual education in the community.",
    image: "/image/event/book.jpg",
    
  },
  {
    title: "Health Camps",
    description:
      "Free health camps that offer basic checkups, wellness guidance, and community care.",
    image: "/image/event/health.png",
    tag: "Free Care",
  },
  {
    title: "Annadana Seva",
    description:
      "Temple food service and community sharing for devotees and visitors.",
    image: "/image/event/dasoha.avif",
    tag: "Seva",
  },
  {
    title: "Tree Plantation",
    description:
      "Green initiatives focused on planting and protecting trees around the temple area.",
    image: "/image/event/tree.jpg",
    tag: "Eco",
  },
  {
    title: "Vadya Goshti",
    description:
      "Traditional music and devotional programs that enrich temple celebrations.",
    image: "/image/event/vadya.jpg",
    tag: "Cultural",
  },
];

export default function Events() {
  return (
    <div className="w-full bg-transparent py-12 min-h-[100dvh]">
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">
            Events
          </p>
          <h1 className="mt-4 font-serif text-4xl text-[#083C78] sm:text-5xl">
            Temple Events
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Join us in regular seva, community care, and devotional service through our monthly temple events.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {events.map((item) => (
            <article
              key={item.title}
              className="group overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-[0_18px_50px_rgba(10,77,155,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(10,77,155,0.14)]"
            >
              <div className="relative h-80 overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="space-y-4 p-6">
                {item.tag ? (
                  <span className="inline-flex rounded-full bg-[#fff6d9] px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#d1a21f]">
                    {item.tag}
                  </span>
                ) : null}
                <h2 className="font-serif text-3xl uppercase tracking-wide text-[#083C78]">
                  {item.title}
                </h2>
                <p className="text-base leading-7 text-slate-600">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}