import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { catalogueAPI } from '../lib/api';
import { ArrowLeft, ExternalLink, CheckCircle2, Tag, Cpu, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const CatalogueDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    try {
      const res = await catalogueAPI.getOne(id);
      setItem(res.data);
    } catch (err) {
      console.error('Məhsul yüklənmədi:', err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="pt-20 min-h-screen flex flex-col items-center justify-center">
        <p className="text-lg text-foreground font-medium">Məhsul tapılmadı</p>
        <Link to="/catalogue" className="mt-4 text-primary hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Kataloqa qayıt
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20" data-testid="catalogue-detail">
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Back */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <Link to="/catalogue" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8" data-testid="back-to-catalogue">
              <ArrowLeft className="w-4 h-4" /> Kataloqa qayıt
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="rounded-2xl overflow-hidden bg-card border border-white/5">
                <img
                  src={item.images?.[activeImg] || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80'}
                  alt={item.title}
                  className="w-full aspect-video object-cover"
                  data-testid="product-main-image"
                />
              </div>
              {item.images?.length > 1 && (
                <div className="mt-4 flex gap-3">
                  {item.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      data-testid={`product-thumb-${i}`}
                      className={`w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImg === i ? 'border-primary' : 'border-white/5 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Details */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10">{item.category}</Badge>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground" data-testid="product-title">{item.title}</h1>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-heading text-4xl font-bold text-primary" data-testid="product-price">{item.price}</span>
                <span className="text-lg text-muted-foreground">{item.currency}</span>
              </div>

              <p className="mt-6 text-sm text-muted-foreground leading-relaxed" data-testid="product-description">{item.description}</p>

              {/* Features */}
              <div className="mt-8">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-4">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Xüsusiyyətlər
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {item.features?.map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div className="mt-8">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-4">
                  <Cpu className="w-4 h-4 text-primary" /> Texnologiyalar
                </h3>
                <div className="flex flex-wrap gap-2">
                  {item.technologies?.map(t => (
                    <span key={t} className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground">{t}</span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-10 flex flex-wrap gap-4">
                {item.demo_url && item.demo_url !== '#' && (
                  <a href={item.demo_url} target="_blank" rel="noopener noreferrer" data-testid="product-demo-btn">
                    <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-foreground rounded-full px-6 py-5 text-sm transition-all duration-300">
                      <ExternalLink className="w-4 h-4 mr-2" /> Canlı Demo
                    </Button>
                  </a>
                )}
                <Link to="/contact" data-testid="product-contact-btn">
                  <Button className="bg-primary text-white hover:bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.4)] rounded-full px-6 py-5 text-sm font-medium hover:scale-105 transition-all duration-300">
                    <MessageCircle className="w-4 h-4 mr-2" /> Sifariş ver
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CatalogueDetail;
