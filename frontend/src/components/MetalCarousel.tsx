"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ColloidalMetal } from "@/data/colloidal-metals";
import { getMetalAccentColor } from "@/data/colloidal-metals";
import { getRememberedMetalId } from "@/components/RememberMetal";

interface MetalCarouselProps {
  metals: ColloidalMetal[];
}

export function MetalCarousel({ metals }: MetalCarouselProps) {
  const [selectedMetalId, setSelectedMetalId] = useState(metals[0]?.id ?? "");

  useEffect(() => {
    const id = getRememberedMetalId();
    if (id && metals.some((m) => m.id === id)) {
      setSelectedMetalId(id);
    }
  }, [metals]);

  const selectedMetal = metals.find((m) => m.id === selectedMetalId) ?? metals[0];

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-8">
      {/* Left: Metal selector */}
      <div className="flex shrink-0 flex-col gap-4 lg:w-56">
        <p className="text-primary text-sm font-medium tracking-widest uppercase">Metalle</p>
        <div className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto pr-4 pb-2 pl-6 sm:mx-0 sm:px-0 lg:snap-none lg:flex-col lg:overflow-visible">
          {metals.map((metal) => {
            const isSelected = selectedMetalId === metal.id;
            return (
              <button
                key={metal.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedMetalId(metal.id)}
                className={`flex shrink-0 snap-start items-center gap-3 rounded-xl px-4 py-3 text-left transition lg:w-full ${
                  isSelected
                    ? "bg-primary text-white shadow-md"
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
            <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-4 pt-10 sm:p-8 sm:pt-16">
              <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-lg sm:text-4xl">
                Kolloidales {selectedMetal.name}
              </h2>
              <p className="mt-1 text-base text-white/90 sm:text-lg">{selectedMetal.tagline}</p>
            </div>
          </div>

          <div className="p-4 sm:p-8">
            <p className="text-base leading-relaxed text-gray-600 sm:text-lg">
              {selectedMetal.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/produkte/${selectedMetal.id}`}
                className="border-primary text-primary hover:bg-primary/5 inline-block w-full rounded-lg border bg-white px-6 py-3 text-center font-semibold transition sm:w-auto"
              >
                Mehr erfahren
              </Link>
              {selectedMetal.productLink && (
                <Link
                  href={selectedMetal.productLink}
                  className="bg-primary hover:bg-primary-light inline-block w-full rounded-lg px-6 py-3 text-center font-semibold text-white transition sm:w-auto"
                >
                  Zum Produkt im Shop
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
