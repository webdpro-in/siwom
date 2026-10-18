import autonomyImg from "@/public/images/robotics.webp";
import mobilityImg from "@/public/images/electric-mobility.webp";
import intelligenceImg from "@/public/images/industrial-control.webp";
import { divisions } from "@/data/divisions";
import { Button } from "@/components/ui/Button";
import { MediaCard } from "@/components/ui/Cards";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const conceptCards = [
  {
    division: divisions.autonomy,
    image: autonomyImg,
    alt: "Industrial robotic arms inside a guarded manufacturing cell.",
    description: "Robotics, machine perception and automated inspection for logistics facilities.",
  },
  {
    division: divisions.mobility,
    image: mobilityImg,
    alt: "Electric vehicle connected to a charging plug.",
    description: "Future EVs, connected mobility and vehicle intelligence, with driver-assistance research later.",
  },
  {
    division: divisions.intelligence,
    image: intelligenceImg,
    alt: "Server hardware and cabling inside a data centre.",
    description: "Digital twins, simulation, sensor networks and predictive maintenance where data supports it.",
  },
];

export function BeyondSection() {
  return (
    <section aria-labelledby="beyond-title" className="section-y">
      <div className="mx-auto max-w-content gutter-x">
        <div data-reveal>
          <SectionHeader id="beyond-title" eyebrow="05 — Beyond logistics" title="A longer view of industry." />
        </div>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {conceptCards.map((c, i) => (
            <li key={c.division.id} data-reveal style={{ "--reveal-i": i } as React.CSSProperties}>
              <MediaCard
                image={c.image}
                alt={c.alt}
                title={c.division.product}
                description={c.description}
                status={c.division.status}
                href={c.division.href}
                aspect="4/5"
                sizes="(min-width: 768px) 33vw, 100vw"
                className="h-full"
              />
            </li>
          ))}
        </ul>
        <div data-reveal className="mt-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-reading font-display text-h3 font-medium text-text">
            Our commercial focus is connecting global freight with local logistics. Robotics, industrial intelligence and mobility remain longer-term research directions, represented here by industry photography.
          </p>
          <Button href="/vision" variant="secondary" icon="arrow" className="shrink-0" trackAs="home_explore_vision">
            Explore our vision
          </Button>
        </div>
      </div>
    </section>
  );
}
