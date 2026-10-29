"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CircleCheck, LoaderCircle, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type ContactInput, contactSchema } from "@/lib/validation";
import type { ContactResponse } from "@/types";

/** The one place the browser talks to the contact API. */
async function sendContact(input: ContactInput): Promise<ContactResponse> {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const body = (await response.json().catch(() => null)) as ContactResponse | null;
  if (!response.ok || !body?.ok) {
    const error = new Error(body?.message ?? "Something went wrong. Please try again.") as Error & { body?: ContactResponse };
    error.body = body ?? undefined;
    throw error;
  }
  return body;
}

const FIELDS = ["name", "email", "message"] as const;

export function ContactForm() {
  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "", company: "" },
    mode: "onTouched",
  });
  const { register, handleSubmit, formState, setError, reset } = form;
  const { errors } = formState;

  const mutation = useMutation({
    mutationFn: sendContact,
    onSuccess: (body) => {
      toast.success("Message sent", { description: body.message });
      reset();
    },
    onError: (error: Error & { body?: ContactResponse }) => {
      // Map server-side field errors back onto the inputs (the server re-validates everything).
      for (const field of FIELDS) {
        const message = error.body?.fieldErrors?.[field]?.[0];
        if (message) setError(field, { message });
      }
      toast.error("Couldn't send your message", { description: error.message });
    },
  });

  if (mutation.isSuccess) {
    return (
      <div role="status" className="flex flex-col items-start gap-4 rounded-xl border border-primary/30 bg-primary/5 p-6">
        <CircleCheck aria-hidden="true" className="size-7 text-primary" />
        <p className="text-xl font-bold">Thanks — your message is in my inbox.</p>
        <p className="text-muted-foreground">{mutation.data.message}</p>
        <Button variant="outline" onClick={() => mutation.reset()}>
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit((values) => mutation.mutate(values))} className="flex flex-col gap-5">
      <Field id="name" label="Name" error={errors.name?.message}>
        <Input id="name" autoComplete="name" placeholder="Your name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} {...register("name")} />
      </Field>
      <Field id="email" label="Email" error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" inputMode="email" placeholder="you@company.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} {...register("email")} />
      </Field>
      <Field id="message" label="Message" error={errors.message?.message}>
        <Textarea id="message" rows={6} placeholder="What are you building, and where could I help?" aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "message-error" : undefined} {...register("message")} />
      </Field>

      {/* Honeypot: off-screen and skipped by keyboard and screen readers; bots fill it, people never see it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" tabIndex={-1} autoComplete="off" {...register("company")} />
      </div>

      <Button type="submit" size="lg" disabled={mutation.isPending} className="sm:self-start">
        {mutation.isPending ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : <Send aria-hidden="true" />}
        {mutation.isPending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-mono text-xs font-medium text-muted-foreground">
        {label.toLowerCase()}
        <span className="text-primary">*</span>
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
