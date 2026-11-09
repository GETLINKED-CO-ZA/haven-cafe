# Haven Café website

Premium responsive two-view website for Haven Café. The navigation switches between the landing page and booking enquiry page. The booking form sends an email through Brevo using a Vercel serverless function; the Brevo API key is **never placed in browser code**.

## Deploy to GitHub + Vercel

1. Upload the contents of this folder to a GitHub repository.
2. Import that repository into Vercel (Framework Preset: Other; no build command needed).
3. In Vercel → Project → Settings → Environment Variables, add:
   - `BREVO_API_KEY` — your Brevo API key (keep secret; do not prefix with `VITE_` or `NEXT_PUBLIC_`).
   - `BREVO_SENDER_EMAIL` — a sender address verified in Brevo.
   - `BREVO_SENDER_NAME` — `Haven Café`.
   - `BOOKING_TO_EMAIL` — the email inbox that should receive booking enquiries.
4. Redeploy after adding/changing environment variables.
5. Test a booking enquiry on the deployed domain.

The form is an enquiry only. It does not check availability or confirm a reservation.

## Image assets

Put the following image files in `/assets/` (use these exact names):
- `haven-hero.jpg` — wide hero image, ideally 2200×1400 or larger; green veranda / people gathered around the table.
- `haven-veranda.jpg` — landscape image for the split “The Space” section, ideally 1600×1400; veranda, wooden table or poolside garden.

If the images are not present, the page falls back to a forest-green colour background. Use images Haven Café owns or has permission to use. Keep the files reasonably compressed (WebP is fine if you also update the filenames in `index.html`).

## Contact details

The WhatsApp number is configured in `index.html` as `27826959988` (international format, digits only). Change `WA_NUMBER` if the official number changes.

## Email delivery notes

- Verify the sender/domain in Brevo before sending live email.
- Set all four environment variables in Vercel.
- The serverless endpoint validates required fields and sends the enquiry to `BOOKING_TO_EMAIL`.
- Never commit API keys to GitHub or put them in HTML/JavaScript.

## Haven Café logo
The supplied logo has been added to the navigation, footer and favicon:
- `assets/haven-cafe-logo.png` — web version with warm light lettering for dark backgrounds.
- `assets/haven-cafe-logo-original.png` — original uploaded logo, preserved unchanged.
