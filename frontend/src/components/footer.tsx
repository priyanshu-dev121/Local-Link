import { Link } from "react-router-dom";
import { MapPin, Mail, Phone, Globe, MessageCircle, Camera, Briefcase } from "lucide-react";

const Footer = () => (
  <footer className="bg-secondary text-secondary-foreground">
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">NeighbourHub</span>
          </div>
          <p className="text-sm text-secondary-foreground/70 leading-relaxed">
            Connecting you with trusted local service providers in your neighbourhood. Quality services, just around the corner.
          </p>
          <div className="flex gap-3 mt-5">
            {[Globe, MessageCircle, Camera, Briefcase].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">Services</h4>
          <ul className="space-y-2 text-sm text-secondary-foreground/70">
            {["Plumbing", "Electrical", "Tutoring", "Cleaning", "Mechanics", "Delivery"].map(s => (
              <li key={s}><Link to="/services" className="hover:text-primary transition-colors">{s}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-secondary-foreground/70">
            {["About Us", "How it Works", "Careers", "Blog", "Press"].map(s => (
              <li key={s}><a href="#" className="hover:text-primary transition-colors">{s}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-secondary-foreground/70">
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> rajanbhatt257@gmail.com</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> +91 9580811395</li>
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Lucknow, India</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-secondary-foreground/10 text-center text-sm text-secondary-foreground/50">
        © {new Date().getFullYear()} NeighbourHub. All rights reserved. Built for Kalpathon 2.0
      </div>
    </div>
  </footer>
);

export default Footer;
