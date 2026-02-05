import { resolveTxt, resolve4 } from "dns/promises";

export async function verifyDNS(
  domain: string,
  expectedTxt: string,
  expectedIP: string,
): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];

  // Check TXT record
  try {
    const records = await resolveTxt(domain);
    const found = records.flat().some((r) => r === expectedTxt);
    if (!found) errors.push("Record TXT di verifica non trovato");
  } catch {
    errors.push("Impossibile risolvere record TXT");
  }

  // Check A record
  try {
    const addresses = await resolve4(domain);
    if (!addresses.includes(expectedIP))
      errors.push(`Record A non punta a ${expectedIP}`);
  } catch {
    errors.push("Impossibile risolvere record A");
  }

  return { valid: errors.length === 0, errors };
}
