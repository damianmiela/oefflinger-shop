"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ColloidalMetal } from "@/data/colloidal-metals";
import { getSortedUses, getMetalAccentColor } from "@/data/colloidal-metals";
import { getRememberedMetalId } from "@/components/RememberMetal";

interface MetalCarouselProps {
  metals: ColloidalMetal[];
}

function getMetalsForUse(metals: ColloidalMetal[], use: string): string[] {
  return metals.filter((m) => m.uses?.includes(use)).map((m) => m.id);
}

export function MetalCarousel({ metals }: MetalCarouselProps) {
  const [selectedMetalId, setSelectedMetalId] = useState(metals[0]?.id ?? "");
  const [selectedUse, setSelectedUse] = useState<string | null>(null);

  // Hover preview: gold ring on related items in the opposite panel
  const [hoveredMetalId, setHoveredMetalId] = useState<string | null>(null);
  const [hoveredUse, setHoveredUse] = useState<string | null>(null);
  // Pulse-then-fade after click
  const [pulseUses, setPulseUses] = useState<Set<string>>(new Set());
  const [pulseMetals, setPulseMetals] = useState<Set<string>>(new Set());
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverOffTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function cancelHoverOff() {
    if (hoverOffTimer.current) {
      clearTimeout(hoverOffTimer.current);
      hoverOffTimer.current = null;
    }
  }

  function hoverMetal(id: string) {
    cancelHoverOff();
    setHoveredMetalId(id);
    setHoveredUse(null);
  }

  function hoverUse(use: string) {
    cancelHoverOff();
    setHoveredUse(use);
    setHoveredMetalId(null);
  }

  function scheduleHoverOff() {
    cancelHoverOff();
    hoverOffTimer.current = setTimeout(() => {
      setHoveredMetalId(null);
      setHoveredUse(null);
    }, 200);
  }

  useEffect(() => {
    const id = getRememberedMetalId();
    if (id && metals.some((m) => m.id === id)) {
      setSelectedMetalId(id);
    }
  }, [metals]);

  useEffect(() => {
    return () => {
      if (pulseTimer.current) clearTimeout(pulseTimer.current);
      if (hoverOffTimer.current) clearTimeout(hoverOffTimer.current);
    };
  }, []);

  function triggerPulse(uses: Set<string>, metalIds: Set<string>) {
    if (pulseTimer.current) clearTimeout(pulseTimer.current);
    setPulseUses(uses);
    setPulseMetals(metalIds);
    pulseTimer.current = setTimeout(() => {
      setPulseUses(new Set());
      setPulseMetals(new Set());
    }, 700);
  }

  const selectedMetal = metals.find((m) => m.id === selectedMetalId) ?? metals[0];

  const metalsForSelectedUse = useMemo(() => {
    if (!selectedUse) return null;
    return new Set(getMetalsForUse(metals, selectedUse));
  }, [metals, selectedUse]);

  const usesForHoveredMetal = useMemo(() => {
    if (!hoveredMetalId) return null;
    const metal = metals.find((m) => m.id === hoveredMetalId);
    return new Set(metal?.uses ?? []);
  }, [metals, hoveredMetalId]);

  const metalsForHoveredUse = useMemo(() => {
    if (!hoveredUse) return null;
    return new Set(getMetalsForUse(metals, hoveredUse));
  }, [metals, hoveredUse]);

  const isHoverPreview = hoveredMetalId !== null || hoveredUse !== null;

  const highlightedUses = selectedMetal?.uses ?? [];
  const sortedUses = useMemo(() => getSortedUses(metals), [metals]);

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch">
      {/* Left: Metal selector */}
      <div className="flex shrink-0 flex-col gap-4 lg:w-56">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          Metalle
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
          {metals.map((metal) => {
            const isSelected = selectedMetalId === metal.id;
            const isHighlightedByUse =
              !isHoverPreview && selectedUse && metalsForSelectedUse?.has(metal.id);
            const isGoldHover =
              (metalsForHoveredUse?.has(metal.id) ?? false) ||
              hoveredMetalId === metal.id;
            const isPulsing = pulseMetals.has(metal.id);
            return (
              <button
                key={metal.id}
                type="button"
                onMouseEnter={() => hoverMetal(metal.id)}
                onMouseLeave={scheduleHoverOff}
                onClick={() => {
                  setSelectedMetalId(metal.id);
                  setSelectedUse(null);
                  cancelHoverOff();
                  setHoveredMetalId(null);
                  triggerPulse(new Set(metal.uses ?? []), new Set());
                }}
                className={`gold-ring-base flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left transition lg:w-full ${
                  isPulsing ? "gold-ring-pulse" : isGoldHover ? "gold-ring-on" : ""
                } ${
                  isSelected
                    ? "bg-primary text-white shadow-md"
                    : isHighlightedByUse
                      ? "bg-primary/20 ring-2 ring-primary/50"
                      : "bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:shadow"
                }`}
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: getMetalAccentColor(metal) }}
                />
                <span className="font-medium">{metal.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Center: Main content – visual + description */}
      <div className="min-w-0 flex-1">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
            <div className="relative aspect-[2/1] overflow-hidden sm:aspect-[21/9]">
              <Image
                src={`/images/metals/${selectedMetal.id}.png`}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-8 pt-16">
                <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg sm:text-4xl">
                  Kolloidales {selectedMetal.name}
                </h2>
                <p className="mt-1 text-lg text-white/90">{selectedMetal.tagline}</p>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <p className="text-lg leading-relaxed text-gray-600">
                {selectedMetal.description}
              </p>
              {selectedMetal.uses && selectedMetal.uses.length > 0 && (
                <div className="mt-6">
                  <p className="mb-2 text-sm font-medium uppercase tracking-wider text-gray-500">
                    Traditionelle Anwendungsbereiche
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedMetal.uses.map((use) => (
                      <span
                        key={use}
                        className="rounded-full px-4 py-1.5 text-sm font-medium"
                        style={{
                          backgroundColor: `${getMetalAccentColor(selectedMetal)}20`,
                          color: getMetalAccentColor(selectedMetal),
                        }}
                      >
                        {use}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/produkte/${selectedMetal.id}`}
                  className="inline-block rounded-lg border border-primary bg-white px-6 py-3 font-semibold text-primary transition hover:bg-primary/5"
                >
                  Mehr erfahren
                </Link>
                {selectedMetal.productLink && (
                  <Link
                    href={selectedMetal.productLink}
                    className="inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-light"
                  >
                    Zum Produkt im Shop
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

      {/* Right: Uses */}
      <div className="flex shrink-0 flex-col gap-4 lg:w-52">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          Anwendungsbereiche
        </p>
        <div className="flex flex-wrap gap-2 lg:flex-col">
          {sortedUses.map((use) => {
            const isHighlightedByMetal =
              !isHoverPreview && highlightedUses.includes(use);
            const isSelected = selectedUse === use;
            const metalIdsWithUse = getMetalsForUse(metals, use);
            const currentMetalHasUse = selectedMetal?.uses?.includes(use);
            const isGoldHover =
              (usesForHoveredMetal?.has(use) ?? false) || hoveredUse === use;
            const isPulsing = pulseUses.has(use);
            return (
              <button
                key={use}
                type="button"
                onMouseEnter={() => hoverUse(use)}
                onMouseLeave={scheduleHoverOff}
                onClick={() => {
                  const newSelectedUse = selectedUse === use ? null : use;
                  setSelectedUse(newSelectedUse);
                  if (newSelectedUse && !currentMetalHasUse && metalIdsWithUse[0]) {
                    setSelectedMetalId(metalIdsWithUse[0]);
                  }
                  cancelHoverOff();
                  setHoveredUse(null);
                  triggerPulse(new Set(), new Set(metalIdsWithUse));
                }}
                className={`gold-ring-base flex items-center justify-between gap-2 rounded-xl px-4 py-2.5 text-left text-sm transition lg:w-full ${
                  isPulsing ? "gold-ring-pulse" : isGoldHover ? "gold-ring-on" : ""
                } ${
                  isSelected
                    ? "bg-primary text-white shadow-md"
                    : isHighlightedByMetal
                      ? "bg-primary/15 ring-2 ring-primary/40"
                      : "bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:shadow"
                }`}
              >
                <span className="font-medium">{use}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    isSelected ? "bg-white/30" : "bg-gray-200/80"
                  }`}
                >
                  {metalIdsWithUse.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
