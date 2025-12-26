import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Truck, ArrowRight, Mail, Lock, ShieldCheck } from 'lucide-react';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Identifiants incorrects');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-100/40 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-100/40 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-[1100px] grid lg:grid-cols-2 gap-12 items-center relative z-10">
                {/* Left Side: Branding & Info */}
                <div className="hidden lg:flex flex-col space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary-600 p-3 rounded-2xl text-white shadow-xl shadow-primary-200">
                            <Truck className="h-8 w-8" />
                        </div>
                        <span className="text-3xl font-bold tracking-tight text-slate-900">AgroConnect</span>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl font-bold text-slate-900 leading-[1.1]">
                            La logistique agricole, <br />
                            <span className="text-primary-600 font-display italic">réinventée.</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium max-w-md leading-relaxed">
                            Connectez-vous pour gérer vos expéditions, suivre vos livraisons en temps réel et optimiser votre chaîne logistique.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-4">
                        <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-3">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <h4 className="font-bold text-slate-900 mb-1">Sécurisé</h4>
                            <p className="text-xs text-slate-500 font-medium">Vos données et transactions sont protégées.</p>
                        </div>
                        <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3">
                                <Truck className="h-5 w-5" />
                            </div>
                            <h4 className="font-bold text-slate-900 mb-1">Temps Réel</h4>
                            <p className="text-xs text-slate-500 font-medium">Suivi GPS interactif pour chaque trajet.</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="flex justify-center animate-in fade-in slide-in-from-right-8 duration-700">
                    <Card className="w-full max-w-md !rounded-[2.5rem] border-none shadow-2xl overflow-hidden">
                        <CardBody className="p-10 sm:p-12">
                            <div className="mb-10 lg:hidden flex flex-col items-center">
                                <div className="bg-primary-600 p-3 rounded-2xl text-white shadow-lg mb-4">
                                    <Truck className="h-6 w-6" />
                                </div>
                                <h1 className="text-2xl font-bold">AgroConnect</h1>
                            </div>

                            <div className="mb-10 text-center lg:text-left">
                                <h2 className="text-3xl font-bold text-slate-900 mb-2">Connexion</h2>
                                <p className="text-slate-500 font-medium text-sm">Bon retour ! Veuillez saisir vos identifiants.</p>
                            </div>

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {error && (
                                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-shake">
                                        <Lock className="h-4 w-4" />
                                        {error}
                                    </div>
                                )}

                                <Input
                                    label="Adresse e-mail"
                                    type="email"
                                    placeholder="nom@exemple.com"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />

                                <Input
                                    label="Mot de passe"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />

                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
                                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-600" />
                                        Se souvenir
                                    </label>
                                    <a href="#" className="font-bold text-primary-600 hover:text-primary-700">Oublié ?</a>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-14 text-lg"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Connexion...' : 'Se connecter'}
                                </Button>
                            </form>

                            <div className="mt-10 pt-10 border-t border-slate-100 text-center">
                                <p className="text-slate-500 font-medium">
                                    Pas encore de compte ?{' '}
                                    <Link to="/register" className="text-primary-600 font-bold hover:underline inline-flex items-center gap-1 active:scale-95 transition-transform">
                                        Créer un compte <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </p>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Login;
