import { useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, FileUp, Loader2, Trash2 } from "lucide-react";
import { PageShell } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { matchRegulation } from "@/lib/regulation-match";
import { ISSUE_TYPES, AIRLINE_GROUPS, AIRPORT_GROUPS } from "@/lib/jetclaim";
import { useIsAdmin } from "@/hooks/use-admin";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  flight: z.string().max(10).optional(),
  date: z.string().max(20).optional(),
  issue: z.string().max(40).optional(),
});

export const Route = createFileRoute("/claim")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "File a Flight Claim — JetClaim" },
      {
        name: "description",
        content:
          "Start your flight compensation claim in minutes: add your flight details, describe what happened and upload your documents.",
      },
      { property: "og:title", content: "File a Flight Claim — JetClaim" },
      {
        property: "og:description",
        content: "Submit your delay, cancellation or baggage claim to JetClaim in under 3 minutes.",
      },
    ],
  }),
  component: ClaimPage,
});

const STEPS = ["Flight Details", "What Happened", "Documents", "Contact & Account", "Review"];

const flightSchema = z.object({
  airline_name: z.string().trim().min(2, "Select or enter an airline").max(120),
  flight_number: z.string().trim().min(2, "Enter a flight number").max(10),
  flight_date: z.string().min(4, "Select the date of your flight"),
  departure_airport: z.string().trim().min(3, "Enter the departure airport").max(60),
  arrival_airport: z.string().trim().min(3, "Enter the arrival airport").max(60),
});

const issueSchema = z.object({
  issue_type: z.string().min(2, "Choose what went wrong"),
  description: z.string().trim().max(2000).optional(),
});

const contactSchema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z.string().trim().max(30).optional(),
  password: z.string().max(72).optional(),
});

function ClaimPage() {
  const { isAdmin, loading } = useIsAdmin();
  if (loading) return null;
  if (isAdmin) {
    return (
      <PageShell>
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <h1 className="text-2xl font-extrabold text-navy">Admin accounts can't file claims</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You're signed in as the JetClaim admin. Use the console to review passenger claims.
          </p>
          <Button asChild className="mt-6 bg-navy text-navy-foreground hover:bg-navy-deep">
            <Link to="/admin">Go to claims queue</Link>
          </Button>
        </div>
      </PageShell>
    );
  }
  return <ClaimForm />;
}

function ClaimForm() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const fileInput = useRef<HTMLInputElement>(null);
  const airlineRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [authorized, setAuthorized] = useState(false);
  const [airlineQuery, setAirlineQuery] = useState("");
  const [airlineOpen, setAirlineOpen] = useState(false);

  const [form, setForm] = useState({
    airline_name: "",
    flight_number: search.flight ?? "",
    flight_date: search.date ?? "",
    departure_airport: "",
    arrival_airport: "",
    issue_type: search.issue ?? "",
    description: "",
    full_name: "",
    email: "",
    phone: "",
    password: "",
  });

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (airlineRef.current && !airlineRef.current.contains(e.target as Node)) {
        setAirlineOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const showGroupedList = airlineOpen;

  function addFiles(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list).filter((f) => f.size <= 10 * 1024 * 1024);
    if (incoming.length !== list.length) toast.error("Files must be 10MB or smaller.");
    setFiles((prev) => [...prev, ...incoming].slice(0, 10));
  }

  function next() {
    if (step === 0) {
      const parsed = flightSchema.safeParse(form);
      if (!parsed.success) { toast.error(parsed.error.issues[0]!.message); return; }
    }
    if (step === 1) {
      const parsed = issueSchema.safeParse(form);
      if (!parsed.success) { toast.error(parsed.error.issues[0]!.message); return; }
    }
    if (step === 3) {
      const parsed = contactSchema.safeParse(form);
      if (!parsed.success) { toast.error(parsed.error.issues[0]!.message); return; }
      if (!authorized) { toast.error("Please authorize JetClaim to act on your behalf."); return; }
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  async function submit() {
    setSubmitting(true);
    try {
      let { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        if (!form.password || form.password.length < 8) {
          setStep(3);
          throw new Error("Create a password of at least 8 characters to track your claim.");
        }
        const { error: signUpError } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: form.full_name, phone: form.phone },
          },
        });
        if (signUpError) {
          if (signUpError.message.toLowerCase().includes("registered")) {
            const { error: signInError } = await supabase.auth.signInWithPassword({
              email: form.email,
              password: form.password,
            });
            if (signInError) throw new Error("That email already has an account. Log in first.");
          } else {
            throw signUpError;
          }
        }
        sessionData = (await supabase.auth.getSession()).data;
      }

      const userId = sessionData.session?.user.id;
      if (!userId) throw new Error("Please confirm your email, then log in to finish your claim.");

      const { data: claim, error } = await supabase
        .from("claims")
        .insert({
          user_id: userId,
          airline_name: form.airline_name,
          flight_number: form.flight_number.toUpperCase(),
          flight_date: form.flight_date,
          departure_airport: form.departure_airport,
          arrival_airport: form.arrival_airport,
          issue_type: form.issue_type,
          description: form.description || null,
          regulation_code: matchRegulation({
            airline_name: form.airline_name,
            departure_airport: form.departure_airport,
            arrival_airport: form.arrival_airport,
            issue_type: form.issue_type,
          }).code,
        })
        .select("id,reference")
        .single();
      if (error) throw error;

      for (const file of files) {
        const path = `${userId}/${claim.id}/${crypto.randomUUID()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("claim-documents")
          .upload(path, file);
        if (uploadError) continue;
        await supabase.from("claim_documents").insert({
          claim_id: claim.id,
          user_id: userId,
          file_path: path,
          file_name: file.name,
          file_size: file.size,
          content_type: file.type,
        });
      }

      await supabase
        .from("profiles")
        .update({ full_name: form.full_name, phone: form.phone, email: form.email })
        .eq("id", userId);

      navigate({ to: "/claim-submitted", search: { ref: claim.reference } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit your claim.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-extrabold text-navy">File a Claim</h1>
        <p className="mt-2 text-muted-foreground">
          Five short steps. We'll take it from there.
        </p>

        <ol className="mt-8 flex flex-wrap gap-2">
          {STEPS.map((label, i) => (
            <li
              key={label}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium",
                i === step
                  ? "border-navy bg-navy text-navy-foreground"
                  : i < step
                    ? "border-success/40 bg-success/10 text-success"
                    : "border-border text-muted-foreground",
              )}
            >
              {i < step ? <Check className="size-3.5" /> : <span>{i + 1}</span>}
              {label}
            </li>
          ))}
        </ol>

        <Card className="mt-6">
          <CardContent className="space-y-5 pt-6">
            {step === 0 ? (
              <>
                <div className="space-y-1.5" ref={airlineRef}>
                  <Label htmlFor="airline">Airline</Label>
                  <Input
                    id="airline"
                    placeholder="Search or choose an airline"
                    value={form.airline_name || airlineQuery}
                    onFocus={() => setAirlineOpen(true)}
                    onChange={(e) => {
                      setAirlineOpen(true);
                      setAirlineQuery(e.target.value);
                      set("airline_name", e.target.value);
                    }}
                  />
                  {showGroupedList ? (
                    <div className="max-h-80 overflow-auto rounded-md border border-border bg-popover shadow-sm">
                      {airlineQuery ? (
                        <div className="border-b border-border px-3 py-2">
                          <button
                            type="button"
                            className="block w-full text-left text-sm font-medium text-navy hover:text-brand-blue"
                            onClick={() => {
                              set("airline_name", airlineQuery);
                              setAirlineQuery("");
                              setAirlineOpen(false);
                            }}
                          >
                            Use “{airlineQuery}”
                          </button>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Can’t see your airline? Type it manually.
                          </p>
                        </div>
                      ) : null}
                      {AIRLINE_GROUPS.map((group) => (
                        <div key={group.label} className="border-b border-border last:border-0">
                          <div className="bg-muted/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {group.label}
                          </div>
                          <div className="py-1">
                            {group.airlines.map((a) => (
                              <button
                                key={a.name}
                                type="button"
                                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-accent/10"
                                onClick={() => {
                                  set("airline_name", a.name);
                                  setAirlineQuery("");
                                  setAirlineOpen(false);
                                }}
                              >
                                <span>{a.name}</span>
                                <span className="text-xs text-muted-foreground">{a.iata}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                      <div className="px-3 py-2">
                        <button
                          type="button"
                          className="block w-full text-left text-xs text-muted-foreground hover:text-navy"
                          onClick={() => {
                            set("airline_name", airlineQuery || form.airline_name);
                            setAirlineOpen(false);
                          }}
                        >
                          Other airline — type it above
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="fn">Flight number</Label>
                    <Input id="fn" placeholder="e.g. BA123" maxLength={10} value={form.flight_number} onChange={(e) => set("flight_number", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="fd">Date of flight</Label>
                    <Input id="fd" type="date" value={form.flight_date} onChange={(e) => set("flight_date", e.target.value)} />
                  </div>
                  <AirportField
                    id="dep"
                    label="Departure airport"
                    placeholder="e.g. London Heathrow (LHR)"
                    value={form.departure_airport}
                    onChange={(v) => set("departure_airport", v)}
                  />
                  <AirportField
                    id="arr"
                    label="Arrival airport"
                    placeholder="e.g. Nairobi (NBO)"
                    value={form.arrival_airport}
                    onChange={(v) => set("arrival_airport", v)}
                  />
                </div>
              </>
            ) : null}

            {step === 1 ? (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="issue">What happened?</Label>
                  <Select value={form.issue_type} onValueChange={(v) => set("issue_type", v)}>
                    <SelectTrigger id="issue">
                      <SelectValue placeholder="Select issue" />
                    </SelectTrigger>
                    <SelectContent>
                      {ISSUE_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="desc">Tell us more</Label>
                  <Textarea
                    id="desc"
                    rows={6}
                    maxLength={2000}
                    placeholder="Describe what happened, how long you were delayed and any costs you had."
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                  />
                </div>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    addFiles(e.dataTransfer.files);
                  }}
                  className={cn(
                    "flex flex-col items-center rounded-xl border-2 border-dashed p-10 text-center",
                    dragging ? "border-brand-blue bg-brand-blue-soft" : "border-border",
                  )}
                >
                  <FileUp className="size-8 text-brand-blue" />
                  <p className="mt-3 font-medium text-navy">Drag & drop your documents</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Boarding pass, booking confirmation, baggage tags, receipts (max 10MB each)
                  </p>
                  <Button type="button" variant="outline" className="mt-4" onClick={() => fileInput.current?.click()}>
                    Browse files
                  </Button>
                  <input
                    ref={fileInput}
                    type="file"
                    multiple
                    hidden
                    onChange={(e) => addFiles(e.target.files)}
                  />
                </div>
                {files.length > 0 ? (
                  <ul className="space-y-2">
                    {files.map((file, i) => (
                      <li key={`${file.name}-${i}`} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
                        <span className="truncate">{file.name}</span>
                        <button
                          type="button"
                          aria-label={`Remove ${file.name}`}
                          onClick={() => setFiles((p) => p.filter((_, idx) => idx !== i))}
                        >
                          <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </>
            ) : null}

            {step === 3 ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" maxLength={100} value={form.full_name} onChange={(e) => set("full_name", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" maxLength={255} value={form.email} onChange={(e) => set("email", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" maxLength={30} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="pw">Password</Label>
                    <Input id="pw" type="password" maxLength={72} value={form.password} onChange={(e) => set("password", e.target.value)} />
                    <p className="text-xs text-muted-foreground">Used to create your claim dashboard.</p>
                  </div>
                </div>
                <label className="flex items-start gap-3 rounded-lg border border-border p-4 text-sm">
                  <Checkbox checked={authorized} onCheckedChange={(v) => setAuthorized(v === true)} />
                  I authorize JetClaim to act on my behalf regarding this claim.
                </label>
              </>
            ) : null}

            {step === 4 ? (
              <div className="space-y-3 text-sm">
                <Row label="Airline" value={form.airline_name} />
                <Row label="Flight" value={`${form.flight_number} · ${form.flight_date}`} />
                <Row label="Route" value={`${form.departure_airport} → ${form.arrival_airport}`} />
                <Row label="Issue" value={form.issue_type} />
                <Row label="Description" value={form.description || "—"} />
                <Row label="Documents" value={files.length ? `${files.length} file(s)` : "None"} />
                <Row label="Contact" value={`${form.full_name} · ${form.email}${form.phone ? ` · ${form.phone}` : ""}`} />
              </div>
            ) : null}

            <div className="flex justify-between gap-3 pt-2">
              <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
                <ArrowLeft className="size-4" /> Back
              </Button>
              {step < STEPS.length - 1 ? (
                <Button onClick={next} className="gap-2 bg-navy text-navy-foreground hover:bg-navy-deep">
                  Continue <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button onClick={submit} disabled={submitting} className="gap-2 bg-navy text-navy-foreground hover:bg-navy-deep">
                  {submitting ? <Loader2 className="size-4 animate-spin" /> : "Submit Claim"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6 border-b border-border pb-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-navy">{value}</span>
    </div>
  );
}

function AirportField({
  id,
  label,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? AIRPORT_GROUPS.flatMap((g) => g.airports).filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.city.toLowerCase().includes(q) ||
          a.iata.toLowerCase().includes(q),
      )
    : null;

  return (
    <div className="space-y-1.5" ref={ref}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        placeholder={placeholder}
        maxLength={60}
        value={value}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setOpen(true);
          setQuery(e.target.value);
          onChange(e.target.value);
        }}
      />
      {open ? (
        <div className="max-h-64 overflow-auto rounded-md border border-border bg-popover shadow-sm">
          {q ? (
            <div className="border-b border-border px-3 py-2">
              <button
                type="button"
                className="block w-full text-left text-sm font-medium text-navy hover:text-brand-blue"
                onClick={() => {
                  onChange(query);
                  setQuery("");
                  setOpen(false);
                }}
              >
                Use “{query}”
              </button>
              <p className="mt-1 text-xs text-muted-foreground">
                Can't see your airport? Type it manually.
              </p>
            </div>
          ) : null}
          {filtered ? (
            filtered.length ? (
              <div className="py-1">
                {filtered.map((a) => (
                  <AirportOption key={a.iata} airport={a} onSelect={() => {
                    onChange(`${a.city} (${a.iata})`);
                    setQuery("");
                    setOpen(false);
                  }} />
                ))}
              </div>
            ) : (
              <p className="px-3 py-2 text-xs text-muted-foreground">No matches — type it manually above.</p>
            )
          ) : (
            AIRPORT_GROUPS.map((group) => (
              <div key={group.label} className="border-b border-border last:border-0">
                <div className="bg-muted/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {group.label}
                </div>
                <div className="py-1">
                  {group.airports.map((a) => (
                    <AirportOption key={a.iata} airport={a} onSelect={() => {
                      onChange(`${a.city} (${a.iata})`);
                      setOpen(false);
                    }} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}

function AirportOption({ airport, onSelect }: { airport: { name: string; iata: string; city: string }; onSelect: () => void }) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-accent/10"
      onClick={onSelect}
    >
      <span>{airport.name} · {airport.city}</span>
      <span className="text-xs text-muted-foreground">{airport.iata}</span>
    </button>
  );
}
