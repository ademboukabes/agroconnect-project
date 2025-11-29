import React from 'react';
import { Star, TrendingUp, Award, AlertTriangle } from 'lucide-react';

const DriverRating = ({ aiRating }) => {
    if (!aiRating || aiRating.score === 0) {
        return (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <p className="text-gray-500">Pas encore de notation IA disponible</p>
                <p className="text-xs text-gray-400 mt-1">Effectuez des livraisons pour obtenir un score</p>
            </div>
        );
    }

    const getColor = (score) => {
        if (score >= 85) return 'text-green-600 bg-green-50 border-green-200';
        if (score >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
        if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    const colorClass = getColor(aiRating.score);

    return (
        <div className={`p-4 rounded-lg border ${colorClass} transition-all duration-300`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Score de Fiabilité IA
                    </h3>
                    <p className="text-sm opacity-80">Basé sur {aiRating.totalTripsAnalyzed} trajets analysés</p>
                </div>
                <div className="text-3xl font-bold">
                    {aiRating.score}<span className="text-lg text-gray-400">/100</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-white/50 p-3 rounded-md">
                    <div className="text-xs uppercase tracking-wide opacity-70 mb-1">Catégorie</div>
                    <div className="font-semibold flex items-center gap-1">
                        {aiRating.category}
                    </div>
                </div>
                <div className="bg-white/50 p-3 rounded-md">
                    <div className="text-xs uppercase tracking-wide opacity-70 mb-1">Consistance</div>
                    <div className="font-semibold flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {aiRating.consistency}%
                    </div>
                </div>
            </div>

            {aiRating.score < 60 && (
                <div className="mt-4 flex items-start gap-2 text-sm bg-white/60 p-2 rounded text-red-700">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>Votre score est bas. Assurez-vous de respecter les délais et de maintenir votre véhicule en bon état pour améliorer votre classement.</p>
                </div>
            )}
        </div>
    );
};

export default DriverRating;
