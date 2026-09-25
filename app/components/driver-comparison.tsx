"use client";

import { useEffect, useMemo, useState } from "react";
import type { Driver } from "../data/f1-data";

type DriverComparisonProps = {
  drivers: Driver[];
};

export function DriverComparison({ drivers }: DriverComparisonProps) {
  const [selectedSlugs, setSelectedSlugs] = useState(() => {
    if (typeof window === "undefined") {
      return {
        left: "lando-norris",
        right: "charles-leclerc",
      };
    }

    try {
      const savedComparison = window.localStorage.getItem(
        "f1stats:comparison",
      );

      return savedComparison
        ? (JSON.parse(savedComparison) as { left: string; right: string })
        : {
            left: "lando-norris",
            right: "charles-leclerc",
          };
    } catch {
      return {
        left: "lando-norris",
        right: "charles-leclerc",
      };
    }
  });

  useEffect(() => {
    window.localStorage.setItem(
      "f1stats:comparison",
      JSON.stringify(selectedSlugs),
    );
  }, [selectedSlugs]);

  const leftDriver = useMemo(
    () => drivers.find((driver) => driver.slug === selectedSlugs.left) ?? drivers[0],
    [drivers, selectedSlugs.left],
  );
  const rightDriver = useMemo(
    () => drivers.find((driver) => driver.slug === selectedSlugs.right) ?? drivers[1],
    [drivers, selectedSlugs.right],
  );

  return (
    <div className="f1-dark-card rounded p-5 text-white">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ffcc00]">
        Comparativo
      </p>
      <h2 className="f1-section-heading mt-2 text-3xl">Duelo direto</h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <DriverSelect
          drivers={drivers}
          label="Piloto A"
          onChange={(slug) =>
            setSelectedSlugs((currentSlugs) => ({
              ...currentSlugs,
              left: slug,
            }))
          }
          value={selectedSlugs.left}
        />
        <DriverSelect
          drivers={drivers}
          label="Piloto B"
          onChange={(slug) =>
            setSelectedSlugs((currentSlugs) => ({
              ...currentSlugs,
              right: slug,
            }))
          }
          value={selectedSlugs.right}
        />
      </div>

      <div className="mt-6 grid gap-4">
        <CompareBar
          label="Pontos"
          left={leftDriver.points}
          right={rightDriver.points}
        />
        <CompareBar
          label="Vitorias"
          left={leftDriver.wins}
          right={rightDriver.wins}
        />
        <CompareBar
          label="Podios"
          left={leftDriver.podiums}
          right={rightDriver.podiums}
        />
        <CompareBar
          label="Voltas rapidas"
          left={leftDriver.fastestLaps}
          right={rightDriver.fastestLaps}
        />
      </div>
    </div>
  );
}

function DriverSelect({
  drivers,
  label,
  onChange,
  value,
}: {
  drivers: Driver[];
  label: string;
  onChange: (slug: string) => void;
  value: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-white/62">
      {label}
      <select
        className="h-11 rounded border border-white/15 bg-white/10 px-3 text-base font-semibold text-white outline-none transition focus:border-[#ffcc00] focus:ring-4 focus:ring-[#ffcc00]/10"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {drivers.map((driver) => (
          <option key={driver.slug} value={driver.slug}>
            {driver.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function CompareBar({
  label,
  left,
  right,
}: {
  label: string;
  left: number;
  right: number;
}) {
  const total = left + right;
  const leftWidth = total === 0 ? 50 : (left / total) * 100;
  const rightWidth = total === 0 ? 50 : (right / total) * 100;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm font-bold text-white/62">
        <span>{label}</span>
        <span>
          {left} / {right}
        </span>
      </div>
      <div className="flex h-3 overflow-hidden rounded bg-white/10 ring-1 ring-white/10">
        <div className="bg-[#ff8700]" style={{ width: `${leftWidth}%` }} />
        <div className="bg-[#e10600]" style={{ width: `${rightWidth}%` }} />
      </div>
    </div>
  );
}
