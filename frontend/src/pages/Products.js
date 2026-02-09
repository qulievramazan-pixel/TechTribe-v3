import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Globe, ShoppingCart, Rocket, Briefcase, Layout, Smartphone,
  ArrowRight, CheckCircle2, Sparkles, Star, Zap
} from 'lucide-react';
import { Button } from '../components/ui/button';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.7, ease: [0.23, 1, 0.32, 1] } })
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const services = [
  {
    icon: Globe,
    title: 'Biznes Veb Sayt',
    desc: 'Şirkətinizin onlayn imicini professional səviyyədə yaradırıq.',
    features: ['Responsive dizayn', 'SEO optimallaşdırma', 'CMS paneli', 'Əlaqə forması'],
    price: '499',
    color: 'from-blue-500/20 to-cyan-500/10'
  },
  {
    icon: ShoppingCart,
    title: 'E-Ticarət Həlli',
    desc: 'Güclü onlayn mağaza platforması ilə satışlarınızı artırın.',
    features: ['Məhsul idarəetmə', 'Ödəniş sistemi', 'Sifariş izləmə', 'Analitika'],
    price: '999',
    color: 'from-violet-500/20 to-purple-500/10'
  },
  {
    icon: Rocket,
    title: 'Landing Səhifə',
    desc: 'Yüksək konversiya dərəcəli hədəf səhifələr yaradırıq.',
    features: ['A/B testləmə', 'Forma inteqrasiyası', 'Sürətli yüklənmə', 'Animasiyalar'],
    price: '299',
    color: 'from-emerald-500/20 to-teal-500/10'
  },
  {
    icon: Briefcase,
    title: 'Portfolio Saytı',
    desc: 'İşlərinizi dünyaya professional şəkildə nümayiş etdirin.',
    features: ['Qalerya sistemi', 'Blog', 'CV bölməsi', 'Qaranlıq/İşıqlı tema'],
    price: '399',
    color: 'from-amber-500/20 to-orange-500/10'
  },
  {
    icon: Layout,
    title: 'Korporativ Həll',
    desc: 'Enterprise səviyyəli veb həllər böyük şirkətlər üçün.',
    features: ['Çoxdilli dəstək', 'API inteqrasiya', 'CRM sistemi', '7/24 dəstək'],
    price: '799',
    color: 'from-pink-500/20 to-rose-500/10'
  },
  {
    icon: Smartphone,
    title: 'Startup Paketi',
    desc: 'Startapınızı sürətlə bazara çıxarmaq üçün optimal həll.',
    features: ['MVP inkişafı', 'Prototipləmə', 'CI/CD pipeline', 'Bulud yerləşdirmə'],
    price: '599',
    color: 'from-cyan-500/20 to-blue-500/10'
  },
];

const Products = () => {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-28 md:py-32 hero-mesh relative" data-testid="products-hero">
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center max-w-3xl mx-auto">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card mb-6">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">Xidmətlərimiz</span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
              Nə <span className="text-gradient">təklif edirik</span>?
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">
              Hər ehtiyaca uyğun, müasir texnologiyalarla hazırlanmış premium veb həllərimiz
            </motion.p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      <div className="beam-line w-full" />

      {/* Services Grid */}
      <section className="py-20 md:py-28" data-testid="products-grid">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc, i) => (
              <motion.div
                key={svc.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="group relative rounded-2xl bg-card/50 border border-white/[0.04] p-8 hover:border-white/[0.08] transition-all duration-600 card-hover-glow overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-40 h-40 rounded-full bg-gradient-to-br ${svc.color} blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/[0.06] transition-all duration-500">
                      <svc.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors duration-500" />
                    </div>
                    <div className="text-right">
                      <span className="font-heading text-2xl font-bold text-foreground">{svc.price}</span>
                      <span className="text-sm text-muted-foreground ml-1">AZN</span>
                    </div>
                  </div>

                  <h3 className="font-heading text-xl font-semibold text-foreground mb-3">{svc.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">{svc.desc}</p>

                  <div className="space-y-2.5 mb-6">
                    {svc.features.map(f => (
                      <div key={f} className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{f}</span>
                      </div>
                    ))}
                  </div>

                  <Link to="/contact" className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                    Sifariş ver <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="beam-line w-full" />

      {/* Pricing comparison */}
      <section className="py-20 md:py-28" data-testid="products-comparison">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
            <motion.h2 variants={fadeUp} className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
              Paket <span className="text-gradient">müqayisəsi</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden glass-card"
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-xs font-medium text-muted-foreground p-5">Xüsusiyyət</th>
                  <th className="text-center text-xs font-medium p-5"><span className="text-emerald-400">Başlanğıc</span><br/><span className="text-muted-foreground">299 AZN</span></th>
                  <th className="text-center text-xs font-medium p-5"><span className="text-primary">Standart</span><br/><span className="text-muted-foreground">499 AZN</span></th>
                  <th className="text-center text-xs font-medium p-5"><span className="text-gradient">Premium</span><br/><span className="text-muted-foreground">999 AZN</span></th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Responsive dizayn', levels: [true, true, true] },
                  { name: 'SEO optimallaşdırma', levels: [false, true, true] },
                  { name: 'CMS paneli', levels: [false, true, true] },
                  { name: 'E-ticarət', levels: [false, false, true] },
                  { name: 'Analitika', levels: [false, true, true] },
                  { name: 'Ödəniş sistemi', levels: [false, false, true] },
                  { name: 'API inteqrasiya', levels: [false, false, true] },
                  { name: 'Texniki dəstək', levels: ['3 ay', '6 ay', '12 ay'] },
                ].map((row, i) => (
                  <tr key={row.name} className="border-b border-white/[0.04] last:border-0">
                    <td className="text-sm text-foreground p-5">{row.name}</td>
                    {row.levels.map((val, j) => (
                      <td key={j} className="text-center p-5">
                        {val === true ? (
                          <CheckCircle2 className="w-4 h-4 text-primary mx-auto" />
                        ) : val === false ? (
                          <span className="text-muted-foreground/30">—</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      <div className="beam-line w-full" />

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Layihəniz üçün ən uyğun <span className="text-gradient">paketi seçin</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-5 text-base text-muted-foreground max-w-xl mx-auto">
              Hansı paketi seçməli olduğunuzu bilmirsiniz? Pulsuz konsultasiya alın.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex justify-center gap-4">
              <Link to="/contact">
                <Button className="group relative bg-primary text-white hover:bg-blue-600 shadow-[0_0_40px_rgba(59,130,246,0.35)] rounded-full px-8 py-6 text-base font-medium overflow-hidden transition-all duration-500 hover:scale-105">
                  <span className="relative z-10 flex items-center">Əlaqə saxla <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                  <div className="shimmer-btn absolute inset-0" />
                </Button>
              </Link>
              <Link to="/catalogue">
                <Button variant="outline" className="border-white/10 hover:border-white/20 hover:bg-white/[0.04] text-foreground rounded-full px-8 py-6 text-base transition-all">
                  Kataloqa bax
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Products;
