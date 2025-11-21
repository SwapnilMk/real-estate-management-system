import {
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Github,
} from "lucide-react";
import { Link } from "react-router-dom";

interface SiteFooterProps {
  darkMode?: boolean;
}

export function SiteFooter({ darkMode = false }: SiteFooterProps) {
  const bgColor = darkMode ? "bg-gray-900" : "bg-black";
  const textColor = "text-gray-100";
  const mutedTextColor = "text-gray-400";

  return (
    <footer className={`${bgColor} ${textColor} py-12 px-4`}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div>
                <div className="text-2xl font-bold">REAL ESTATE</div>
              </div>
            </div>

            <p className={`text-sm ${mutedTextColor}`}>
              © {new Date().getFullYear()} Real Estate Project by <br />
              <a
                href="https://github.com/SwapnilMk"
                className="font-bold text-md hover:underline"
              >
                Swapnil Mahadik
              </a>
            </p>

            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/swapmahadik/"
                target="_blank"
                rel="noopener noreferrer"
                className={`${mutedTextColor} hover:text-white`}
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/swapyy_mk/"
                target="_blank"
                rel="noopener noreferrer"
                className={`${mutedTextColor} hover:text-white`}
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/Swapy_mk"
                target="_blank"
                rel="noopener noreferrer"
                className={`${mutedTextColor} hover:text-white`}
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/SwapnilMk"
                target="_blank"
                rel="noopener noreferrer"
                className={`${mutedTextColor} hover:text-white`}
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="font-bold mb-4 text-lg">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>7057332679</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>mswapnil218@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:underline">
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
