import { useEffect, useState, type PointerEvent } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { team, type TeamMember } from "@/content/maco";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { getLiveScrollRuntime } from "@/lib/scroll-runtime";
import "./about.css";

function Character({
  person,
  index,
  selected,
  portraits,
  onSelect,
}: {
  person: TeamMember;
  index: number;
  selected: boolean;
  portraits: boolean;
  onSelect: () => void;
}) {
  const reduced = useReducedMotion();
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const rotateX = useSpring(targetX, { stiffness: 240, damping: 24 });
  const rotateY = useSpring(targetY, { stiffness: 240, damping: 24 });
  function track(event: PointerEvent<HTMLButtonElement>) {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    targetX.set(-((event.clientY - rect.top) / rect.height - 0.5) * 10);
    targetY.set(((event.clientX - rect.left) / rect.width - 0.5) * 14);
  }
  const cell = index % 4;
  return (
    <article className="team-person" data-selected={selected || undefined}>
      <button
        type="button"
        className="team-character-button"
        aria-label={`Meet ${person.name}, ${person.role}`}
        aria-expanded={selected}
        aria-controls={`team-profile ${person.slug}-bio`}
        onClick={onSelect}
        onPointerMove={track}
        onPointerLeave={() => {
          targetX.set(0);
          targetY.set(0);
        }}
      >
        <span className="team-character-ground" aria-hidden="true" />
        <motion.span
          className="team-character"
          style={{ rotateX, rotateY, transformPerspective: 800 }}
          animate={reduced ? false : { y: selected ? -10 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 21 }}
        >
          {portraits && person.portrait ? (
            <img src={person.portrait.poster} alt="" width={512} height={512} loading="lazy" />
          ) : (
            <span
              className="team-avatar-sprite"
              role="img"
              aria-label={`Illustrated character of ${person.name}`}
              style={{
                backgroundImage: `url(/media/team/characters-${index < 4 ? "a" : "b"}.webp)`,
                backgroundPosition: `${cell % 2 === 0 ? "0%" : "100%"} ${cell < 2 ? "0%" : "100%"}`,
              }}
            />
          )}
        </motion.span>
        <span className="team-character-action" aria-hidden="true">
          {selected ? "−" : "+"}
        </span>
      </button>
      <div className="team-person-caption">
        <h3>{person.name}</h3>
        <p>{person.role}</p>
        <p id={`${person.slug}-bio`} hidden={!selected} className="team-mobile-bio">
          {person.bio}
        </p>
      </div>
    </article>
  );
}

export function TeamGrid() {
  const [active, setActive] = useState<number | null>(null);
  const [portraits, setPortraits] = useState(false);
  const person = active === null ? null : team[active];
  useEffect(() => {
    getLiveScrollRuntime()?.scheduleRefresh();
  }, [active, portraits]);
  return (
    <div className="team-experience">
      <div className="team-heading">
        <div>
          <h2 className="display-lg">
            Different minds.
            <br />
            One MaCo.
          </h2>
          <p className="team-intro">
            The people who turn the first conversation into working software.
          </p>
        </div>
        <div className="team-view-switch" role="group" aria-label="Team portrait style">
          <button type="button" aria-pressed={!portraits} onClick={() => setPortraits(false)}>
            Characters
          </button>
          <button type="button" aria-pressed={portraits} onClick={() => setPortraits(true)}>
            Portraits
          </button>
        </div>
      </div>
      <p className="team-interaction-note">Move closer. Pick a person. Meet the team.</p>
      <div className="team-grid">
        {team.map((member, index) => (
          <Character
            key={member.slug}
            person={member}
            index={index}
            portraits={portraits}
            selected={active === index}
            onSelect={() => setActive(active === index ? null : index)}
          />
        ))}
      </div>
      <div id="team-profile" className="team-profile" aria-live="polite" aria-atomic="true">
        {person ? (
          <>
            <div>
              <p className="team-profile-name">{person.name}</p>
              <p className="text-muted">{person.role}</p>
            </div>
            <p className="team-profile-bio">{person.bio}</p>
            <button
              type="button"
              className="team-profile-close"
              aria-label="Close team profile"
              onClick={() => setActive(null)}
            >
              ×
            </button>
          </>
        ) : (
          <p className="team-profile-prompt">
            Development, product, quality, support and growth. Built together.
          </p>
        )}
      </div>
      <p className="team-art-note">
        Character portraits are illustrated interpretations of our team. Switch to Portraits to see
        the photographs.
      </p>
    </div>
  );
}
