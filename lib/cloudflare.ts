const CF_API = "https://api.cloudflare.com/client/v4";

function getHeaders() {
  const email = process.env.CLOUDFLARE_EMAIL;
  const apiKey = process.env.CLOUDFLARE_API_KEY;
  if (!email || !apiKey) {
    throw new Error("CLOUDFLARE_EMAIL e CLOUDFLARE_API_KEY devono essere configurati");
  }
  return {
    "X-Auth-Email": email,
    "X-Auth-Key": apiKey,
    "Content-Type": "application/json",
  };
}

interface CloudflareResponse<T> {
  success: boolean;
  errors: { code: number; message: string }[];
  result: T;
}

interface Zone {
  id: string;
  name: string;
  status: string;
  name_servers: string[];
}

interface DNSRecord {
  id: string;
  type: string;
  name: string;
  content: string;
  proxied: boolean;
  ttl: number;
}

export async function createZone(domain: string): Promise<{ zoneId: string; nameservers: string[] }> {
  const res = await fetch(`${CF_API}/zones`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      name: domain,
      type: "full",
      jump_start: false,
    }),
  });

  const data: CloudflareResponse<Zone> = await res.json();

  if (!data.success) {
    const msg = data.errors.map((e) => e.message).join(", ");
    throw new Error(`Cloudflare createZone: ${msg}`);
  }

  return {
    zoneId: data.result.id,
    nameservers: data.result.name_servers,
  };
}

export async function addDNSRecord(
  zoneId: string,
  type: string,
  name: string,
  content: string,
  proxied: boolean = false,
): Promise<DNSRecord> {
  const res = await fetch(`${CF_API}/zones/${zoneId}/dns_records`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ type, name, content, proxied, ttl: 1 }),
  });

  const data: CloudflareResponse<DNSRecord> = await res.json();

  if (!data.success) {
    const msg = data.errors.map((e) => e.message).join(", ");
    throw new Error(`Cloudflare addDNSRecord: ${msg}`);
  }

  return data.result;
}

export async function deleteZone(zoneId: string): Promise<void> {
  const res = await fetch(`${CF_API}/zones/${zoneId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  const data: CloudflareResponse<{ id: string }> = await res.json();

  if (!data.success) {
    const msg = data.errors.map((e) => e.message).join(", ");
    throw new Error(`Cloudflare deleteZone: ${msg}`);
  }
}

export async function getZoneStatus(zoneId: string): Promise<{ status: string; nameservers: string[] }> {
  const res = await fetch(`${CF_API}/zones/${zoneId}`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data: CloudflareResponse<Zone> = await res.json();

  if (!data.success) {
    const msg = data.errors.map((e) => e.message).join(", ");
    throw new Error(`Cloudflare getZoneStatus: ${msg}`);
  }

  return {
    status: data.result.status,
    nameservers: data.result.name_servers,
  };
}

async function listDNSRecords(zoneId: string): Promise<DNSRecord[]> {
  const res = await fetch(`${CF_API}/zones/${zoneId}/dns_records?per_page=100`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data: CloudflareResponse<DNSRecord[]> = await res.json();

  if (!data.success) {
    const msg = data.errors.map((e) => e.message).join(", ");
    throw new Error(`Cloudflare listDNSRecords: ${msg}`);
  }

  return data.result;
}
