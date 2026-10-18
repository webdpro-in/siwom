/** Web3Forms access keys are public form identifiers, not private API secrets. */
export const WEB3FORMS_ACCESS_KEY = "c80e91a1-8d10-4585-b010-46b3a1395ea8";

export async function submitEnquiry(fields: { name: string; email: string; message: string; company: string; interest: string }, request: typeof fetch = fetch): Promise<boolean> {
  const response = await request("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    signal: AbortSignal.timeout(15_000),
    body: JSON.stringify({
      access_key: WEB3FORMS_ACCESS_KEY,
      name: fields.name,
      email: fields.email,
      message: fields.message,
      company: fields.company,
      interest: fields.interest,
      subject: `SIWOM enquiry: ${fields.company} (${fields.interest})`,
      from_name: "SIWOM Website",
      botcheck: false,
    }),
  });
  const result: unknown = await response.json().catch(() => null);
  return response.ok && typeof result === "object" && result !== null && "success" in result && result.success === true;
}
