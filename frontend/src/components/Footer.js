import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative border-t border-white/5" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Logo size="md" />
            <p className="mt-5 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Professional veb həllər yaradan texnologiya komandası. Gələcəyin rəqəmsal dünyasını birlikdə qururuq.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-5">Keçidlər</h4>
            <ul className="space-y-3">
              {[
                { label: 'Ana Səhifə', path: '/' },
                { label: 'Haqqımızda', path: '/about' },
                { label: 'Kataloq', path: '/catalogue' },
                { label: 'Əlaqə', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group">
                    {link.label}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-5">Xidmətlər</h4>
            <ul className="space-y-3">
              {['Biznes Saytlar', 'E-Ticarət', 'Landing Səhifə', 'Portfolio', 'Korporativ Həll', 'Startup Paket'].map((s) => (
                <li key={s}>
                  <span className="text-sm text-muted-foreground">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-5">Əlaqə</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">info@techtribe.az</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">+994 50 123 45 67</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span className="text-sm text-muted-foreground">Bakı, Azərbaycan</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} TechTribe. Bütün hüquqlar qorunur.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Gizlilik Siyasəti</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">İstifadə Şərtləri</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
