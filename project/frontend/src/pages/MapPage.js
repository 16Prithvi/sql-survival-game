import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Lock, CheckCircle, Play, ArrowLeft } from 'lucide-react';
import { useGame } from '../context/GameContext';

const MapPage = () => {
  const navigate = useNavigate();
  const { gameState } = useGame();

  const zones = [
    {
      id: 'beach',
      name: 'The Beach',
      description: 'Basic SQL Commands',
      totalLevels: 15,
      concepts: ['SELECT', 'WHERE', 'ORDER BY', 'LIMIT', 'Basic Joins'],
      bgGradient: 'from-blue-600/30 to-cyan-600/30',
      borderColor: 'border-blue-400/50',
      shadowColor: 'shadow-blue-500/30',
      textColor: 'text-blue-300',
      unlocked: true
    },
    {
      id: 'jungle',
      name: 'The Jungle',
      description: 'Intermediate SQL',
      totalLevels: 20,
      concepts: ['GROUP BY', 'HAVING', 'Aggregate Functions', 'DISTINCT'],
      bgGradient: 'from-green-600/30 to-emerald-600/30',
      borderColor: 'border-green-400/50',
      shadowColor: 'shadow-green-500/30',
      textColor: 'text-green-300',
      unlocked: gameState.unlockedZones.includes('jungle')
    },
    {
      id: 'ruins',
      name: 'The Ruins',
      description: 'Advanced SQL',
      totalLevels: 15,
      concepts: ['Subqueries', 'Window Functions', 'CTEs', 'Query Optimization'],
      bgGradient: 'from-purple-600/30 to-amber-600/30',
      borderColor: 'border-purple-400/50',
      shadowColor: 'shadow-purple-500/30',
      textColor: 'text-purple-300',
      unlocked: gameState.unlockedZones.includes('ruins')
    }
  ];

  const getProgress = (zoneId) => {
    const zoneProgress = gameState.progress[zoneId] || [];
    const completed = zoneProgress.filter(level => level.status === 'completed').length;
    return completed;
  };

  const handleZoneClick = (zone) => {
    if (zone.unlocked) {
      navigate(`/game/${zone.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/40 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 
            className="text-2xl font-bold text-blue-400"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            ADVENTURE MAP
          </h1>
          <div></div>
        </div>
      </header>

      {/* Map Content */}
      <main className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 
              className="text-4xl md:text-5xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              CHOOSE YOUR PATH
            </h1>
            <p className="text-xl text-gray-300">
              Three zones await you. Master SQL skills as you progress through each mysterious region.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {zones.map((zone, index) => {
              const completed = getProgress(zone.id);
              const progress = Math.round((completed / zone.totalLevels) * 100);

              return (
                <Card
                  key={zone.id}
                  className={`relative overflow-hidden transition-all duration-500 cursor-pointer backdrop-blur-sm ${
                    zone.unlocked
                      ? `bg-gradient-to-br ${zone.bgGradient} border-2 ${zone.borderColor} shadow-xl ${zone.shadowColor} hover:shadow-2xl hover:scale-105`
                      : 'bg-gray-800/50 border-2 border-gray-600/50 shadow-lg opacity-60 grayscale'
                  }`}
                  onClick={() => handleZoneClick(zone)}
                >
                  <CardContent className="p-6 relative">
                    {/* Unlock status indicator */}
                    {!zone.unlocked && (
                      <div className="absolute top-4 right-4">
                        <Lock className="w-6 h-6 text-gray-400" />
                      </div>
                    )}

                    {zone.unlocked && completed > 0 && (
                      <div className="absolute top-4 right-4">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      </div>
                    )}

                    {/* Zone Icon */}
                    <div className="text-center mb-6">
                      <div className={`w-20 h-20 mx-auto rounded-lg flex items-center justify-center text-4xl mb-4 ${
                        zone.unlocked ? 'bg-white/10' : 'bg-gray-700/50'
                      }`}>
                        {zone.id === 'beach' && '🏖️'}
                        {zone.id === 'jungle' && '🌿'}
                        {zone.id === 'ruins' && '🏛️'}
                      </div>
                      <h3 
                        className={`text-2xl mb-2 ${zone.unlocked ? zone.textColor : 'text-gray-400'}`}
                        style={{ fontFamily: '"Press Start 2P", monospace' }}
                      >
                        {zone.name}
                      </h3>
                      <p className={`text-sm ${zone.unlocked ? 'text-gray-300' : 'text-gray-500'}`}>
                        {zone.description}
                      </p>
                    </div>

                    {/* Progress */}
                    {zone.unlocked ? (
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-300">Progress</span>
                          <span className="text-sm text-gray-300">{completed}/{zone.totalLevels}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 bg-gradient-to-r ${
                              zone.id === 'beach' ? 'from-blue-500 to-cyan-500' :
                              zone.id === 'jungle' ? 'from-green-500 to-emerald-500' :
                              'from-purple-500 to-amber-500'
                            }`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-6 text-center">
                        <p className="text-sm text-gray-500">
                          {index === 1 ? 'Complete The Beach to unlock' : 'Complete The Jungle to unlock'}
                        </p>
                      </div>
                    )}

                    {/* Concepts */}
                    <div className="mb-6">
                      <h4 className={`text-sm mb-2 ${zone.unlocked ? 'text-gray-300' : 'text-gray-500'}`}>
                        SQL Concepts:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {zone.concepts.map((concept) => (
                          <span
                            key={concept}
                            className={`px-2 py-1 text-xs rounded ${
                              zone.unlocked 
                                ? 'bg-white/10 text-gray-300' 
                                : 'bg-gray-700/50 text-gray-500'
                            }`}
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    {zone.unlocked ? (
                      <Button 
                        className={`w-full bg-gradient-to-r ${
                          zone.id === 'beach' ? 'from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500' :
                          zone.id === 'jungle' ? 'from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500' :
                          'from-purple-600 to-amber-600 hover:from-purple-500 hover:to-amber-500'
                        } text-white border-0 shadow-lg transition-all duration-300 hover:scale-105`}
                        style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {completed > 0 ? 'CONTINUE' : 'START'}
                      </Button>
                    ) : (
                      <Button 
                        disabled
                        className="w-full bg-gray-700 text-gray-500 cursor-not-allowed"
                        style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        LOCKED
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MapPage;