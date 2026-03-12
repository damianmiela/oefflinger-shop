"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
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

  useEffect(() => {
    const id = getRememberedMetalId();
    if (id && metals.some((m) => m.id === id)) {
      setSelectedMetalId(id);
    }
  }, [metals]);

  const selectedMetal = metals.find((m) => m.id === selectedMetalId) ?? metals[0];

  const metalsForSelectedUse = useMemo(() => {
    if (!selectedUse) return null;
    return new Set(getMetalsForUse(metals, selectedUse));
  }, [metals, selectedUse]);

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
              selectedUse && metalsForSelectedUse?.has(metal.id);
            return (
              <button
                key={metal.id}
                type="button"
                onClick={() => {
                  setSelectedMetalId(metal.id);
                  setSelectedUse(null);
                }}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left transition lg:w-full ${
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
            <div
              className="relative aspect-[2/1] overflow-hidden sm:aspect-[21/9]"
              style={{
                background: `linear-gradient(135deg, ${selectedMetal.gradientFrom} 0%, ${selectedMetal.gradientTo} 50%, ${selectedMetal.gradientFrom} 100%)`,
                boxShadow: "inset 0 0 60px rgba(255,255,255,0.15)",
              }}
            >
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 45%, rgba(255,255,255,0.2) 50%, transparent 55%)",
                }}
              />
              <div className="absolute inset-0 opacity-20">
                <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern
                      id="droplets"
                      x="0"
                      y="0"
                      width="60"
                      height="60"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle cx="10" cy="10" r="2" fill="white" opacity="0.5" />
                      <circle cx="40" cy="35" r="1.5" fill="white" opacity="0.4" />
                      <circle cx="25" cy="50" r="1" fill="white" opacity="0.3" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#droplets)" />
                </svg>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6">
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
            const isHighlightedByMetal = highlightedUses.includes(use);
            const isSelected = selectedUse === use;
            const metalIdsWithUse = getMetalsForUse(metals, use);
            const currentMetalHasUse = selectedMetal?.uses?.includes(use);
            return (
              <button
                key={use}
                type="button"
                onClick={() => {
                  const newSelectedUse = selectedUse === use ? null : use;
                  setSelectedUse(newSelectedUse);
                  if (newSelectedUse && !currentMetalHasUse && metalIdsWithUse[0]) {
                    setSelectedMetalId(metalIdsWithUse[0]);
                  }
                }}
                className={`flex items-center justify-between gap-2 rounded-xl px-4 py-2.5 text-left text-sm transition lg:w-full ${
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
