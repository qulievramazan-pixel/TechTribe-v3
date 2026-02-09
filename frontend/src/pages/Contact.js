import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { contactAPI } from '../lib/api';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] } })
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('Ad, email və mesaj doldurulmalıdır');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await contactAPI.send(form);
      setSent(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setError('Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
    }
    setLoading(false);
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-24 md:py-28 hero-glow" data-testid="contact-hero">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-sm font-medium text-primary mb-3">Əlaqə</p>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
              Bizimlə <span className="text-primary">əlaqə</span> saxlayın
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl">
              Layihəniz haqqında danışaq. Pulsuz konsultasiya üçün mesaj göndərin.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="beam-line w-full" />

      <section className="py-16 md:py-24" data-testid="contact-form-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="lg:col-span-2">
              <motion.h2 variants={fadeUp} className="font-heading text-2xl font-bold text-foreground mb-8">Əlaqə məlumatları</motion.h2>
              <div className="space-y-6">
                {[
                  { icon: Mail, label: 'Email', value: 'info@techtribe.az' },
                  { icon: Phone, label: 'Telefon', value: '+994 50 123 45 67' },
                  { icon: MapPin, label: 'Ünvan', value: 'Bakı, Azərbaycan\nNizami küç. 42' },
                ].map((item) => (
                  <motion.div key={item.label} variants={fadeUp} className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-line mt-0.5">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Working hours */}
              <motion.div variants={fadeUp} className="mt-10 p-6 rounded-2xl bg-card border border-white/5">
                <h3 className="font-heading text-base font-semibold text-foreground mb-3">İş saatları</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between"><span>Bazar ertəsi - Cümə</span><span className="text-foreground">09:00 - 18:00</span></div>
                  <div className="flex justify-between"><span>Şənbə</span><span className="text-foreground">10:00 - 15:00</span></div>
                  <div className="flex justify-between"><span>Bazar</span><span className="text-destructive">Bağlı</span></div>
                </div>
              </motion.div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3"
            >
              {sent ? (
                <div className="rounded-2xl bg-card border border-white/5 p-12 text-center" data-testid="contact-success">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-foreground">Mesajınız göndərildi!</h3>
                  <p className="text-sm text-muted-foreground mt-3">Ən qısa zamanda sizinlə əlaqə saxlayacağıq.</p>
                  <Button onClick={() => setSent(false)} className="mt-6 bg-primary text-white hover:bg-blue-600 rounded-full px-6" data-testid="send-another-btn">
                    Yeni mesaj göndər
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="rounded-2xl bg-card border border-white/5 p-8 md:p-10 space-y-6" data-testid="contact-form">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm text-foreground">Adınız *</Label>
                      <Input
                        data-testid="contact-name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Adınızı daxil edin"
                        className="bg-white/5 border-white/10 focus:border-primary h-12 rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-foreground">Email *</Label>
                      <Input
                        data-testid="contact-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="email@nümunə.az"
                        className="bg-white/5 border-white/10 focus:border-primary h-12 rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm text-foreground">Telefon</Label>
                      <Input
                        data-testid="contact-phone"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+994 XX XXX XX XX"
                        className="bg-white/5 border-white/10 focus:border-primary h-12 rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-foreground">Mövzu</Label>
                      <Input
                        data-testid="contact-subject"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        placeholder="Mesajın mövzusu"
                        className="bg-white/5 border-white/10 focus:border-primary h-12 rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-foreground">Mesaj *</Label>
                    <Textarea
                      data-testid="contact-message"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Layihəniz haqqında danışın..."
                      rows={5}
                      className="bg-white/5 border-white/10 focus:border-primary rounded-lg resize-none"
                    />
                  </div>
                  {error && <p className="text-sm text-destructive" data-testid="contact-error">{error}</p>}
                  <Button
                    type="submit"
                    disabled={loading}
                    data-testid="contact-submit-btn"
                    className="w-full bg-primary text-white hover:bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.3)] rounded-full py-6 text-base font-medium hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? 'Göndərilir...' : <><Send className="w-4 h-4 mr-2" /> Mesaj göndər</>}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
