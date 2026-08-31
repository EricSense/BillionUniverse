"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { Logo } from "@/components/Logo";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/seed";
import { useStore } from "@/lib/store";

export function LoginForm() {
  const { login, ready } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [error, setError] = useState("");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const result = login(email, password);
    if (result) {
      setError(result);
      return;
    }
    router.push("/hq");
  }

  return (
    <AuthFrame
      title="Welcome back."
      subtitle="Open the HQ for your company. The Relay demo is preloaded."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Email" value={email} onChange={setEmail} type="email" />
        <Field label="Password" value={password} onChange={setPassword} type="password" />
        {error ? <p className="text-sm text-warn">{error}</p> : null}
        <button
          type="submit"
          disabled={!ready}
          className="h-11 w-full rounded-full bg-ink text-sm font-medium text-paper disabled:opacity-50"
        >
          Enter HQ
        </button>
      </form>
      <p className="mt-6 text-sm text-mist">
        New company?{" "}
        <Link href="/join" className="text-ink">
          Start here
        </Link>
      </p>
    </AuthFrame>
  );
}

export function JoinForm() {
  const { signup, ready } = useStore();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [tagline, setTagline] = useState("");
  const [thesis, setThesis] = useState("");
  const [hq, setHq] = useState("");
  const [error, setError] = useState("");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const result = signup(name, email, password, {
      name: company,
      tagline,
      thesis,
      sector: "other",
      hq,
    });
    if (result) {
      setError(result);
      return;
    }
    router.push("/hq");
  }

  return (
    <AuthFrame
      title="Name the company."
      subtitle="You will get an HQ, a path to a billion, and a public page. Add markets next."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Your name" value={name} onChange={setName} />
        <Field label="Email" value={email} onChange={setEmail} type="email" />
        <Field label="Password" value={password} onChange={setPassword} type="password" />
        <Field label="Company" value={company} onChange={setCompany} />
        <Field
          label="Tagline"
          value={tagline}
          onChange={setTagline}
          placeholder="One sentence. Who you serve."
        />
        <label className="block">
          <span className="text-xs uppercase tracking-[0.14em] text-mist">Thesis</span>
          <textarea
            value={thesis}
            onChange={(event) => setThesis(event.target.value)}
            rows={4}
            placeholder="Which people. Which problem. Why a billion of them have it."
            className="mt-1 w-full rounded-xl bg-paper px-3 py-2 text-sm outline-none hairline"
          />
        </label>
        <Field label="HQ city" value={hq} onChange={setHq} placeholder="Lagos, Bengaluru, Remote…" />
        {error ? <p className="text-sm text-warn">{error}</p> : null}
        <button
          type="submit"
          disabled={!ready}
          className="h-11 w-full rounded-full bg-accent text-sm font-medium text-paper disabled:opacity-50"
        >
          Create HQ
        </button>
      </form>
      <p className="mt-6 text-sm text-mist">
        Already have one?{" "}
        <Link href="/login" className="text-ink">
          Log in
        </Link>
      </p>
    </AuthFrame>
  );
}

function AuthFrame({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <Logo />
        <Link href="/" className="text-sm text-mist">
          Back
        </Link>
      </div>
      <div className="mx-auto grid max-w-6xl gap-12 px-5 pb-20 pt-8 md:grid-cols-2 md:pt-16">
        <div>
          <h1 className="font-display text-5xl tracking-tight">{title}</h1>
          <p className="mt-4 max-w-md text-lg leading-8 text-ink-soft">{subtitle}</p>
        </div>
        <div className="rounded-2xl bg-paper-2/60 p-6 hairline md:p-8">{children}</div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.14em] text-mist">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-11 w-full rounded-xl bg-paper px-3 text-sm outline-none hairline"
      />
    </label>
  );
}
