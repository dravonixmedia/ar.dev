export async function submitEnquiry(formData: FormData): Promise<boolean> {
  try {
    const res = await fetch("/api/enquiry", { method: "POST", body: formData });
    if (!res.ok) return false;
    const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
    return data?.ok === true;
  } catch {
    return false;
  }
}
