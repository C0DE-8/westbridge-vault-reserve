import { API_ORIGIN } from "../api/axios";

export function resolveAsset(url) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_ORIGIN}${url}`;
}
