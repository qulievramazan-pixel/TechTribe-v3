import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../lib/api';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Logo } from '../components/Logo';
import { Lock, Mail, User, Eye, EyeOff } from 'lucide-react';

const Auth = ({ onLogin }) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '', confirmPassword: '', admin_secret: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) { setError('Bütün sahələri doldurun'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.login(loginForm);
      localStorage.setItem('techtribe_token', res.data.token);
      localStorage.setItem('techtribe_user', JSON.stringify(res.data.user));
      onLogin(res.data.user);
      navigate('/tuqayyaxsi');
    } catch (err) {
      setError(err.response?.data?.detail || 'Giriş zamanı xəta baş verdi');
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regForm.name || !regForm.email || !regForm.password || !regForm.admin_secret) { setError('Bütün sahələri doldurun'); return; }
    if (regForm.password !== regForm.confirmPassword) { setError('Şifrələr uyğun gəlmir'); return; }
    if (regForm.password.length < 6) { setError('Şifrə ən azı 6 simvol olmalıdır'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.register({ name: regForm.name, email: regForm.email, password: regForm.password, admin_secret: regForm.admin_secret });
      localStorage.setItem('techtribe_token', res.data.token);
      localStorage.setItem('techtribe_user', JSON.stringify(res.data.user));
      onLogin(res.data.user);
      navigate('/tuqayyaxsi');
    } catch (err) {
      setError(err.response?.data?.detail || 'Qeydiyyat zamanı xəta baş verdi');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 hero-glow" data-testid="auth-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center" />
          <p className="text-sm text-muted-foreground mt-3">İdarə panelinə daxil olun</p>
        </div>

        <div className="rounded-2xl bg-card border border-white/5 p-8">
          <Tabs value={tab} onValueChange={(v) => { setTab(v); setError(''); }}>
            <TabsList className="grid w-full grid-cols-2 bg-white/5 rounded-xl p-1 mb-6">
              <TabsTrigger value="login" data-testid="login-tab" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white text-sm">
                Daxil ol
              </TabsTrigger>
              <TabsTrigger value="register" data-testid="register-tab" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white text-sm">
                Qeydiyyat
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-5" data-testid="login-form">
                <div className="space-y-2">
                  <Label className="text-sm text-foreground">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      data-testid="login-email"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      placeholder="admin@techtribe.az"
                      className="pl-10 bg-white/5 border-white/10 focus:border-primary h-12 rounded-lg"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-foreground">Şifrə</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      data-testid="login-password"
                      type={showPass ? 'text' : 'password'}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      placeholder="Şifrənizi daxil edin"
                      className="pl-10 pr-10 bg-white/5 border-white/10 focus:border-primary h-12 rounded-lg"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {error && <p className="text-sm text-destructive" data-testid="auth-error">{error}</p>}
                <Button
                  type="submit"
                  disabled={loading}
                  data-testid="login-submit-btn"
                  className="w-full bg-primary text-white hover:bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.3)] rounded-full py-6 text-base font-medium transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Yüklənir...' : 'Daxil ol'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-5" data-testid="register-form">
                <div className="space-y-2">
                  <Label className="text-sm text-foreground">Ad</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      data-testid="register-name"
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                      placeholder="Adınız"
                      className="pl-10 bg-white/5 border-white/10 focus:border-primary h-12 rounded-lg"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-foreground">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      data-testid="register-email"
                      type="email"
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      placeholder="email@nümunə.az"
                      className="pl-10 bg-white/5 border-white/10 focus:border-primary h-12 rounded-lg"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-foreground">Şifrə</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      data-testid="register-password"
                      type={showPass ? 'text' : 'password'}
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                      placeholder="Minimum 6 simvol"
                      className="pl-10 pr-10 bg-white/5 border-white/10 focus:border-primary h-12 rounded-lg"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-foreground">Şifrə təsdiqi</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      data-testid="register-confirm-password"
                      type={showPass ? 'text' : 'password'}
                      value={regForm.confirmPassword}
                      onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                      placeholder="Şifrəni təkrar daxil edin"
                      className="pl-10 bg-white/5 border-white/10 focus:border-primary h-12 rounded-lg"
                    />
                  </div>
                </div>
                {error && <p className="text-sm text-destructive" data-testid="auth-error">{error}</p>}
                <Button
                  type="submit"
                  disabled={loading}
                  data-testid="register-submit-btn"
                  className="w-full bg-primary text-white hover:bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.3)] rounded-full py-6 text-base font-medium transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Yüklənir...' : 'Qeydiyyatdan keç'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
