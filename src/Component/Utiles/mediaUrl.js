import { API_URL } from "../Server/Server";

export function resolveMediaUrl(imagePath) {
  if (imagePath == null || imagePath === "") return "";
  const raw =
    typeof imagePath === "string" ? imagePath.trim() : String(imagePath);
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  const base = API_URL.replace(/\/$/, "");
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  return `${base}${path}`;
}

export function getCategoryImageUrl(category) {
  if (!category) return null;
  const keys = [category.imageUrl, category.imageurl, category.imageURL];
  for (const k of keys) {
    const u = resolveMediaUrl(k);
    if (u) return u;
  }
  const items = category.items || [];
  for (const item of items) {
    const u = resolveMediaUrl(item?.imageUrl ?? item?.imageurl);
    if (u) return u;
  }
  return null;
}
