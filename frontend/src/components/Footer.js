import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { Mail, Phone, MapPin, ArrowUpRight, Github, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative border-t border-white/[0.04]" data-testid="footer">
      {/* Top gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-4">
            <Logo size="md" />
            <p className="mt-6 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Professional veb həllər yaradan texnologiya komandası. Gələcəyin rəqəmsal dünyasını birlikdə qururuq.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: Github, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Instagram, href: '#' },
              ].map((social, i) => (
                <a key={i} href={social.href} className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:bg-primary/10 hover:border-primary/30 transition-all duration-300">
                  <social.icon className="w-4 h-4 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-5">Keçidlər</h4>
            <ul className="space-y-3.5">
              {[
                { label: 'Ana Səhifə', path: '/' },
                { label: 'Haqqımızda', path: '/about' },
                { label: 'Kataloq', path: '/catalogue' },
                { label: 'Əlaqə', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 group">
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-5">Xidmətlər</h4>
            <ul className="space-y-3.5">
              {['Biznes Saytlar', 'E-Ticarət Həlləri', 'Landing Səhifə', 'Korporativ Həll', 'Startup MVP', 'Mobil Tətbiqlər'].map((s) => (
                <li key={s}><span className="text-sm text-muted-foreground">{s}</span></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-5">Əlaqə</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">info@techtribe.az</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">+994 50 123 45 67</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Bakı, Azərbaycan</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/60">&copy; {new Date().getFullYear()} TechTribe. Bütün hüquqlar qorunur.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors">Gizlilik Siyasəti</a>
            <a href="#" className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors">İstifadə Şərtləri</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
