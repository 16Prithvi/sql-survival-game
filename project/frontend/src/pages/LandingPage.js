import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Waves, Brain, Search, MapPin } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Animated background waves */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-gray-900 to-slate-800"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-800/30 to-transparent animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-400" style={{ fontFamily: '"Press Start 2P", monospace' }}>
            SQL SURVIVAL
          </h1>
          <Button 
            onClick={() => navigate('/map')}
            className="bg-blue-600 hover:bg-blue-500 text-white border-2 border-blue-400 shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-400/40 hover:scale-105"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            START GAME
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 text-center py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 
            className="text-3xl md:text-5xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 drop-shadow-2xl leading-tight"
            style={{ 
              fontFamily: '"Press Start 2P", monospace',
              letterSpacing: '0.05em',
              lineHeight: '1.2'
            }}
          >
            MASTER SQL ON A MYSTERIOUS ISLAND
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 leading-relaxed">
            Survive a shipwreck adventure while learning SQL commands. 
            Query databases to find resources, decode mysteries, and escape the island!
          </p>
          <Button 
            onClick={() => navigate('/map')}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border-2 border-cyan-400 shadow-xl shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-400/50 hover:scale-110 text-lg px-8 py-4"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            ▶ START YOUR ADVENTURE
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-3xl text-center mb-12 text-blue-300"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            WHAT AWAITS YOU
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-800/80 border-2 border-blue-500/50 shadow-lg shadow-blue-500/20 hover:shadow-blue-400/40 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Brain className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 
                  className="text-xl mb-3 text-blue-300"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  LEARN SQL
                </h3>
                <p className="text-gray-300">
                  Master SQL commands from basic SELECT statements to advanced window functions through engaging challenges.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/80 border-2 border-green-500/50 shadow-lg shadow-green-500/20 hover:shadow-green-400/40 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <MapPin className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 
                  className="text-xl mb-3 text-green-300"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  EXPLORE ISLANDS
                </h3>
                <p className="text-gray-300">
                  Journey through three unique zones: Beach, Jungle, and Ancient Ruins, each with increasing difficulty.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/80 border-2 border-purple-500/50 shadow-lg shadow-purple-500/20 hover:shadow-purple-400/40 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Search className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 
                  className="text-xl mb-3 text-purple-300"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  REAL QUERIES
                </h3>
                <p className="text-gray-300">
                  Write actual SQL queries in a browser-based editor with real database tables and instant feedback.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Explore Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-3xl text-center mb-12 text-blue-300"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            EXPLORE THE ISLAND
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border-2 border-blue-400/50 shadow-xl shadow-blue-500/30 hover:shadow-blue-400/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Waves className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h3 
                  className="text-xl mb-3 text-blue-300"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  THE BEACH
                </h3>
                <p className="text-gray-300 mb-4">
                  Begin your journey with basic SQL queries. Organize survivors and supplies to establish your camp.
                </p>
                <div className="text-sm text-blue-400 space-y-1">
                  <div>• SELECT, WHERE, ORDER BY</div>
                  <div>• Basic Joins</div>
                  <div>• 15 Challenges</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-2 border-green-400/50 shadow-xl shadow-green-500/30 hover:shadow-green-400/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="text-2xl">🌿</div>
                </div>
                <h3 
                  className="text-xl mb-3 text-green-300"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  THE JUNGLE
                </h3>
                <p className="text-gray-300 mb-4">
                  Venture into dense wilderness. Catalog wildlife and plan expeditions using intermediate SQL.
                </p>
                <div className="text-sm text-green-400 space-y-1">
                  <div>• GROUP BY, HAVING</div>
                  <div>• Aggregate Functions</div>
                  <div>• 20 Challenges</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/40 to-amber-900/40 border-2 border-purple-400/50 shadow-xl shadow-purple-500/30 hover:shadow-purple-400/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="text-2xl">🏛️</div>
                </div>
                <h3 
                  className="text-xl mb-3 text-purple-300"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  THE RUINS
                </h3>
                <p className="text-gray-300 mb-4">
                  Uncover ancient secrets with advanced SQL. Master complex queries to find your escape.
                </p>
                <div className="text-sm text-purple-400 space-y-1">
                  <div>• Subqueries, CTEs</div>
                  <div>• Window Functions</div>
                  <div>• 15 Challenges</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2025 SQL Survival. Master databases, survive the adventure.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;