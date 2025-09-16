import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { CheckCircle, Star, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext';

const ZoneCompletionPage = () => {
  const { zone } = useParams();
  const navigate = useNavigate();
  const { gameState } = useGame();
  const [showAnimation, setShowAnimation] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Zone themes and completion data
  const zoneData = {
    beach: {
      name: 'The Beach',
      nextZone: 'jungle',
      nextZoneName: 'The Jungle',
      bgGradient: 'from-blue-900/40 via-slate-900 to-cyan-900/40',
      accentColor: 'blue',
      textColor: 'text-blue-300',
      borderColor: 'border-blue-400/50',
      icon: '🏖️',
      description: 'You have mastered the art of SQL on the sandy shores!',
      nextDescription: 'Now venture into the mysterious jungle where more complex challenges await.'
    },
    jungle: {
      name: 'The Jungle',
      nextZone: 'ruins',
      nextZoneName: 'The Ancient Ruins',
      bgGradient: 'from-green-900/40 via-slate-900 to-emerald-900/40',
      accentColor: 'green',
      textColor: 'text-green-300',
      borderColor: 'border-green-400/50',
      icon: '🌿',
      description: 'You have conquered the wild jungle and its SQL mysteries!',
      nextDescription: 'The ancient ruins hold the final secrets of SQL mastery.'
    },
    ruins: {
      name: 'The Ancient Ruins',
      nextZone: null,
      nextZoneName: 'Complete',
      bgGradient: 'from-purple-900/40 via-slate-900 to-amber-900/40',
      accentColor: 'purple',
      textColor: 'text-purple-300',
      borderColor: 'border-purple-400/50',
      icon: '🏛️',
      description: 'Congratulations! You have mastered all the SQL challenges!',
      nextDescription: 'You are now a true SQL survivor!'
    }
  };

  const currentZoneData = zoneData[zone] || zoneData.beach;
  const zoneProgress = gameState.progress[zone] || [];
  const completedLevels = zoneProgress.filter(level => level.status === 'completed').length;
  const totalLevels = zoneProgress.length;

  // Calculate zone statistics
  const zoneStats = {
    levelsCompleted: completedLevels,
    totalLevels: totalLevels,
    completionRate: Math.round((completedLevels / totalLevels) * 100),
    score: gameState.score,
    totalQueries: gameState.statistics.totalQueriesExecuted,
    successRate: gameState.statistics.totalQueriesExecuted > 0 
      ? Math.round((gameState.statistics.correctQueries / gameState.statistics.totalQueriesExecuted) * 100)
      : 0
  };

  // Animation sequence
  useEffect(() => {
    const timer1 = setTimeout(() => setShowAnimation(true), 500);
    const timer2 = setTimeout(() => setShowStats(true), 1500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleContinue = () => {
    if (currentZoneData.nextZone) {
      navigate(`/game/${currentZoneData.nextZone}`);
    } else {
      navigate('/map');
    }
  };

  const handleReturnToMap = () => {
    navigate('/map');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentZoneData.bgGradient} text-white overflow-hidden`}>
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.05),transparent_70%)]"></div>
      </div>

      {/* Floating particles animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-${currentZoneData.accentColor}-400 rounded-full opacity-60 animate-pulse`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-4xl w-full">
          {/* Main completion card */}
          <Card className={`bg-gray-800/90 ${currentZoneData.borderColor} backdrop-blur-sm border-2 shadow-2xl`}>
            <CardContent className="p-8 text-center">
              {/* Zone icon and title */}
              <div className={`mb-8 ${showAnimation ? 'animate-bounce' : 'opacity-0'}`}>
                <div className="text-8xl mb-4">{currentZoneData.icon}</div>
                <h1 
                  className={`text-4xl font-bold ${currentZoneData.textColor} mb-2`}
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  {currentZoneData.name.toUpperCase()}
                </h1>
                <h2 className="text-2xl text-gray-300 mb-4">ZONE COMPLETED!</h2>
              </div>

              {/* Completion message */}
              <div className={`mb-8 ${showAnimation ? 'animate-fade-in' : 'opacity-0'}`}>
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle className="w-12 h-12 text-green-400 mr-4" />
                  <span className="text-xl text-gray-300">{currentZoneData.description}</span>
                </div>
              </div>

              {/* Statistics */}
              {showStats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-yellow-400">{zoneStats.levelsCompleted}</div>
                    <div className="text-sm text-gray-400">Levels Completed</div>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-400">{zoneStats.completionRate}%</div>
                    <div className="text-sm text-gray-400">Completion Rate</div>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-400">{zoneStats.score}</div>
                    <div className="text-sm text-gray-400">Total Score</div>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-400">{zoneStats.successRate}%</div>
                    <div className="text-sm text-gray-400">Success Rate</div>
                  </div>
                </div>
              )}

              {/* Next zone preview */}
              {currentZoneData.nextZone && showStats && (
                <div className={`mb-8 p-6 bg-gray-700/30 rounded-lg border ${currentZoneData.borderColor}`}>
                  <div className="flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-yellow-400 mr-2" />
                    <h3 className="text-xl font-bold text-gray-300">Next Adventure</h3>
                  </div>
                  <div className="text-lg text-gray-300 mb-4">{currentZoneData.nextDescription}</div>
                  <div className="flex items-center justify-center">
                    <div className="text-4xl mr-4">
                      {zoneData[currentZoneData.nextZone]?.icon || '🎯'}
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${currentZoneData.textColor}`}>
                        {currentZoneData.nextZoneName}
                      </div>
                      <div className="text-sm text-gray-400">Ready to unlock!</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              {showStats && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {currentZoneData.nextZone ? (
                    <Button
                      onClick={handleContinue}
                      className={`bg-${currentZoneData.accentColor}-600 hover:bg-${currentZoneData.accentColor}-500 text-white px-8 py-3 text-lg`}
                      style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '12px' }}
                    >
                      <ArrowRight className="w-5 h-5 mr-2" />
                      CONTINUE TO {currentZoneData.nextZoneName.toUpperCase()}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleReturnToMap}
                      className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 text-lg"
                      style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '12px' }}
                    >
                      <Trophy className="w-5 h-5 mr-2" />
                      RETURN TO MAP
                    </Button>
                  )}
                  
                  <Button
                    onClick={handleReturnToMap}
                    variant="outline"
                    className="border-gray-400 text-gray-300 hover:bg-gray-700 px-8 py-3 text-lg"
                    style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '12px' }}
                  >
                    VIEW MAP
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ZoneCompletionPage;
