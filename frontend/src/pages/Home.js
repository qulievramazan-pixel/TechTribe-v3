import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight, Code2, Palette, Rocket, Shield, Zap, Globe, Layers, Monitor,
  Server, Database, ChevronRight, Star, Sparkles, ArrowUpRight, CircuitBoard,
  Cpu, BarChart3, Users, BadgeCheck
} from 'lucide-react';
import { Button } from '../components/ui/button';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.23, 1, 0.32, 1] }
  })
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };
const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] } }
};

const Home = ({ catalogue = [] }) => {
  const featured = catalogue.filter(item => item.is_featured).slice(0, 3);
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0.5]);

  return (
    <div className="relative overflow-hidden">
      {/* ===== HERO ===== */}
      <motion.section
        style={{ scale: heroScale, opacity: heroOpacity }}
        className="relative min-h-screen flex items-center hero-mesh"
        data-testid="hero-section"
      >
        {/* Animated orbs */}
        <div className="absolute top-[15%] right-[10%] w-[400px] h-[400px] rounded-full bg-primary/[0.07] blur-[120px] animate-float pointer-events-none" />
        <div className="absolute bottom-[20%] left-[5%] w-[300px] h-[300px] rounded-full bg-cyan-500/[0.05] blur-[100px] animate-float-reverse pointer-events-none" />
        <div className="absolute top-[40%] left-[40%] w-[200px] h-[200px] rounded-full bg-violet-500/[0.04] blur-[80px] animate-pulse-slow pointer-events-none" />

        {/* Grid overlay */}
        <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left content */}
            <motion.div initial="hidden" animate="visible" variants={stagger} className="lg:col-span-7">
              <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full glass-card mb-10">
                <span className="flex h-2 w-2"><span className="animate-ping absolute h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
                <span className="text-xs font-medium text-muted-foreground">Azərbaycanın #1 veb studiyası</span>
                <Sparkles className="w-3.5 h-3.5 text-primary" />
              </motion.div>

              <motion.h1 variants={fadeUp} custom={1} className="font-heading text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-bold text-foreground leading-[1.05] tracking-tight">
                Rəqəmsal
                <br />
                <span className="text-gradient">gələcəyinizi</span>
                <br />
                birlikdə qururuq
              </motion.h1>

              <motion.p variants={fadeUp} custom={2} className="mt-8 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
                Premium veb-saytlar, e-ticarət platformaları və xüsusi rəqəmsal həllər.
                Müasir texnologiyalarla brendinizin onlayn gücünü artırırıq.
              </motion.p>

              <motion.div variants={fadeUp} custom={3} className="mt-10 flex flex-wrap items-center gap-4">
                <Link to="/catalogue" data-testid="hero-catalogue-btn">
                  <Button className="group relative bg-primary text-white hover:bg-blue-600 shadow-[0_0_40px_rgba(59,130,246,0.35)] rounded-full px-8 py-6 text-base font-medium transition-all duration-500 hover:scale-105 hover:shadow-[0_0_60px_rgba(59,130,246,0.45)] overflow-hidden">
                    <span className="relative z-10 flex items-center">Kataloqu kəşf et <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" /></span>
                    <div className="shimmer-btn absolute inset-0" />
                  </Button>
                </Link>
                <Link to="/contact" data-testid="hero-contact-btn">
                  <Button variant="outline" className="relative bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/[0.04] text-foreground rounded-full px-8 py-6 text-base font-medium transition-all duration-300">
                    Pulsuz konsultasiya
                  </Button>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div variants={fadeUp} custom={4} className="mt-16 flex items-center gap-0">
                {[
                  { num: '150+', label: 'Layihə' },
                  { num: '98%', label: 'Məmnuniyyət' },
                  { num: '5+', label: 'İl təcrübə' },
                  { num: '24/7', label: 'Dəstək' },
                ].map((s, i) => (
                  <div key={s.label} className={`flex-1 py-4 text-center ${i > 0 ? 'border-l border-white/[0.06]' : ''}`}>
                    <p className="font-heading text-2xl md:text-3xl font-bold text-foreground">{s.num}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1, ease: [0.23, 1, 0.32, 1] }}
              className="lg:col-span-5 hidden lg:flex items-center justify-center relative"
            >
              <div className="relative w-[380px] h-[380px]">
                {/* Rotating orbit ring */}
                <div className="absolute inset-0 rounded-full border border-white/[0.04] animate-[spin_40s_linear_infinite]" />
                <div className="absolute inset-6 rounded-full border border-white/[0.06] animate-[spin_30s_linear_infinite_reverse]" />
                <div className="absolute inset-12 rounded-full border border-primary/10 animate-[spin_25s_linear_infinite]" />

                {/* Center glow */}
                <div className="absolute inset-[30%] rounded-full bg-primary/10 blur-[40px]" />

                {/* Floating tech icons */}
                {[
                  { icon: Code2, x: '10%', y: '15%', delay: 0 },
                  { icon: Monitor, x: '75%', y: '10%', delay: 0.5 },
                  { icon: Database, x: '85%', y: '60%', delay: 1 },
                  { icon: Cpu, x: '55%', y: '80%', delay: 1.5 },
                  { icon: Globe, x: '5%', y: '70%', delay: 2 },
                  { icon: Layers, x: '40%', y: '5%', delay: 2.5 },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + item.delay * 0.2, duration: 0.5 }}
                    className="absolute w-12 h-12 rounded-xl glass-card flex items-center justify-center animate-float"
                    style={{ left: item.x, top: item.y, animationDelay: `${item.delay}s` }}
                  >
                    <item.icon className="w-5 h-5 text-primary" />
                  </motion.div>
                ))}

                {/* Center logo mark */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-cyan-500/10 border border-primary/20 flex items-center justify-center shadow-[0_0_60px_rgba(59,130,246,0.2)]">
                    <span className="font-heading text-2xl font-bold text-gradient">TT</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#02040A] to-transparent pointer-events-none" />
      </motion.section>

      {/* ===== TECH MARQUEE ===== */}
      <section className="py-6 border-y border-white/[0.03] overflow-hidden relative">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, setIdx) => (
            <div key={setIdx} className="flex items-center gap-12 px-6">
              {['React', 'Next.js', 'FastAPI', 'Node.js', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'Tailwind CSS', 'TypeScript', 'Python', 'Kubernetes'].map(t => (
                <span key={`${setIdx}-${t}`} className="text-sm font-medium text-white/[0.12] uppercase tracking-wider">{t}</span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ===== WHY TECHTRIBE ===== */}
      <section className="py-28 md:py-36 relative" data-testid="why-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger} className="text-center max-w-2xl mx-auto mb-16">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card mb-6">
              <BadgeCheck className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">Niyə biz?</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Niyə <span className="text-gradient">TechTribe</span>?
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-5 text-base text-muted-foreground leading-relaxed">
              Keyfiyyət, sürət və innovasiya — hər layihədə bu prinsiplərə sadiq qalırıq.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Code2, title: 'Müasir Texnologiya', desc: 'React, Next.js, FastAPI — ən son texnologiyalarla güclü həllər qururuq.', accent: 'from-blue-500/20 to-cyan-500/10' },
              { icon: Palette, title: 'Premium Dizayn', desc: 'Hər piksel üzərində işləyirik. Estetik və funksional UI/UX dizaynlar yaradırıq.', accent: 'from-violet-500/20 to-pink-500/10' },
              { icon: Rocket, title: 'Sürətli Təhvil', desc: 'Layihələrinizi vaxtında və keyfiyyətlə tamamlayırıq. MVP-dən produksiyaya.', accent: 'from-emerald-500/20 to-teal-500/10' },
              { icon: Shield, title: 'Təhlükəsizlik', desc: 'SSL, GDPR uyğunluq, təhlükəsiz kodlaşdırma — bizim prioritetimizdir.', accent: 'from-amber-500/20 to-orange-500/10' },
              { icon: Globe, title: 'SEO Optimallaşdırma', desc: 'Google-da üst sıralarda yer almağınız üçün SEO strategiyaları tətbiq edirik.', accent: 'from-cyan-500/20 to-blue-500/10' },
              { icon: Users, title: 'Tam Dəstək', desc: 'Layihə sonrasında da yanınızdayıq. 24/7 texniki dəstək təmin edirik.', accent: 'from-pink-500/20 to-rose-500/10' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="group relative rounded-2xl bg-card/50 border border-white/[0.04] p-8 hover:border-white/[0.08] transition-all duration-600 card-hover-glow overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br ${item.accent} blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-6 group-hover:border-primary/30 group-hover:bg-primary/[0.06] transition-all duration-500">
                    <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-500" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2.5">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="beam-line w-full" />

      {/* ===== HOW WE WORK ===== */}
      <section className="py-28 md:py-36 relative" data-testid="howwework-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger} className="text-center max-w-2xl mx-auto mb-16">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card mb-6">
              <CircuitBoard className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">Proses</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Necə <span className="text-gradient">işləyirik</span>?
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-14 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            {[
              { step: '01', title: 'Analiz', desc: 'Ehtiyaclarınızı öyrənirik, rəqəmsal strategiya hazırlayırıq', color: 'from-blue-500 to-cyan-500' },
              { step: '02', title: 'Dizayn', desc: 'Brendinizə uyğun premium UI/UX dizayn yaradırıq', color: 'from-violet-500 to-purple-500' },
              { step: '03', title: 'İnkişaf', desc: 'Müasir texnologiyalarla layihəni həyata keçiririk', color: 'from-emerald-500 to-teal-500' },
              { step: '04', title: 'Təhvil', desc: 'Test, optimallaşdırma və uğurlu işə salma', color: 'from-amber-500 to-orange-500' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="relative text-center group"
              >
                <div className="relative mx-auto mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto shadow-lg relative z-10 group-hover:scale-110 transition-transform duration-500`}>
                    <span className="font-heading text-lg font-bold text-white">{item.step}</span>
                  </div>
                  <div className={`absolute inset-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} blur-xl opacity-30 mx-auto`} />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px] mx-auto">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="beam-line w-full" />

      {/* ===== WHAT WE DELIVER ===== */}
      <section className="py-28 md:py-36 relative" data-testid="deliver-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card mb-6">
                <Star className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Təhvil veririk</span>
              </motion.div>
              <motion.h2 variants={fadeUp} className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                Nə <span className="text-gradient">təqdim edirik</span>?
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-5 text-base text-muted-foreground leading-relaxed">
                Hər layihə tam hazır, test edilmiş və istifadəyə hazır şəkildə təhvil verilir.
              </motion.p>
              <motion.div variants={fadeUp} className="mt-10 space-y-4">
                {[
                  'Full-stack veb sayt inkişafı',
                  'Mobil uyğun responsive dizayn',
                  'SEO optimallaşdırma və analitika',
                  'CMS idarəetmə paneli',
                  'SSL sertifikatı və təhlükəsizlik',
                  'Hosting və domen quraşdırma',
                  'Layihə sonrası texniki dəstək',
                ].map((item, i) => (
                  <motion.div
                    key={item}
                    variants={fadeUp}
                    custom={i}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <ArrowRight className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Bento grid visual */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleIn}
              className="grid grid-cols-2 gap-4"
            >
              <div className="rounded-2xl glass-card p-6 row-span-2 flex flex-col justify-between">
                <BarChart3 className="w-8 h-8 text-primary mb-4" />
                <div>
                  <p className="font-heading text-3xl font-bold text-foreground">150+</p>
                  <p className="text-sm text-muted-foreground mt-1">Tamamlanmış layihə</p>
                </div>
              </div>
              <div className="rounded-2xl glass-card p-6">
                <p className="font-heading text-2xl font-bold text-gradient">98%</p>
                <p className="text-xs text-muted-foreground mt-2">Müştəri məmnuniyyəti</p>
              </div>
              <div className="rounded-2xl glass-card p-6">
                <p className="font-heading text-2xl font-bold text-foreground">
                  <span className="text-emerald-400">4.9</span>/5
                </p>
                <p className="text-xs text-muted-foreground mt-2">Ortalama reytinq</p>
                <div className="flex gap-0.5 mt-2">
                  {[1,2,3,4,5].map(n => <Star key={n} className={`w-3 h-3 ${n <= 4 ? 'text-amber-400 fill-amber-400' : 'text-amber-400/30'}`} />)}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="beam-line w-full" />

      {/* ===== TECH STACK ===== */}
      <section className="py-28 md:py-36" data-testid="techstack-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger} className="text-center max-w-2xl mx-auto mb-16">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card mb-6">
              <Cpu className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">Texnologiyalar</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Texnologiya <span className="text-gradient">yığınımız</span>
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'React', icon: Monitor, color: '#61DAFB' },
              { name: 'Next.js', icon: Layers, color: '#FFFFFF' },
              { name: 'Node.js', icon: Server, color: '#68A063' },
              { name: 'FastAPI', icon: Zap, color: '#009688' },
              { name: 'MongoDB', icon: Database, color: '#47A248' },
              { name: 'Tailwind', icon: Palette, color: '#38BDF8' },
            ].map((tech, i) => (
              <motion.div
                key={tech.name}
                variants={fadeUp}
                custom={i}
                className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-card/30 border border-white/[0.04] hover:border-white/[0.08] transition-all duration-500 group cursor-default"
              >
                <div className="w-14 h-14 rounded-xl bg-white/[0.03] flex items-center justify-center group-hover:bg-white/[0.06] transition-all duration-500">
                  <tech.icon className="w-7 h-7 text-muted-foreground group-hover:text-foreground transition-colors" style={{ '--tw-group-hover-color': tech.color }} />
                </div>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{tech.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="beam-line w-full" />

      {/* ===== FEATURED PRODUCTS ===== */}
      {featured.length > 0 && (
        <section className="py-28 md:py-36" data-testid="featured-section">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger} className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card mb-6">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">Populyar</span>
                </motion.div>
                <motion.h2 variants={fadeUp} className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                  Seçilmiş <span className="text-gradient">paketlər</span>
                </motion.h2>
              </div>
              <motion.div variants={fadeUp}>
                <Link to="/catalogue" className="inline-flex items-center gap-2 text-sm text-primary hover:gap-3 transition-all group">
                  Bütün paketlər <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
                    <div className="rounded-2xl overflow-hidden bg-card/50 border border-white/[0.04] hover:border-white/[0.08] transition-all duration-600 card-hover-glow">
                      <div className="aspect-[16/10] overflow-hidden relative">
                        <img
                          src={item.images?.[0] || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80'}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[800ms] ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#02040A] via-transparent to-transparent opacity-60" />
                        <div className="absolute top-4 left-4">
                          <span className="text-xs font-medium text-white/90 px-3 py-1.5 rounded-full glass-card">{item.category}</span>
                        </div>
                        <div className="absolute bottom-4 right-4">
                          <span className="font-heading text-2xl font-bold text-white">{item.price} <span className="text-sm font-normal text-white/60">{item.currency}</span></span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">{item.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{item.short_description}</p>
                        <div className="mt-5 flex items-center justify-between">
                          <div className="flex flex-wrap gap-1.5">
                            {item.technologies?.slice(0, 3).map(t => (
                              <span key={t} className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.04] text-muted-foreground border border-white/[0.04]">{t}</span>
                            ))}
                          </div>
                          <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
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

      {/* ===== CTA ===== */}
      <section className="py-28 md:py-36 relative" data-testid="cta-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
            className="relative rounded-[2rem] overflow-hidden p-12 md:p-20 text-center"
          >
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-transparent to-cyan-500/[0.05]" />
            <div className="absolute inset-0 border border-white/[0.06] rounded-[2rem]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] rounded-full bg-primary/[0.08] blur-[100px]" />
            <div className="absolute bottom-0 right-0 w-[300px] h-[200px] rounded-full bg-cyan-500/[0.05] blur-[80px]" />
            <div className="absolute inset-0 dot-pattern opacity-30" />

            <div className="relative z-10">
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground">
                Layihənizi <span className="text-gradient">başlayaq</span>?
              </h2>
              <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Pulsuz konsultasiya alın. Brendinizə uyğun premium rəqəmsal həll hazırlayaq.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link to="/contact">
                  <Button className="group relative bg-primary text-white hover:bg-blue-600 shadow-[0_0_40px_rgba(59,130,246,0.35)] rounded-full px-10 py-7 text-lg font-medium transition-all duration-500 hover:scale-105 overflow-hidden">
                    <span className="relative z-10 flex items-center">Pulsuz Konsultasiya <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
                    <div className="shimmer-btn absolute inset-0" />
                  </Button>
                </Link>
                <Link to="/catalogue">
                  <Button variant="outline" className="border-white/10 hover:border-white/20 hover:bg-white/[0.04] text-foreground rounded-full px-10 py-7 text-lg transition-all duration-300">
                    Paketlərə bax
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;