declare global {
  interface Window {
    grecaptcha: any;
  }
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Executes Google reCAPTCHA v3 and returns the token.
 */
export async function executeRecaptcha(action: string): Promise<string | null> {
  if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) return null;

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  // Load reCAPTCHA script if not already present
  if (!window.grecaptcha) {
    await new Promise<void>((resolve) => {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  }

  // Wait for grecaptcha to be ready and execute
  return new Promise((resolve) => {
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(siteKey, { action })
        .then((token: string) => resolve(token))
        .catch((err: any) => {
          console.error('Error executing reCAPTCHA:', err);
          resolve(null);
        });
    });
  });
}

/**
 * Verifies a reCAPTCHA token with your backend.
 */
export async function verifyCaptchaToken(token: string): Promise<boolean> {
  try {
    console.log(token);
    const res = await fetch(`${API_BASE}/captcha/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    if (!res.ok) return false;

    const data = await res.json();
    console.log(data);
    return !!data.success;
  } catch (err) {
    console.error('Captcha verification error:', err);
    return false;
  }
}
