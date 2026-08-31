"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";

export function TeamView() {
  const { company, roles, addRole, fillRole, updateCompany } = useStore();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");

  if (!company) return null;
  const companyRoles = roles.filter((item) => item.companyId === company.id);
  const open = companyRoles.filter((item) => item.status === "open");

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-xs uppercase tracking-[0.18em] text-hq-mist">Team</p>
      <h1 className="font-display mt-3 text-4xl tracking-tight">Hire for the next market.</h1>
      <p className="mt-3 max-w-2xl text-hq-mist">
        Headcount is not scale. The roles that matter speak the language, hold
        the license, or run distribution in a country you just named.
      </p>

      <label className="mt-8 block max-w-xs rounded-2xl bg-hq-panel p-4 hq-hairline">
        <span className="text-xs uppercase tracking-[0.14em] text-hq-mist">Team size</span>
        <input
          type="number"
          min={1}
          value={company.teamSize}
          onChange={(event) => updateCompany({ teamSize: Number(event.target.value) || 1 })}
          className="mt-2 h-10 w-full bg-transparent font-mono text-2xl tabular outline-none"
        />
      </label>

      <form
        className="mt-6 grid gap-3 rounded-2xl bg-hq-panel p-4 hq-hairline md:grid-cols-[1fr_1fr_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          addRole(title, location);
          setTitle("");
          setLocation("");
        }}
      >
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Role"
          className="h-11 rounded-lg bg-hq-raised px-3 text-sm outline-none hq-hairline"
        />
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="City"
          className="h-11 rounded-lg bg-hq-raised px-3 text-sm outline-none hq-hairline"
        />
        <button type="submit" className="h-11 rounded-lg bg-hq-text px-5 text-sm text-hq">
          Open role
        </button>
      </form>

      <ul className="mt-6 space-y-3">
        {companyRoles.map((role) => (
          <li
            key={role.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-hq-panel px-5 py-4 hq-hairline"
          >
            <div>
              <p className="text-sm font-medium">{role.title}</p>
              <p className="text-sm text-hq-mist">{role.location}</p>
            </div>
            {role.status === "open" ? (
              <button
                type="button"
                onClick={() => fillRole(role.id)}
                className="text-sm text-hq-text"
              >
                Mark filled
              </button>
            ) : (
              <span className="text-xs uppercase tracking-[0.14em] text-hq-mist">Filled</span>
            )}
          </li>
        ))}
        {companyRoles.length === 0 ? (
          <li className="text-sm text-hq-mist">No roles yet.</li>
        ) : null}
      </ul>
      <p className="mt-6 text-sm text-hq-mist">{open.length} open</p>
    </div>
  );
}
