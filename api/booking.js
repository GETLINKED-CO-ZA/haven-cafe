// Vercel serverless function: POST /api/booking
// Required environment variables:
// BREVO_API_KEY, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME, BOOKING_TO_EMAIL
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { BREVO_API_KEY, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME, BOOKING_TO_EMAIL } = process.env;
  if (!BREVO_API_KEY || !BREVO_SENDER_EMAIL || !BOOKING_TO_EMAIL) {
    return res.status(500).json({ error: "Email service is not configured yet." });
  }
  const b = req.body || {};
  const required = ["name", "email", "phone", "eventType", "duration", "guests", "date"];
  if (required.some(k => !String(b[k] ?? "").trim())) {
    return res.status(400).json({ error: "Please complete all required fields." });
  }
  const email = String(b.email).trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }
  const safe = v => String(v ?? "").replace(/[<>]/g, "").slice(0, 2000);
  const details = [
    ["Name", safe(b.name)], ["Email", safe(email)], ["Phone", safe(b.phone)],
    ["Event", safe(b.eventType)], ["Duration", safe(b.duration)],
    ["Guests", safe(b.guests)], ["Preferred date", safe(b.date)],
    ["Preferred time", safe(b.time || "Flexible / to discuss")],
    ["Catering", safe(Array.isArray(b.catering) ? b.catering.join(", ") : "")],
    ["Additional details", safe(b.message || "None")]
  ];
  const html = `<h2>New Haven Café booking enquiry</h2><p><strong>Enquiry only — not a confirmed booking.</strong></p><table cellpadding="8" cellspacing="0" border="0">${details.map(([k,v]) => `<tr><td><strong>${k}</strong></td><td>${v.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</td></tr>`).join("")}</table>`;
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "accept": "application/json", "api-key": BREVO_API_KEY, "content-type": "application/json" },
      body: JSON.stringify({
        sender: { name: BREVO_SENDER_NAME || "Haven Café Website", email: BREVO_SENDER_EMAIL },
        to: [{ email: BOOKING_TO_EMAIL }],
        replyTo: { email, name: safe(b.name) },
        subject: `New venue enquiry — ${safe(b.eventType)} — ${safe(b.date)}`,
        htmlContent: html
      })
    });
    if (!response.ok) {
      const detail = await response.text();
      console.error("Brevo error:", response.status, detail);
      return res.status(502).json({ error: "The email provider could not accept the enquiry." });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Booking email error:", error);
    return res.status(500).json({ error: "Unable to send enquiry right now." });
  }
}
