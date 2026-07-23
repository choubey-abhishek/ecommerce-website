"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const PRESS = ["Hyperallergic", "Providence Daily Dose", "Metro Philly"];

const EXHIBITIONS = [
  {
    label: "Solo Exhibition",
    detail: "The Clay Studio, Philadelphia, PA",
  },
  {
    label: "Group Exhibition",
    detail: "The Gelman Gallery, RISD Museum",
  },
  {
    label: "Group Exhibition",
    detail: "The Lacoste/Keane Gallery, Concord, MA",
  },
  {
    label: "Group Exhibition",
    detail: "Art Centrix Space, New Delhi",
  },
];

export default function AboutSection() {
  return (
    <div className="pb-28 pt-36 sm:pt-40">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 px-6 sm:px-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand-100 lg:sticky lg:top-32 lg:self-start"
        >
          <Image
            src="/kopal.jpg"
            alt="Kopal Seth in her ceramics studio"
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </motion.div>

        <div>
          <motion.p
            custom={0}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="font-sans text-xs uppercase tracking-widest text-ink/50"
          >
            About the Artist
          </motion.p>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="mt-3 font-serif text-display-md font-light text-ink"
          >
            Kopal Seth
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="mt-8 max-w-2xl font-sans text-[16px] leading-[1.9] text-ink/70"
          >
            Kopal has earned an MFA in Ceramics from Rhode Island School of
            Design (RISD) USA and a BVA in Painting from MS University,
            Faculty of Fine Arts, Baroda. She was a resident artist with The
            Clay Studio in Philadelphia, PA, USA. Her work has been featured
            in Hyperallergic, Providence Daily Dose, and Metro Philly, among
            many other platforms. She has shown at various exhibitions in
            India and the U.S., including a solo show at The Clay Studio, PA,
            and group shows at The Gelman Gallery (RISD Museum), The
            Lacoste/Keane Gallery (Concord, MA), and Art Centrix Space (New
            Delhi).
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2"
          >
            <div id="exhibitions" className="scroll-mt-32">
              <h2 className="font-sans text-xs uppercase tracking-widest text-ink/50">
                Exhibitions
              </h2>
              <ul className="mt-4 space-y-4">
                {EXHIBITIONS.map((item) => (
                  <li key={item.detail} className="font-sans text-[14px] text-ink/70">
                    <span className="block text-ink">{item.label}</span>
                    {item.detail}
                  </li>
                ))}
              </ul>
            </div>

            <div id="press" className="scroll-mt-32">
              <h2 className="font-sans text-xs uppercase tracking-widest text-ink/50">
                Featured In
              </h2>
              <ul className="mt-4 space-y-4">
                {PRESS.map((press) => (
                  <li key={press} className="font-sans text-[14px] text-ink/70">
                    {press}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
