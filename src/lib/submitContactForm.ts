import type { ContactFormValues } from './validateContactForm';

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

export async function submitContactForm(values: ContactFormValues): Promise<void> {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined;
  if (!accessKey) {
    throw new Error('Missing VITE_WEB3FORMS_ACCESS_KEY environment variable.');
  }

  const response = await fetch(WEB3FORMS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: accessKey,
      name: values.name,
      email: values.email || 'not-provided@prowaseem.com',
      message: values.message,
      subject: `New portfolio message from ${values.name}`,
    }),
  });

  const result = (await response.json()) as { success: boolean; message?: string };
  if (!result.success) {
    throw new Error(result.message ?? 'Submission failed.');
  }
}
