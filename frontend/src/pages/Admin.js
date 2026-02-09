import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { dashboardAPI, catalogueAPI, messagesAPI, chatAPI, usersAPI } from '../lib/api';
import { Logo } from '../components/Logo';
import {
  LayoutDashboard, Package, Mail, MessageSquare, LogOut, Plus, Pencil, Trash2,
  Eye, Send, ChevronRight, Users, BarChart3, X, Shield, ShieldOff, UserX, UserCheck
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

const Admin = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [products, setProducts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [convoMessages, setConvoMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '', description: '', short_description: '', features: '', technologies: '',
    price: 0, currency: 'AZN', images: '', demo_url: '', category: '', is_featured: false
  });

  const loadData = useCallback(async () => {
    try {
      const [statsRes, prodRes, msgRes, chatRes] = await Promise.all([
        dashboardAPI.stats(), catalogueAPI.getAll(), messagesAPI.getAll(), chatAPI.conversations()
      ]);
      setStats(statsRes.data);
      setProducts(prodRes.data);
      setMessages(msgRes.data);
      setConversations(chatRes.data);
    } catch (err) {
      if (err.response?.status === 401) { onLogout(); navigate('/auth'); }
    }
  }, [onLogout, navigate]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  // Product CRUD
  const openNewProduct = () => {
    setEditingProduct(null);
    setProductForm({ title: '', description: '', short_description: '', features: '', technologies: '', price: 0, currency: 'AZN', images: '', demo_url: '', category: '', is_featured: false });
    setShowProductForm(true);
  };

  const openEditProduct = (p) => {
    setEditingProduct(p);
    setProductForm({
      title: p.title, description: p.description, short_description: p.short_description || '',
      features: (p.features || []).join(', '), technologies: (p.technologies || []).join(', '),
      price: p.price, currency: p.currency || 'AZN', images: (p.images || []).join(', '),
      demo_url: p.demo_url || '', category: p.category || '', is_featured: p.is_featured || false
    });
    setShowProductForm(true);
  };

  const saveProduct = async () => {
    const data = {
      ...productForm,
      features: productForm.features.split(',').map(s => s.trim()).filter(Boolean),
      technologies: productForm.technologies.split(',').map(s => s.trim()).filter(Boolean),
      images: productForm.images.split(',').map(s => s.trim()).filter(Boolean),
      price: Number(productForm.price)
    };
    try {
      if (editingProduct) {
        await catalogueAPI.update(editingProduct.id, data);
      } else {
        await catalogueAPI.create(data);
      }
      setShowProductForm(false);
      loadData();
    } catch (err) {
      console.error('Product save error:', err);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Bu məhsulu silmək istəyirsiniz?')) return;
    try { await catalogueAPI.delete(id); loadData(); } catch (err) { console.error(err); }
  };

  // Messages
  const markAsRead = async (id) => {
    try { await messagesAPI.markRead(id); loadData(); } catch (err) { console.error(err); }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Bu mesajı silmək istəyirsiniz?')) return;
    try { await messagesAPI.delete(id); loadData(); } catch (err) { console.error(err); }
  };

  // Chat
  const openConversation = async (convo) => {
    setSelectedConvo(convo);
    try {
      const res = await chatAPI.messages(convo.id);
      setConvoMessages(res.data);
    } catch (err) { console.error(err); }
  };

  const sendReply = async () => {
    if (!replyText.trim() || !selectedConvo) return;
    try {
      await chatAPI.reply(selectedConvo.id, { content: replyText });
      setReplyText('');
      openConversation(selectedConvo);
    } catch (err) { console.error(err); }
  };

  const sideItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Panel' },
    { id: 'products', icon: Package, label: 'Kataloq' },
    { id: 'messages', icon: Mail, label: 'Mesajlar' },
    { id: 'chat', icon: MessageSquare, label: 'Söhbətlər' },
  ];

  return (
    <div className="min-h-screen flex" data-testid="admin-panel">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col fixed h-full z-20" style={{ background: '#050710' }}>
        <div className="p-6 border-b border-white/5">
          <Logo size="sm" onClick={() => navigate('/')} />
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sideItems.map(item => (
            <button
              key={item.id}
              data-testid={`admin-tab-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border-l-2 ${
                activeTab === item.id
                  ? 'bg-primary/10 text-primary border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5 border-transparent'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
              {item.id === 'messages' && stats.unread_messages > 0 && (
                <Badge className="ml-auto bg-destructive text-white text-xs px-1.5 py-0">{stats.unread_messages}</Badge>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm" className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-sm" data-testid="admin-logout-btn">
            <LogOut className="w-4 h-4 mr-2" /> Çıxış
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-64 p-8">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} data-testid="admin-dashboard">
            <h1 className="font-heading text-2xl font-bold text-foreground mb-8">İdarə Paneli</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Məhsullar', value: stats.total_products, icon: Package, color: 'text-blue-400' },
                { label: 'Mesajlar', value: stats.total_messages, icon: Mail, color: 'text-green-400' },
                { label: 'Oxunmamış', value: stats.unread_messages, icon: Eye, color: 'text-yellow-400' },
                { label: 'Söhbətlər', value: stats.total_chats, icon: MessageSquare, color: 'text-purple-400' },
              ].map(s => (
                <div key={s.label} className="rounded-2xl bg-card border border-white/5 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                    <BarChart3 className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="font-heading text-3xl font-bold text-foreground">{s.value || 0}</p>
                  <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Products */}
        {activeTab === 'products' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} data-testid="admin-products">
            <div className="flex items-center justify-between mb-8">
              <h1 className="font-heading text-2xl font-bold text-foreground">Kataloq İdarəetməsi</h1>
              <Button onClick={openNewProduct} className="bg-primary text-white hover:bg-blue-600 rounded-xl" data-testid="add-product-btn">
                <Plus className="w-4 h-4 mr-2" /> Yeni Məhsul
              </Button>
            </div>
            <div className="rounded-2xl bg-card border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Məhsul</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Kateqoriya</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Qiymət</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
                      <th className="text-right text-xs font-medium text-muted-foreground p-4">Əməliyyatlar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={p.images?.[0] || ''} alt="" className="w-10 h-10 rounded-lg object-cover bg-secondary/30" />
                            <span className="text-sm font-medium text-foreground">{p.title}</span>
                          </div>
                        </td>
                        <td className="p-4"><Badge variant="outline" className="text-xs">{p.category}</Badge></td>
                        <td className="p-4 text-sm text-foreground font-medium">{p.price} {p.currency}</td>
                        <td className="p-4">
                          <Badge className={p.is_featured ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted-foreground'}>
                            {p.is_featured ? 'Seçilmiş' : 'Standart'}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <button onClick={() => openEditProduct(p)} className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors" data-testid={`edit-product-${p.id}`}>
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteProduct(p.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" data-testid={`delete-product-${p.id}`}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Product Form Dialog */}
            <Dialog open={showProductForm} onOpenChange={setShowProductForm}>
              <DialogContent className="bg-card border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-heading text-foreground">{editingProduct ? 'Məhsulu Redaktə et' : 'Yeni Məhsul'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Başlıq</Label>
                      <Input data-testid="product-form-title" value={productForm.title} onChange={e => setProductForm({ ...productForm, title: e.target.value })} className="bg-white/5 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Kateqoriya</Label>
                      <Input data-testid="product-form-category" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} className="bg-white/5 border-white/10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Qısa təsvir</Label>
                    <Input data-testid="product-form-short-desc" value={productForm.short_description} onChange={e => setProductForm({ ...productForm, short_description: e.target.value })} className="bg-white/5 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Təsvir</Label>
                    <Textarea data-testid="product-form-desc" value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} rows={3} className="bg-white/5 border-white/10" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Qiymət</Label>
                      <Input data-testid="product-form-price" type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} className="bg-white/5 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Valyuta</Label>
                      <Input value={productForm.currency} onChange={e => setProductForm({ ...productForm, currency: e.target.value })} className="bg-white/5 border-white/10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Xüsusiyyətlər (vergüllə ayırın)</Label>
                    <Input data-testid="product-form-features" value={productForm.features} onChange={e => setProductForm({ ...productForm, features: e.target.value })} className="bg-white/5 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Texnologiyalar (vergüllə ayırın)</Label>
                    <Input data-testid="product-form-techs" value={productForm.technologies} onChange={e => setProductForm({ ...productForm, technologies: e.target.value })} className="bg-white/5 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Şəkil URL-ləri (vergüllə ayırın)</Label>
                    <Input data-testid="product-form-images" value={productForm.images} onChange={e => setProductForm({ ...productForm, images: e.target.value })} className="bg-white/5 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Demo URL</Label>
                    <Input value={productForm.demo_url} onChange={e => setProductForm({ ...productForm, demo_url: e.target.value })} className="bg-white/5 border-white/10" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={productForm.is_featured} onChange={e => setProductForm({ ...productForm, is_featured: e.target.checked })} data-testid="product-form-featured" className="rounded border-white/20" />
                    <Label className="text-sm">Seçilmiş məhsul</Label>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button onClick={saveProduct} className="bg-primary text-white hover:bg-blue-600 flex-1" data-testid="product-form-save">
                      {editingProduct ? 'Yenilə' : 'Əlavə et'}
                    </Button>
                    <Button variant="outline" onClick={() => setShowProductForm(false)} className="bg-white/5 border-white/10">Ləğv et</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        )}

        {/* Messages */}
        {activeTab === 'messages' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} data-testid="admin-messages">
            <h1 className="font-heading text-2xl font-bold text-foreground mb-8">Əlaqə Mesajları</h1>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="rounded-2xl bg-card border border-white/5 p-12 text-center">
                  <Mail className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Hələ mesaj yoxdur</p>
                </div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className={`rounded-2xl bg-card border p-6 transition-all ${msg.is_read ? 'border-white/5' : 'border-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]'}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-sm font-semibold text-foreground">{msg.name}</h3>
                          {!msg.is_read && <Badge className="bg-primary text-white text-xs">Yeni</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{msg.email} {msg.phone && `| ${msg.phone}`}</p>
                        {msg.subject && <p className="text-sm text-primary font-medium mb-2">{msg.subject}</p>}
                        <p className="text-sm text-muted-foreground leading-relaxed">{msg.message}</p>
                        <p className="text-xs text-muted-foreground mt-3">{new Date(msg.created_at).toLocaleString('az-AZ')}</p>
                      </div>
                      <div className="flex gap-1">
                        {!msg.is_read && (
                          <button onClick={() => markAsRead(msg.id)} className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-primary transition-colors" data-testid={`read-msg-${msg.id}`}>
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => deleteMessage(msg.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" data-testid={`delete-msg-${msg.id}`}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* Chat */}
        {activeTab === 'chat' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} data-testid="admin-chat">
            <h1 className="font-heading text-2xl font-bold text-foreground mb-8">Söhbətlər</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Conversations list */}
              <div className="rounded-2xl bg-card border border-white/5 overflow-hidden">
                <div className="p-4 border-b border-white/5">
                  <p className="text-sm font-medium text-foreground">Söhbətlər ({conversations.length})</p>
                </div>
                <div className="max-h-[500px] overflow-y-auto">
                  {conversations.length === 0 ? (
                    <div className="p-8 text-center">
                      <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">Hələ söhbət yoxdur</p>
                    </div>
                  ) : (
                    conversations.map(c => (
                      <button
                        key={c.id}
                        onClick={() => openConversation(c)}
                        data-testid={`convo-${c.id}`}
                        className={`w-full text-left p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors ${selectedConvo?.id === c.id ? 'bg-primary/5' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-foreground">{c.user_name || 'Qonaq'}</p>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{c.last_message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{c.message_count} mesaj</p>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Chat messages */}
              <div className="lg:col-span-2 rounded-2xl bg-card border border-white/5 flex flex-col" style={{ height: '560px' }}>
                {selectedConvo ? (
                  <>
                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{selectedConvo.user_name || 'Qonaq'}</p>
                        <p className="text-xs text-muted-foreground">{selectedConvo.session_id}</p>
                      </div>
                      <button onClick={() => setSelectedConvo(null)} className="p-1.5 rounded-lg hover:bg-white/5"><X className="w-4 h-4 text-muted-foreground" /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {convoMessages.map(m => (
                        <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                            m.sender === 'user' ? 'bg-white/5 text-foreground' :
                            m.sender === 'admin' ? 'bg-green-500/20 text-green-200' :
                            'bg-primary/20 text-blue-200'
                          }`}>
                            <p className="text-xs text-muted-foreground mb-1">
                              {m.sender === 'user' ? 'İstifadəçi' : m.sender === 'admin' ? 'Admin' : 'Bot'}
                            </p>
                            {m.content}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t border-white/5">
                      <div className="flex gap-2">
                        <Input
                          data-testid="admin-chat-reply"
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          placeholder="Cavab yazın..."
                          onKeyDown={e => e.key === 'Enter' && sendReply()}
                          className="bg-white/5 border-white/10 flex-1"
                        />
                        <Button onClick={sendReply} className="bg-primary text-white hover:bg-blue-600" data-testid="admin-chat-send">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">Söhbət seçin</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Admin;
