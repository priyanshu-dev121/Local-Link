import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Globe, MessageCircle, Video, Briefcase } from "lucide-react";

const footerLinks = {
  Services: [
    { label: "Plumbing", href: "/services" },
    { label: "Electrical", href: "/services" },
    { label: "Cleaning", href: "/services" },
    { label: "Tutoring", href: "/services" },
    { label: "Painting", href: "/services" },
    { label: "Delivery", href: "/services" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "How it Works", href: "/how-it-works" },
    { label: "Blog", href: "/blog" },
    { label: "Rulebook", href: "/terms" },
    { label: "Press", href: "/press" },
  ],
  Contact: [
    { label: "rajanbhatt257@gmail.com", href: "mailto:rajanbhatt257@gmail.com", icon: Mail },
    { label: "+91 9580811395", href: "tel:+919580811395", icon: Phone },
    { label: "Lucknow, India", href: "#", icon: MapPin },
  ],
};

const XIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const socials = [
  { Icon: XIcon,         href: "#", label: "X (Twitter)" },
  { Icon: MessageCircle, href: "#", label: "Discord" },
  { Icon: Briefcase,     href: "#", label: "LinkedIn" },
  { Icon: Video,         href: "#", label: "YouTube" },
  { Icon: Globe,         href: "#", label: "Website" },
];

const hoverColors = {
  Services: "hover:text-violet-400",
  Company:  "hover:text-amber-400",
  Contact:  "hover:text-cyan-400",
};

const Footer = () => (
  <footer className="relative bg-[#0a0a0a] text-white overflow-hidden">

    <div className="flex items-center justify-center pointer-events-none select-none overflow-hidden pt-12 pb-8">
      <span
        className="font-display font-extrabold uppercase leading-none text-[clamp(5rem,18vw,22rem)] tracking-tighter"
        style={{
          WebkitTextStroke: "2px rgba(255,255,255,0.08)",
          color: "transparent",
        }}
      >
        LocalLink
      </span>
    </div>

    <div className="container mx-auto px-6 pt-12 pb-20 relative z-10">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1.4fr] gap-12 mb-16">

        <div>
          <Link to="/" className="flex items-center gap-3 group mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-amber-500 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-extrabold text-2xl tracking-tight">LocalLink</span>
          </Link>
          <p className="text-sm text-white/50 leading-relaxed max-w-xs">
            Connecting you with trusted local service providers in your neighbourhood. Quality services, just around the corner.
          </p>

          <div className="flex gap-3 mt-8">
            {socials.map(({ Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                whileHover={{ y: -4, scale: 1.15 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-violet-400 hover:border-violet-400/50 hover:bg-violet-400/10 transition-colors duration-300"
              >
                <Icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </div>

        {Object.keys(footerLinks).map((col) => (
          <div key={col}>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/30 mb-6">{col}</h4>
            <ul className="space-y-3">
              {footerLinks[col].map((item) => (
                <li key={item.label}>
                  {item.icon ? (
                    <a
                      href={item.href}
                      className={`flex items-center gap-2 text-sm text-white/50 transition-colors duration-200 ${hoverColors[col]}`}
                    >
                      <item.icon className="w-3.5 h-3.5 shrink-0 opacity-60" />
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      to={item.href}
                      className={`text-sm text-white/50 transition-colors duration-200 ${hoverColors[col]}`}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/25 text-center">
        <span>© {new Date().getFullYear()} LocalLink. All rights reserved.</span>
        <span className="hidden sm:block">Built with ❤️ for Kalpathon 2.0</span>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { label: "Privacy Policy", path: "/terms" },
            { label: "Terms & Conditions", path: "/terms" },
            { label: "Rulebook", path: "/terms" }
          ].map((t) => (
            <Link key={t.label} to={t.path} className="hover:text-primary transition-colors duration-200">{t.label}</Link>
          ))}
        </div>
      </div>

    </div>
  </footer>
);

export default Footer;
