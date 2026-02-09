import React from 'react';
import { motion } from 'framer-motion';
import { Target, Heart, Users, Award, Lightbulb, TrendingUp } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] } })
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const About = () => {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-28 md:py-32 hero-mesh relative" data-testid="about-hero">
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card mb-6">
              <span className="text-xs font-medium text-muted-foreground">Haqqımızda</span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Texnologiya ilə <span className="text-gradient">gələcəyi</span> formalaşdırırıq
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">
              TechTribe olaraq biz, müasir texnologiyalardan istifadə edərək bizneslərin rəqəmsal transformasiyasına kömək edirik. Hər layihədə keyfiyyət, innovasiya və müştəri məmnuniyyətini ön planda tuturuq.
            </motion.p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#02040A] to-transparent pointer-events-none" />
      </section>

      <div className="beam-line w-full" />

      {/* Story */}
      <section className="py-24 md:py-32" data-testid="about-story">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.p variants={fadeUp} className="text-sm font-medium text-primary mb-3">Hekayəmiz</motion.p>
              <motion.h2 variants={fadeUp} className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
                2019-dan bu günə
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-5 text-sm text-muted-foreground leading-relaxed">
                TechTribe 2019-cu ildə kiçik bir komanda olaraq fəaliyyətə başladı. Məqsədimiz sadə idi — Azərbaycanda keyfiyyətli və müasir veb həllər təqdim etmək.
              </motion.p>
              <motion.p variants={fadeUp} className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Bu gün 150-dən çox uğurlu layihə ilə Azərbaycanın aparıcı veb studiyalarından birinə çevrildik. Hər layihədə müştərilərimizin ehtiyaclarını anlayır və ən yaxşı həlli təqdim edirik.
              </motion.p>
              <motion.p variants={fadeUp} className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Komandamız daim inkişaf edir, yeni texnologiyaları öyrənir və tətbiq edir. Biz sadəcə veb-sayt qurmururq — brendinizin rəqəmsal tarixçəsini yazırıq.
              </motion.p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="rounded-2xl overflow-hidden border border-white/5"
            >
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                alt="TechTribe komanda"
                className="w-full h-[400px] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <div className="beam-line w-full" />

      {/* Values */}
      <section className="py-24 md:py-32" data-testid="about-values">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
            <motion.p variants={fadeUp} className="text-sm font-medium text-primary mb-3">Dəyərlərimiz</motion.p>
            <motion.h2 variants={fadeUp} className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Bizi fərqli <span className="text-primary">edən</span> dəyərlər
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: 'Məqsədyönlülük', desc: 'Hər layihədə aydın hədəflər qoyuruq və nəticəyə fokuslanırıq.' },
              { icon: Heart, title: 'Ehtiras', desc: 'İşimizi sevirik. Bu ehtiras hər kodda, hər dizaynda hiss olunur.' },
              { icon: Lightbulb, title: 'İnnovasiya', desc: 'Yeni fikirləri qəbul edir, müasir həlləri tətbiq edirik.' },
              { icon: Users, title: 'Komanda ruhu', desc: 'Birlikdə daha güclüyük. Hər layihə komanda işinin nəticəsidir.' },
              { icon: Award, title: 'Keyfiyyət', desc: 'Standartlarımızdan kompromis etmirik. Premium keyfiyyət hər zaman.' },
              { icon: TrendingUp, title: 'İnkişaf', desc: 'Daim öyrənirik, inkişaf edirik və müştərilərimizə ən yaxşısını veririk.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="rounded-2xl bg-card border border-white/5 p-8 hover:border-primary/30 transition-all duration-500 card-hover-glow"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
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

      {/* Team */}
      <section className="py-24 md:py-32" data-testid="about-team">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
            <motion.p variants={fadeUp} className="text-sm font-medium text-primary mb-3">Komandamız</motion.p>
            <motion.h2 variants={fadeUp} className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              <span className="text-primary">Peşəkar</span> komanda
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Ramazan Quliyev', role: 'Baş Direktor', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80' },
              { name: 'Aynur Həsənova', role: 'UI/UX Dizayner', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80' },
              { name: 'Tural Əliyev', role: 'Backend Developer', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80' },
              { name: 'Nigar Məmmədli', role: 'Frontend Developer', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80' },
            ].map((member, i) => (
              <motion.div
                key={member.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="group rounded-2xl overflow-hidden bg-card border border-white/5 hover:border-primary/30 transition-all duration-500"
              >
                <div className="aspect-square overflow-hidden">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-heading text-base font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-primary mt-1">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
