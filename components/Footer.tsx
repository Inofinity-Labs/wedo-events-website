import Image from "next/image";
import { SITE } from "@/lib/content";
import { whatsappLink } from "@/lib/whatsapp";
import { WhatsApp } from "./icons";

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__grid glass">
          <Image
            className="footer__logo"
            src="/images/wedo-logo.png"
            alt="WeDo — Remembered Always"
            width={618}
            height={421}
          />
          <div className="footer__alerts">
            <p>First to know about new shows</p>
            <a
              className="btn btn--solid"
              href={whatsappLink("Hi WeDo! Please add me to your new-show alerts.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsApp /> Get show alerts on WhatsApp
            </a>
          </div>
          <div className="footer__contact">
            <span>{SITE.location}</span>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <span>© {new Date().getFullYear()} WeDo Events</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
