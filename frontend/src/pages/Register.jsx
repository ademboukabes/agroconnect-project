import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Truck, ArrowRight, User, Mail, Lock, Phone, FileText, Briefcase, ShieldCheck, Check } from 'lucide-react';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
        phone: '',
        licenseNumber: '',
        licenseType: 'Permis B'
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur d\'inscription');
        } finally {
            setIsLoading(false);
        }
    };

    const roles = [
        { id: 'user', title: 'Client', description: 'Agriculteur ou Entreprise', icon: User },
        { id: 'transporter', title: 'Transporteur', description: 'Partenaire de transport', icon: Truck },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-100/40 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-[1200px] grid lg:grid-cols-2 gap-12 items-start relative z-10">
                {/* Left Side: Onboarding Content */}
                <div className="hidden lg:flex flex-col space-y-10 py-12 animate-in fade-in slide-in-from-left-8 duration-700">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary-600 p-3 rounded-2xl text-white shadow-xl">
                            <Truck className="h-8 w-8" />
                        </div>
                        <span className="text-3xl font-bold tracking-tight text-slate-900">AgroConnect</span>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-5xl font-bold text-slate-900 leading-[1.1]">
                            Prêt à optimiser votre <br />
                            <span className="text-primary-600 font-display italic">chaîne logistique ?</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium max-w-md leading-relaxed">
                            Rejoignez la plus grande communauté logistique dédiée à l'agriculture en Algérie.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {[
                            { title: 'Inscription Gratuite', icon: Check, color: 'emerald' },
                            { title: 'Validation Rapide', icon: Check, color: 'emerald' },
                            { title: 'Support 24/7', icon: Check, color: 'emerald' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                    <item.icon className="h-4 w-4" />
                                </div>
                                <span className="text-slate-700 font-bold">{item.title}</span>
                            </div>
                        ))}
                    </div>

                    <Card className="!rounded-3xl border-none shadow-xl bg-slate-900 text-white p-8 max-w-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-12 w-12 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-bold">Confiance & Sécurité</h4>
                                <p className="text-xs text-slate-400 font-medium">Certification de nos membres</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed font-medium">
                            Chaque transporteur est rigoureusement vérifié pour garantir une sécurité maximale à nos utilisateurs.
                        </p>
                    </Card>
                </div>

                {/* Right Side: Registration Form */}
                <div className="flex justify-center animate-in fade-in slide-in-from-right-8 duration-700">
                    <Card className="w-full max-w-xl !rounded-[2.5rem] border-none shadow-2xl overflow-hidden">
                        <CardBody className="p-8 sm:p-12">
                            <div className="mb-10 text-center lg:text-left">
                                <h2 className="text-3xl font-bold text-slate-900 mb-2">Créer un compte</h2>
                                <p className="text-slate-500 font-medium text-sm">Veuillez remplir vos informations pour commencer.</p>
                            </div>

                            <form className="space-y-8" onSubmit={handleSubmit}>
                                {error && (
                                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-shake">
                                        <Lock className="h-4 w-4" />
                                        {error}
                                    </div>
                                )}

                                {/* Role Selection */}
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Je souhaite m'inscrire en tant que :</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {roles.map((role) => (
                                            <button
                                                key={role.id}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, role: role.id })}
                                                className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left relative group ${formData.role === role.id
                                                    ? 'border-primary-500 bg-primary-50/50 shadow-sm'
                                                    : 'border-slate-100 hover:border-slate-300 bg-white'
                                                    }`}
                                            >
                                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${formData.role === role.id ? 'bg-primary-500 text-white' : 'bg-slate-50 text-slate-400 group-hover:text-primary-500'
                                                    }`}>
                                                    <role.icon className="h-5 w-5" />
                                                </div>
                                                <h4 className={`font-bold text-sm ${formData.role === role.id ? 'text-primary-600' : 'text-slate-900'}`}>{role.title}</h4>
                                                <p className="text-[10px] text-slate-500 font-medium">{role.description}</p>
                                                {formData.role === role.id && (
                                                    <div className="absolute top-2 right-2 bg-primary-500 text-white rounded-full p-0.5">
                                                        <Check className="h-3 w-3" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <Input
                                        label="Nom complet"
                                        placeholder="Ahmed Ben Ali"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="bg-slate-50/50"
                                    />
                                    <Input
                                        label="Numéro de téléphone"
                                        placeholder="05 55 55 55 55"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="bg-slate-50/50"
                                    />
                                </div>

                                <Input
                                    label="Adresse e-mail"
                                    type="email"
                                    placeholder="nom@exemple.com"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="bg-slate-50/50"
                                />

                                <Input
                                    label="Mot de passe"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="bg-slate-50/50"
                                />

                                {formData.role === 'transporter' && (
                                    <div className="p-6 bg-slate-50/80 rounded-[2rem] border border-slate-100 space-y-6 animate-in slide-in-from-top-4 duration-500">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                                <Truck className="h-4 w-4 text-primary-600" />
                                                Profil Professionnel
                                            </h4>
                                            <Badge variant="primary">Transporteur</Badge>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <Input
                                                label="Numéro de permis"
                                                placeholder="N° de licence"
                                                required
                                                value={formData.licenseNumber}
                                                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                                                className="bg-white"
                                            />
                                            <Select
                                                label="Type de permis"
                                                value={formData.licenseType}
                                                onChange={(e) => setFormData({ ...formData, licenseType: e.target.value })}
                                                options={[
                                                    { value: 'Permis B', label: 'Permis B (Léger)' },
                                                    { value: 'Permis C', label: 'Permis C (Poids Lourd)' },
                                                    { value: 'Permis C1', label: 'Permis C1 (Moyen)' },
                                                    { value: 'Permis D', label: 'Permis D (Bus)' },
                                                    { value: 'Permis E', label: 'Permis E (Remorque)' },
                                                ]}
                                                className="bg-white"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4 pt-2">
                                    <Button
                                        type="submit"
                                        className="w-full h-14 text-lg"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Inscription...' : "C'est parti !"}
                                    </Button>

                                    <p className="text-[10px] text-slate-400 text-center px-6">
                                        En vous inscrivant, vous acceptez nos <a href="#" className="underline">Conditions d'Utilisation</a> et notre <a href="#" className="underline">Politique de Confidentialité</a>.
                                    </p>
                                </div>

                                <div className="pt-8 border-t border-slate-100 text-center">
                                    <p className="text-slate-500 font-medium text-sm">
                                        Déjà un compte ?{' '}
                                        <Link to="/login" className="text-primary-600 font-bold hover:underline inline-flex items-center gap-1 active:scale-95 transition-transform">
                                            Se connecter <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Register;
