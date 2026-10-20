import { SITE } from "./content";

export function whatsappLink(message: string, number = SITE.whatsappNumber) {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
