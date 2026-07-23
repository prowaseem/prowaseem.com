import { describe, expect, it } from 'vitest';
import { validateContactForm } from './validateContactForm';

describe('validateContactForm', () => {
  it('requires a name', () => {
    const errors = validateContactForm({ name: '', email: '', message: 'Hello there, testing.' });
    expect(errors.name).toBe('Name is required.');
  });

  it('requires a message of at least 10 characters', () => {
    const errors = validateContactForm({ name: 'Jane', email: '', message: 'short' });
    expect(errors.message).toBe('Message should be at least 10 characters.');
  });

  it('allows a blank email since it is optional', () => {
    const errors = validateContactForm({ name: 'Jane', email: '', message: 'Hello there, testing.' });
    expect(errors.email).toBeUndefined();
  });

  it('flags an invalid email format when provided', () => {
    const errors = validateContactForm({ name: 'Jane', email: 'not-an-email', message: 'Hello there, testing.' });
    expect(errors.email).toBe('Enter a valid email address.');
  });

  it('passes with valid values', () => {
    const errors = validateContactForm({ name: 'Jane', email: 'jane@example.com', message: 'Hello there, testing.' });
    expect(errors).toEqual({});
  });
});
