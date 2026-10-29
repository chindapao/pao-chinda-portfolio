"use client";

import { motion, type Variants } from "motion/react";
import type * as React from "react";

/*
 * Scroll-triggered fade-up. `whileInView` is Motion's IntersectionObserver; `once` stops re-animating on scroll back.
 * Reduced motion is handled globally by <MotionConfig reducedMotion="user"> in Providers (transforms are dropped,
 * opacity stays), so no component needs its own check.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;

type Tag = "div" | "section" | "ul" | "ol" | "li" | "article" | "header";

/** One element that fades up when it scrolls into view. */
export function Reveal({
  as = "div",
  delay = 0,
  className,
  children,
}: {
  as?: Tag;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={fadeUp}
      transition={{ delay }}
    >
      {children}
    </Component>
  );
}

/** A container whose `StaggerItem` children fade up one after another. */
export function Stagger({
  as = "div",
  step = 0.08,
  className,
  children,
}: {
  as?: Tag;
  step?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: step } } }}
    >
      {children}
    </Component>
  );
}

export function StaggerItem({
  as = "div",
  className,
  children,
}: {
  as?: Tag;
  className?: string;
  children: React.ReactNode;
}) {
  const Component = motion[as];
  return (
    <Component className={className} variants={fadeUp}>
      {children}
    </Component>
  );
}
