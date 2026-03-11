"use client";

import { useState } from "react";
import type { ColloidalMetal } from "@/data/colloidal-metals";

interface MetalCarouselProps {
  metals: ColloidalMetal[];
}

export function MetalCarousel({ metals }: MetalCarouselProps) {
  const [selectedId, setSelectedId] = useState(metals[0]?.id ?? "");
  const selected = metals.find((m) => m.id === selectedId) ?? metals[0];

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch">
      {/* Metal selector – horizontal scroll on mobile */}
      <div className="flex shrink-0 flex-col gap-4 lg:w-56">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          Wählen Sie ein Metall
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
          {metals.map((metal) => (
            <button
              key={metal.id}
              type="button"
              onClick={() => setSelectedId(metal.id)}
              className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left transition lg:w-full ${
                selectedId === metal.id
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:shadow"
              }`}
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: metal.color }}
              />
              <span className="font-medium">{metal.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main content – visual + description */}
      <div className="min-w-0 flex-1">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
          {/* Visual representation – metallic gradient */}
          <div
            className="relative aspect-[2/1] overflow-hidden sm:aspect-[21/9]"
            style={{
              background: `linear-gradient(135deg, ${selected.gradientFrom} 0%, ${selected.gradientTo} 50%, ${selected.gradientFrom} 100%)`,
              boxShadow: "inset 0 0 60px rgba(255,255,255,0.15)",
            }}
          >
            {/* Metallic sheen overlay */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 45%, rgba(255,255,255,0.2) 50%, transparent 55%)",
              }}
            />
            {/* Subtle particle/droplet pattern */}
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
            {/* Metal name overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6">
              <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg sm:text-4xl">
                Kolloidales {selected.name}
              </h2>
              <p className="mt-1 text-lg text-white/90">{selected.tagline}</p>
            </div>
          </div>

          {/* Description */}
          <div className="p-6 sm:p-8">
            <p className="text-lg leading-relaxed text-gray-600">{selected.description}</p>
            {selected.uses && selected.uses.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 text-sm font-medium uppercase tracking-wider text-gray-500">
                  Traditionelle Anwendungsbereiche
                </p>
                <div className="flex flex-wrap gap-2">
                  {selected.uses.map((use) => (
                    <span
                      key={use}
                      className="rounded-full px-4 py-1.5 text-sm font-medium"
                      style={{
                        backgroundColor: `${selected.color}20`,
                        color: selected.color,
                      }}
                    >
                      {use}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
