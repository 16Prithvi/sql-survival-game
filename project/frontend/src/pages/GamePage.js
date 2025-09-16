import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { ArrowLeft, Play, Lightbulb, SkipForward, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { useGame } from '../context/GameContext';

const GamePage = () => {
  const { zone } = useParams();
  const navigate = useNavigate();
  const { gameState, unlockNextLevel, skipLevel, executeQuery, getZoneSchema, getTask, isLoading, resetGameProgress, manualSave, isZoneCompleted } = useGame();
  
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [expandedTables, setExpandedTables] = useState({});
  const [schema, setSchema] = useState({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const showingSuccessRef = useRef(false);

  // Get current level
  const zoneProgress = gameState.progress[zone] || [];
  const currentLevelData = zoneProgress.find(level => level.status === 'active');
  const currentLevel = currentLevelData?.level || 1;
  

  // Get current task
  const currentTask = getTask(zone, currentLevel);

  // Zone themes
  const themes = {
    beach: {
      name: 'The Beach',
      bgGradient: 'from-blue-900/40 via-slate-900 to-cyan-900/40',
      accentColor: 'blue',
      textColor: 'text-blue-300',
      borderColor: 'border-blue-400/50'
    },
    jungle: {
      name: 'The Jungle',
      bgGradient: 'from-green-900/40 via-slate-900 to-emerald-900/40',
      accentColor: 'green',
      textColor: 'text-green-300',
      borderColor: 'border-green-400/50'
    },
    ruins: {
      name: 'The Ruins',
      bgGradient: 'from-purple-900/40 via-slate-900 to-amber-900/40',
      accentColor: 'purple',
      textColor: 'text-purple-300',
      borderColor: 'border-purple-400/50'
    }
  };

  const theme = themes[zone] || themes.beach;

  // Load schema on mount and when zone changes
  useEffect(() => {
    const loadSchema = async () => {
      try {
        const zoneSchema = await getZoneSchema(zone);
        setSchema(zoneSchema);
      } catch (error) {
        console.error('Failed to load schema:', error);
      }
    };
    
    loadSchema();
  }, [zone, getZoneSchema]);

  // Check if zone is completed and redirect to completion page
  useEffect(() => {
    if (isZoneCompleted(zone)) {
      console.log(`Zone ${zone} is completed, redirecting to completion page`);
      navigate(`/complete/${zone}`);
    }
  }, [zone, isZoneCompleted, navigate]);

  useEffect(() => {
    setQuery('');
    setResult(null);
    setError('');
    setShowHint(false);
    // Only reset isCorrect if we're not showing a success message
    if (!showingSuccessRef.current) {
      setIsCorrect(false);
    }
  }, [currentLevel]);

  const handleExecuteQuery = async () => {
    if (!query.trim()) {
      setError('Please enter a SQL query');
      return;
    }

    setIsExecuting(true);
    setError('');
    setResult(null);
    setIsCorrect(false);

    try {
      const queryResult = await executeQuery(query, zone, currentLevel);
      
      if (queryResult.success) {
        setResult(queryResult.result);
        setIsCorrect(queryResult.correct);
        if (queryResult.correct) {
          showingSuccessRef.current = true;
        }
      } else {
        setError(queryResult.error || 'Query execution failed');
      }
    } catch (err) {
      setError('Query execution failed: ' + err.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSkip = () => {
    skipLevel(zone, currentLevel);
  };

  const handleLevelClick = (level) => {
    const levelData = zoneProgress[level - 1];
    if (levelData && (levelData.status === 'active' || levelData.status === 'completed' || levelData.status === 'skipped')) {
      // In a real implementation, you would navigate to this specific level
      console.log(`Navigate to level ${level}`);
    }
  };

  const toggleTable = (tableName) => {
    setExpandedTables(prev => ({
      ...prev,
      [tableName]: !prev[tableName]
    }));
  };

  const canSkip = currentLevelData?.attempts >= 3;

  if (!currentTask) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Zone not found</h1>
          <Button onClick={() => navigate('/map')}>Return to Map</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bgGradient} text-white`}>
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.05),transparent_70%)]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Button
            onClick={() => navigate('/map')}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Map
          </Button>
          <h1 
            className={`text-xl font-bold ${theme.textColor}`}
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            {theme.name.toUpperCase()}
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              Level {currentLevel} / {zoneProgress.length}
            </div>
            <div className="text-sm text-yellow-400">
              Score: {gameState.score}
            </div>
            <Button
              onClick={() => {
                if (window.confirm('Are you sure you want to start a new game? This will reset all your progress.')) {
                  resetGameProgress();
                }
              }}
              variant="outline"
              size="sm"
              className="border-red-500 text-red-400 hover:bg-red-500/10"
            >
              New Game
            </Button>
            <Button
              onClick={() => {
                const saved = localStorage.getItem('sqlSurvivalProgress');
                console.log('Current localStorage data:', saved ? JSON.parse(saved) : 'No data found');
                alert('Check console for localStorage data');
              }}
              variant="outline"
              size="sm"
              className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
            >
              Debug Save
            </Button>
            <Button
              onClick={() => {
                const success = manualSave();
                alert(success ? 'Manual save successful!' : 'Manual save failed!');
              }}
              variant="outline"
              size="sm"
              className="border-green-500 text-green-400 hover:bg-green-500/10"
            >
              Force Save
            </Button>
            <Button
              onClick={() => {
                // Simulate completing current level
                unlockNextLevel(zone, currentLevel);
                alert('Simulated level completion! Check console and localStorage.');
              }}
              variant="outline"
              size="sm"
              className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
            >
              Test Complete
            </Button>
            <Button
              onClick={() => {
                // Test basic localStorage functionality
                const testData = { test: 'data', timestamp: Date.now() };
                localStorage.setItem('test', JSON.stringify(testData));
                const retrieved = localStorage.getItem('test');
                console.log('localStorage test - saved:', testData);
                console.log('localStorage test - retrieved:', retrieved ? JSON.parse(retrieved) : 'null');
                alert('localStorage test completed - check console');
              }}
              variant="outline"
              size="sm"
              className="border-orange-500 text-orange-400 hover:bg-orange-500/10"
            >
              Test Storage
            </Button>
            <Button
              onClick={() => {
                // Check if our game data exists in localStorage
                const gameData = localStorage.getItem('sqlSurvivalProgress');
                if (gameData) {
                  const parsed = JSON.parse(gameData);
                  console.log('Game data found in localStorage:', parsed);
                  alert(`Game data found! Score: ${parsed.score}, Levels: ${parsed.statistics.levelsCompleted}`);
                } else {
                  console.log('No game data found in localStorage');
                  alert('No game data found in localStorage');
                }
              }}
              variant="outline"
              size="sm"
              className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
            >
              Check Data
            </Button>
            <Button
              onClick={() => {
                // Test zone completion
                navigate(`/complete/${zone}`);
              }}
              variant="outline"
              size="sm"
              className="border-pink-500 text-pink-400 hover:bg-pink-500/10"
            >
              Test Complete
            </Button>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex-1 p-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-6 h-full">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            {/* Database Schema */}
            <Card className="bg-gray-800/80 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sm text-gray-300 flex items-center">
                  Database Schema
                  {isLoading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.keys(schema).length === 0 ? (
                  <p className="text-sm text-gray-500">Loading schema...</p>
                ) : (
                  Object.entries(schema).map(([tableName, columns]) => (
                    <div key={tableName} className="border border-gray-700 rounded">
                      <button
                        onClick={() => toggleTable(tableName)}
                        className="w-full flex items-center justify-between p-2 text-left hover:bg-gray-700/50 transition-colors"
                      >
                        <span className="text-sm font-mono text-blue-400">{tableName}</span>
                        {expandedTables[tableName] ? 
                          <ChevronDown className="w-4 h-4" /> : 
                          <ChevronRight className="w-4 h-4" />
                        }
                      </button>
                      {expandedTables[tableName] && (
                        <div className="px-2 pb-2 space-y-1">
                          {columns.map(column => (
                            <div key={column} className="text-xs text-gray-400 font-mono pl-4">
                              {column}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* SQL Keywords */}
            <Card className="bg-gray-800/80 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sm text-gray-300">SQL Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-1 text-xs font-mono">
                  {['SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING', 'JOIN', 'LIMIT'].map(keyword => (
                    <span key={keyword} className={`px-2 py-1 rounded bg-gray-700/50 ${theme.textColor}`}>
                      {keyword}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="bg-gray-800/80 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sm text-gray-300">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-xs text-gray-400">
                  <div>Score: <span className="text-yellow-400">{gameState.score}</span></div>
                  <div>Levels Completed: <span className="text-green-400">{gameState.statistics.levelsCompleted}</span></div>
                  <div>Queries Executed: <span className="text-blue-400">{gameState.statistics.totalQueriesExecuted}</span></div>
                  <div>Success Rate: <span className="text-purple-400">
                    {gameState.statistics.totalQueriesExecuted > 0 
                      ? Math.round((gameState.statistics.correctQueries / gameState.statistics.totalQueriesExecuted) * 100)
                      : 0}%
                  </span></div>
                </div>
              </CardContent>
            </Card>

            {/* Level Navigator */}
            <Card className="bg-gray-800/80 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sm text-gray-300">Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {zoneProgress.map((level, index) => {
                    const levelNum = index + 1;
                    let bgColor = 'bg-gray-700';
                    let textColor = 'text-gray-400';
                    let cursor = 'cursor-not-allowed';

                    if (level.status === 'completed') {
                      bgColor = 'bg-green-600';
                      textColor = 'text-white';
                      cursor = 'cursor-pointer';
                    } else if (level.status === 'skipped') {
                      bgColor = 'bg-yellow-600';
                      textColor = 'text-white';
                      cursor = 'cursor-pointer';
                    } else if (level.status === 'active') {
                      bgColor = `bg-${theme.accentColor}-600`;
                      textColor = 'text-white';
                      cursor = 'cursor-pointer';
                    }

                    return (
                      <button
                        key={levelNum}
                        onClick={() => handleLevelClick(levelNum)}
                        className={`w-8 h-8 rounded text-xs font-bold transition-all ${bgColor} ${textColor} ${cursor} hover:scale-110`}
                        disabled={level.status === 'locked'}
                      >
                        {levelNum}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-4">
            {/* Task Description */}
            <Card className={`bg-gray-800/80 ${theme.borderColor} backdrop-blur-sm border-2`}>
              <CardContent className="p-6">
                {currentTask.storyText && (
                  <div className="mb-4 p-4 bg-gray-900/50 rounded-lg">
                    <p className="text-gray-300 italic">{currentTask.storyText}</p>
                  </div>
                )}
                <h2 
                  className={`text-xl mb-2 ${theme.textColor}`}
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  Task {currentLevel}: {currentTask.title}
                </h2>
                <p className="text-gray-300 mb-4">{currentTask.description}</p>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowHint(!showHint)}
                    variant="outline"
                    size="sm"
                    className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
                  >
                    <Lightbulb className="w-4 h-4 mr-1" />
                    Hint
                  </Button>
                  {canSkip && (
                    <Button
                      onClick={handleSkip}
                      variant="outline"
                      size="sm"
                      className="border-orange-500 text-orange-400 hover:bg-orange-500/10"
                    >
                      <SkipForward className="w-4 h-4 mr-1" />
                      Skip ({currentLevelData.attempts} attempts)
                    </Button>
                  )}
                </div>

                {showHint && (
                  <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-600/50 rounded">
                    <p className="text-yellow-300 text-sm">{currentTask.hint}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* SQL Editor */}
            <Card className="bg-gray-800/80 border-gray-700/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm text-gray-300">query.sql</CardTitle>
                <Button
                  onClick={handleExecuteQuery}
                  disabled={isExecuting}
                  className={`bg-${theme.accentColor}-600 hover:bg-${theme.accentColor}-500 text-white disabled:opacity-50`}
                  style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}
                >
                  {isExecuting ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 mr-1" />
                  )}
                  {isExecuting ? 'RUNNING' : 'EXECUTE'}
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="-- Enter your SQL query here
SELECT * FROM survivors;"
                  className="min-h-32 font-mono bg-gray-900/50 border-gray-600 text-green-400 resize-none"
                  onKeyDown={(e) => {
                    if (e.ctrlKey && e.key === 'Enter') {
                      e.preventDefault();
                      handleExecuteQuery();
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-2">Press Ctrl+Enter to execute</p>
              </CardContent>
            </Card>

            {/* Results */}
            <Card className="bg-gray-800/80 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sm text-gray-300">Results</CardTitle>
              </CardHeader>
              <CardContent>
                {error ? (
                  <div className="p-4 bg-red-900/20 border border-red-600/50 rounded">
                    <p className="text-red-300">{error}</p>
                  </div>
                ) : result ? (
                  <div className="space-y-4">
                    {result.length === 0 ? (
                      <p className="text-gray-400">No results returned</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-600">
                              {Object.keys(result[0]).map(key => (
                                <th key={key} className="text-left p-2 text-gray-300 font-mono">
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {result.map((row, index) => (
                              <tr key={index} className="border-b border-gray-700/50">
                                {Object.values(row).map((value, cellIndex) => (
                                  <td key={cellIndex} className="p-2 text-gray-300 font-mono">
                                    {value}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    
                    {/* Success message */}
                    {isCorrect && (
                      <div className="p-4 bg-green-900/20 border border-green-600/50 rounded">
                        <p className="text-green-300 font-bold mb-3">✓ Correct! Well done!</p>
                        <Button
                          onClick={() => {
                            console.log('Next Question button clicked! Zone:', zone, 'Level:', currentLevel);
                            showingSuccessRef.current = false;
                            unlockNextLevel(zone, currentLevel);
                            console.log('unlockNextLevel called, checking state in 1 second...');
                            setTimeout(() => {
                              console.log('Current game state after unlockNextLevel:', {
                                score: gameState.score,
                                levelsCompleted: gameState.statistics.levelsCompleted,
                                currentLevel: currentLevel
                              });
                            }, 1000);
                          }}
                          className={`bg-${theme.accentColor}-600 hover:bg-${theme.accentColor}-500 text-white`}
                          style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}
                        >
                          Next Question
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <Play className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Awaiting Command... Enter a query and press Execute.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;