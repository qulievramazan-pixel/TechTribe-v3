import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Code2, Palette, Rocket, Shield, Zap, Globe, CheckCircle2, Layers, Monitor, Server, Database, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] } })
};

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const Home = ({ catalogue = [] }) => {
  const featured = catalogue.filter(item => item.is_featured).slice(0, 3);

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center hero-glow grid-pattern" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-20">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-4xl">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">Azərbaycanın aparıcı veb studiyası</span>
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="font-heading text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight">
              Rəqəmsal gələcəyinizi
              <br />
              <span className="text-primary">birlikdə</span> qururuq
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="mt-7 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Professional veb-saytlar, e-ticarət platformaları və rəqəmsal həllər. Müasir texnologiyalarla brendinizi gücləndirin.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="mt-10 flex flex-wrap items-center gap-4">
              <Link to="/catalogue" data-testid="hero-catalogue-btn">
                <Button className="bg-primary text-white hover:bg-blue-600 shadow-[0_0_30px_rgba(59,130,246,0.4)] rounded-full px-8 py-6 text-base font-medium hover:scale-105 transition-all duration-300">
                  Kataloqu göstər <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/contact" data-testid="hero-contact-btn">
                <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-foreground rounded-full px-8 py-6 text-base font-medium transition-all duration-300">
                  Bizimlə əlaqə
                </Button>
              </Link>
            </motion.div>
            {/* Stats */}
            <motion.div variants={fadeUp} custom={4} className="mt-16 flex flex-wrap gap-10 md:gap-16">
              {[
                { num: '150+', label: 'Tamamlanmış layihə' },
                { num: '98%', label: 'Müştəri məmnuniyyəti' },
                { num: '5+', label: 'İllik təcrübə' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-heading text-3xl md:text-4xl font-bold text-foreground">{s.num}</p>
                  <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
        {/* Decorative */}
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] -translate-y-1/2 pointer-events-none" />
      </section>

      {/* Beam separator */}
      <div className="beam-line w-full" />

      {/* Why TechTribe */}
      <section className="py-24 md:py-32 relative" data-testid="why-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger}>
            <motion.p variants={fadeUp} className="text-sm font-medium text-primary mb-3">Niyə biz?</motion.p>
            <motion.h2 variants={fadeUp} className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Niyə <span className="text-primary">TechTribe</span>?
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-base text-muted-foreground max-w-xl">
              Keyfiyyət, sürət və innovasiya — hər layihədə bu prinsiplərə sadiq qalırıq.
            </motion.p>
          </motion.div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Code2, title: 'Müasir Texnologiya', desc: 'React, Next.js, FastAPI — ən son texnologiyalarla güclü həllər qururuq.' },
              { icon: Palette, title: 'Premium Dizayn', desc: 'Hər piksel üzərində işləyirik. Estetik və funksional dizaynlar yaradırıq.' },
              { icon: Rocket, title: 'Sürətli Təhvil', desc: 'Layihələrinizi vaxtında və keyfiyyətlə tamamlayırıq. MVP-dən produksiyaya.' },
              { icon: Shield, title: 'Etibarlılıq', desc: 'Təhlükəsiz kodlaşdırma, SSL, GDPR uyğunluq — təhlükəsizliyiniz bizim prioritetimizdir.' },
              { icon: Globe, title: 'SEO Optimallaşdırma', desc: 'Google-da üst sıralarda yer almağınız üçün SEO strategiyaları tətbiq edirik.' },
              { icon: Layers, title: 'Tam Dəstək', desc: 'Layihə sonrasında da yanınızdayıq. Texniki dəstək və yeniləmələr təmin edirik.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="group relative overflow-hidden rounded-2xl bg-card border border-white/5 p-8 hover:border-primary/30 transition-all duration-500 card-hover-glow"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="beam-line w-full" />

      {/* How We Work */}
      <section className="py-24 md:py-32" data-testid="howwework-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger}>
            <motion.p variants={fadeUp} className="text-sm font-medium text-primary mb-3">Proses</motion.p>
            <motion.h2 variants={fadeUp} className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Necə <span className="text-primary">işləyirik</span>?
            </motion.h2>
          </motion.div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Analiz', desc: 'Ehtiyaclarınızı öyrənirik, strategiya hazırlayırıq' },
              { step: '02', title: 'Dizayn', desc: 'Brendinizə uyğun UI/UX dizayn yaradırıq' },
              { step: '03', title: 'İnkişaf', desc: 'Müasir texnologiyalarla layihəni həyata keçiririk' },
              { step: '04', title: 'Təhvil', desc: 'Test, optimallaşdırma və uğurlu işə salma' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="relative group"
              >
                <span className="font-heading text-6xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors">{item.step}</span>
                <h3 className="font-heading text-xl font-semibold text-foreground mt-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.desc}</p>
                {i < 3 && <ChevronRight className="hidden md:block absolute top-10 -right-5 w-5 h-5 text-white/10" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="beam-line w-full" />

      {/* Tech Stack */}
      <section className="py-24 md:py-32" data-testid="techstack-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger} className="text-center">
            <motion.p variants={fadeUp} className="text-sm font-medium text-primary mb-3">Texnologiyalar</motion.p>
            <motion.h2 variants={fadeUp} className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Texnologiya <span className="text-primary">yığınımız</span>
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mt-14 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'React', icon: Monitor },
              { name: 'Next.js', icon: Layers },
              { name: 'Node.js', icon: Server },
              { name: 'FastAPI', icon: Zap },
              { name: 'MongoDB', icon: Database },
              { name: 'Tailwind', icon: Palette },
            ].map((tech, i) => (
              <motion.div
                key={tech.name}
                variants={fadeUp}
                custom={i}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-card border border-white/5 hover:border-primary/20 transition-all duration-300 group"
              >
                <tech.icon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium text-foreground">{tech.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="beam-line w-full" />

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-24 md:py-32" data-testid="featured-section">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger} className="flex items-end justify-between mb-14">
              <div>
                <motion.p variants={fadeUp} className="text-sm font-medium text-primary mb-3">Seçilmiş</motion.p>
                <motion.h2 variants={fadeUp} className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                  Populyar <span className="text-primary">paketlər</span>
                </motion.h2>
              </div>
              <motion.div variants={fadeUp}>
                <Link to="/catalogue" className="text-sm text-primary hover:underline flex items-center gap-1">
                  Hamısını gör <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                >
                  <Link to={`/catalogue/${item.id}`} className="group block">
                    <div className="rounded-2xl overflow-hidden bg-card border border-white/5 hover:border-primary/30 transition-all duration-500 card-hover-glow">
                      <div className="aspect-video overflow-hidden bg-secondary/50">
                        <img
                          src={item.images?.[0] || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80'}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-medium text-primary px-3 py-1 rounded-full bg-primary/10">{item.category}</span>
                          <span className="font-heading text-lg font-bold text-primary">{item.price} {item.currency}</span>
                        </div>
                        <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{item.short_description}</p>
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {item.technologies?.slice(0, 3).map(t => (
                            <span key={t} className="text-xs px-2 py-0.5 rounded bg-white/5 text-muted-foreground">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="beam-line w-full" />

      {/* CTA */}
      <section className="py-24 md:py-32 relative" data-testid="cta-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="relative rounded-3xl overflow-hidden p-12 md:p-20 text-center"
            style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(2,4,10,0.5) 100%)', border: '1px solid rgba(59,130,246,0.15)' }}
          >
            <motion.h2 variants={fadeUp} className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Layihənizi <span className="text-primary">başlayaq</span>?
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
              Pulsuz konsultasiya alın. Brendinizə uyğun həll hazırlayaq.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex justify-center gap-4">
              <Link to="/contact">
                <Button className="bg-primary text-white hover:bg-blue-600 shadow-[0_0_30px_rgba(59,130,246,0.4)] rounded-full px-8 py-6 text-base font-medium hover:scale-105 transition-all duration-300">
                  Pulsuz Konsultasiya <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
