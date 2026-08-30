import { createFileRoute, Link } from "@tanstack/react-router";

type TeamMember = { name: string; role: string; img?: string };

const teamGroups = [
  {
    label: "01 — Core Team",
    members: [
      { name: "Aakash Choudhary", role: "Founder", img: "/aakash.jpeg" },
      { name: "Rishabh Khatri", role: "Manager" },
    ],
  },
  {
    label: "02 — Craft & Technology",
    members: [
      { name: "Harshita Upadhyay", role: "UI UX Lead", img: "/harshita.jpeg" },
      { name: "Shrishti Kori", role: "Graphics Lead" },
      { name: "Aman Raj", role: "Developer", img: "/aman.jpeg" },
    ],
  },
];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Skédio" },
      { name: "description", content: "Meet the creative minds behind Skédio." },
      { name: "theme-color", content: "#8537F4" },
    ],
  }),
  component: About,
});

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <img
      src="/skedio-primary.png"
      alt="Skédio"
      width={818}
      height={297}
      className={`h-12 w-auto ${className}`}
    />
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="group">
      <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border bg-surface">
        {member.img ? (
          <img
            src={member.img}
            alt={member.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-250 ease-out group-hover:-translate-y-1"
          />
        ) : (
          <div className="size-full bg-gradient-to-br from-surface-alt to-primary/30 transition-transform duration-250 ease-out group-hover:-translate-y-1" />
        )}
      </div>
      <h3 className="mt-4 text-base font-semibold">{member.name}</h3>
      <p className="type-caption mt-1 text-muted-foreground">{member.role}</p>
    </div>
  );
}

function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <nav className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-5 md:px-12">
          <Link to="/">
            <Wordmark />
          </Link>
          <div className="flex items-center gap-10">
            <ul className="type-label hidden items-center gap-10 uppercase md:flex">
              <li>
                <Link
                  to="/"
                  className="type-body tracking-[0.08em] text-foreground/70 transition-colors duration-200 hover:text-primary"
                >
                  Home
                </Link>
              </li>
              <li>
                <span className="type-body tracking-[0.08em] text-primary">About</span>
              </li>
            </ul>
            <Link
              to="/"
              className="group type-button inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-primary-foreground transition-colors duration-250 ease-out hover:bg-primary-hover"
            >
              Let's Talk
            </Link>
          </div>
        </nav>
      </header>

      {/* Team */}
      <section id="team" className="mx-auto w-full max-w-[1200px] scroll-mt-24 px-6 py-20 md:py-28">
        <p className="eyebrow">About</p>
        <h1 className="type-h2 mt-5 max-w-2xl">Meet Our Creative Minds</h1>

        <div className="mt-16 space-y-16 md:space-y-20">
          {teamGroups.map((group) => (
            <div key={group.label}>
              <p className="type-label uppercase tracking-[0.1em] text-muted-foreground">
                {group.label}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-6">
                {group.members.map((member) => (
                  <div
                    key={member.name}
                    className="w-full max-w-[240px] sm:w-[calc((100%-2*1.5rem)/3)]"
                  >
                    <TeamCard member={member} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
