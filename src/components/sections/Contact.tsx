import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { validateContactForm, type ContactFormErrors, type ContactFormValues } from '../../lib/validateContactForm';
import { submitContactForm } from '../../lib/submitContactForm';

const INITIAL_VALUES: ContactFormValues = { name: '', email: '', message: '' };

export function Contact() {
  const [values, setValues] = useState<ContactFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const honeypot = (event.currentTarget.elements.namedItem('company') as HTMLInputElement | null)?.value;
    if (honeypot) return;

    const validationErrors = validateContactForm(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus('submitting');
    try {
      await submitContactForm(values);
      setStatus('success');
      setValues(INITIAL_VALUES);
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="contact" className="mx-auto max-w-2xl px-6 py-24">
      <SectionHeading eyebrow="Contact" title="Let's build something together" />
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-10 space-y-5"
        noValidate
      >
        <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

        <div>
          <label htmlFor="name" className="text-sm font-medium text-ink/80">
            Name
          </label>
          <input
            id="name"
            name="name"
            value={values.name}
            onChange={(e) => setValues((prev) => ({ ...prev, name: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-elevated px-4 py-3 text-ink focus:border-coral-500 focus:outline-none"
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium text-ink/80">
            Email (optional)
          </label>
          <input
            id="email"
            name="email"
            value={values.email}
            onChange={(e) => setValues((prev) => ({ ...prev, email: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-elevated px-4 py-3 text-ink focus:border-coral-500 focus:outline-none"
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="message" className="text-sm font-medium text-ink/80">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={values.message}
            onChange={(e) => setValues((prev) => ({ ...prev, message: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-elevated px-4 py-3 text-ink focus:border-coral-500 focus:outline-none"
          />
          {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
        </div>

        <Button type="submit" className="w-full">{status === 'submitting' ? 'Sending…' : 'Send message'}</Button>

        {status === 'success' && (
          <p className="text-sm text-emerald-600">Thanks for reaching out — I&apos;ll reply soon.</p>
        )}
        {status === 'error' && (
          <p className="text-sm text-red-500">Something went wrong. Please email me directly instead.</p>
        )}
      </motion.form>
    </section>
  );
}
