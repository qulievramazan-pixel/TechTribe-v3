import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { catalogueAPI } from '../lib/api';
import { Search, Filter, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { Input } from '../components/ui/input';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.7, ease: [0.23, 1, 0.32, 1] } })
};

const categories = ['Hamısı', 'Biznes', 'E-Ticarət', 'Landing', 'Portfolio', 'Korporativ', 'Startup'];

const Catalogue = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Hamısı');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const res = await catalogueAPI.getAll();
      setItems(res.data);
    } catch (err) {
      console.error('Kataloq yüklənmədi:', err);
    }
    setLoading(false);
  };

  const filtered = items.filter(item => {
    const matchCat = activeCategory === 'Hamısı' || item.category === activeCategory;
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.short_description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="py-24 md:py-28 hero-glow" data-testid="catalogue-hero">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-sm font-medium text-primary mb-3">Kataloq</p>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
              Hazır veb-sayt <span className="text-primary">paketləri</span>
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl">
              Müxtəlif sektorlar üçün hazırlanmış professional veb həllərimizi kəşf edin.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="beam-line w-full" />

      {/* Filters */}
      <section className="py-8 border-b border-white/5 sticky top-20 z-30" style={{ background: 'rgba(2,4,10,0.95)', backdropFilter: 'blur(16px)' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat}
                  data-testid={`filter-${cat}`}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-primary text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                      : 'bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                data-testid="catalogue-search"
                placeholder="Axtar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 focus:border-primary h-10 rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 md:py-20" data-testid="catalogue-grid">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="rounded-2xl bg-card border border-white/5 animate-pulse">
                  <div className="aspect-video bg-secondary/50" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-secondary/50 rounded w-1/3" />
                    <div className="h-5 bg-secondary/50 rounded w-2/3" />
                    <div className="h-3 bg-secondary/50 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-foreground font-medium">Nəticə tapılmadı</p>
              <p className="text-sm text-muted-foreground mt-2">Axtarış meyarlarınızı dəyişdirməyə çalışın</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  custom={i}
                >
                  <Link to={`/catalogue/${item.id}`} data-testid={`catalogue-item-${item.id}`} className="group block">
                    <div className="rounded-2xl overflow-hidden bg-card border border-white/5 hover:border-primary/30 transition-all duration-500 card-hover-glow">
                      <div className="aspect-video overflow-hidden bg-secondary/30">
                        <img
                          src={item.images?.[0] || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80'}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-medium text-primary px-3 py-1 rounded-full bg-primary/10">{item.category}</span>
                          <span className="font-heading text-xl font-bold text-primary">{item.price} <span className="text-sm">{item.currency}</span></span>
                        </div>
                        <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{item.short_description}</p>
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {item.technologies?.slice(0, 4).map(t => (
                            <span key={t} className="text-xs px-2 py-0.5 rounded bg-white/5 text-muted-foreground">{t}</span>
                          ))}
                        </div>
                        <div className="mt-5 flex items-center text-sm text-primary font-medium group-hover:gap-2 transition-all">
                          Ətraflı bax <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Catalogue;
