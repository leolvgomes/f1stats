"use client";

import { useMemo, useState } from "react";
import type { Driver } from "../data/f1-data";

type DriverComparisonProps = {
  drivers: Driver[];
};

export function DriverComparison({ drivers }: DriverComparisonProps) {
  const [leftSlug, setLeftSlug] = useState("lando-norris");
  const [rightSlug, setRightSlug] = useState("charles-leclerc");

  const leftDriver = useMemo(
    () => drivers.find((driver) => driver.slug === leftSlug) ?? drivers[0],
    [drivers, leftSlug],
  );
  const rightDriver = useMemo(
    () => drivers.find((driver) => driver.slug === rightSlug) ?? drivers[1],
    [drivers, rightSlug],
  );

  return (
    <div className="rounded border border-black/10 bg-[#151515] p-5 text-white">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ffcc00]">
        Comparativo
      </p>
      <h2 className="mt-2 text-3xl font-black">Duelo direto</h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <DriverSelect
          drivers={drivers}
          label="Piloto A"
          onChange={setLeftSlug}
          value={leftSlug}
        />
        <DriverSelect
          drivers={drivers}
          label="Piloto B"
          onChange={setRightSlug}
          value={rightSlug}
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
        className="h-11 rounded border border-white/15 bg-[#222] px-3 text-base font-semibold text-white outline-none transition focus:border-[#ffcc00]"
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
      <div className="flex h-4 overflow-hidden rounded bg-white/10">
        <div className="bg-[#ff8700]" style={{ width: `${leftWidth}%` }} />
        <div className="bg-[#e10600]" style={{ width: `${rightWidth}%` }} />
      </div>
    </div>
  );
}
