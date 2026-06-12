import { HealthDisclaimer } from "@/components/HealthDisclaimer";

/** Shared template for all product pages – appends the health disclaimer. */
export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <HealthDisclaimer />
      </div>
    </>
  );
}
