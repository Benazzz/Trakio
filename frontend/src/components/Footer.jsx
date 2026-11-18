import { ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <span>© 2026 Trakio</span>
        <nav className="footer-links" aria-label="Footer">
          <a
            href="https://github.com/Benazzz/Trakio"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
            <ExternalLink size={14} aria-hidden="true" />
          </a>
        </nav>
      </div>
    </footer>
  );
}
