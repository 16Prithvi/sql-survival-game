import React, { createContext, useContext, useState, useEffect } from 'react';
import { createZoneDatabase, executeUserQuery, getDatabaseSchema, compareResults } from '../utils/sqlEngine';
import { gameTasks } from '../utils/gameData';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

// Default game state
const getDefaultGameState = () => ({
  unlockedZones: ['beach'],
  currentZone: null,
  currentLevel: 1,
  score: 0,
  totalAttempts: 0,
  inventory: {
    items: [],
    currency: 0
  },
  settings: {
    soundEnabled: true,
    musicEnabled: true,
    difficulty: 'normal'
  },
  statistics: {
    totalQueriesExecuted: 0,
    correctQueries: 0,
    timePlayed: 0,
    levelsCompleted: 0
  },
  progress: {
    beach: Array.from({ length: 15 }, (_, i) => ({
      level: i + 1,
      status: i === 0 ? 'active' : 'locked',
      attempts: 0,
      completedAt: null,
      bestTime: null
    })),
    jungle: Array.from({ length: 20 }, (_, i) => ({
      level: i + 1,
      status: 'locked',
      attempts: 0,
      completedAt: null,
      bestTime: null
    })),
    ruins: Array.from({ length: 15 }, (_, i) => ({
      level: i + 1,
      status: 'locked',
      attempts: 0,
      completedAt: null,
      bestTime: null
    }))
  }
});

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState(getDefaultGameState());

  const [databases, setDatabases] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Load progress from localStorage on mount
  useEffect(() => {
    const loadGameProgress = () => {
      try {
        const saved = localStorage.getItem('sqlSurvivalProgress');
        if (saved) {
          const parsedState = JSON.parse(saved);
          
          // Validate the loaded state and merge with defaults
          const defaultState = getDefaultGameState();
          const mergedState = {
            ...defaultState,
            ...parsedState,
            // Ensure progress structure is maintained
            progress: {
              ...defaultState.progress,
              ...parsedState.progress
            },
            // Ensure inventory structure is maintained
            inventory: {
              ...defaultState.inventory,
              ...parsedState.inventory
            },
            // Ensure settings structure is maintained
            settings: {
              ...defaultState.settings,
              ...parsedState.settings
            },
            // Ensure statistics structure is maintained
            statistics: {
              ...defaultState.statistics,
              ...parsedState.statistics
            }
          };
          
          console.log('Loaded game progress from localStorage:', {
            score: mergedState.score,
            levelsCompleted: mergedState.statistics.levelsCompleted,
            unlockedZones: mergedState.unlockedZones,
            beachProgress: mergedState.progress.beach.slice(0, 3).map(l => ({ level: l.level, status: l.status }))
          });
          setGameState(mergedState);
        } else {
          console.log('No saved progress found, starting with default state');
        }
      } catch (error) {
        console.error('Failed to load saved progress:', error);
        console.log('Starting with default state due to error');
        setGameState(getDefaultGameState());
      }
    };

    loadGameProgress();
  }, []);

  // Save progress to localStorage whenever state changes
  useEffect(() => {
    const saveGameProgress = () => {
      try {
        localStorage.setItem('sqlSurvivalProgress', JSON.stringify(gameState));
        console.log('Game progress saved to localStorage:', {
          score: gameState.score,
          levelsCompleted: gameState.statistics.levelsCompleted,
          unlockedZones: gameState.unlockedZones,
          beachProgress: gameState.progress.beach.slice(0, 3).map(l => ({ level: l.level, status: l.status }))
        });
      } catch (error) {
        console.error('Failed to save game progress:', error);
      }
    };

    // Only save if we have meaningful progress (not just the initial state)
    if (gameState.statistics.levelsCompleted > 0 || gameState.score > 0) {
      console.log('Saving progress because we have meaningful data');
      saveGameProgress();
    } else {
      console.log('Not saving - no meaningful progress yet');
    }
  }, [gameState]);

  // Initialize database for a zone
  const initializeZoneDatabase = async (zone) => {
    if (databases[zone]) {
      return databases[zone];
    }

    setIsLoading(true);
    try {
      const db = await createZoneDatabase(zone);
      setDatabases(prev => ({ ...prev, [zone]: db }));
      setIsLoading(false);
      return db;
    } catch (error) {
      console.error(`Failed to initialize ${zone} database:`, error);
      setIsLoading(false);
      throw error;
    }
  };

  const unlockNextLevel = (zone, currentLevel) => {
    console.log('unlockNextLevel called for zone:', zone, 'level:', currentLevel);
    setGameState(prev => {
      const newProgress = { ...prev.progress };
      const zoneProgress = [...newProgress[zone]];
      const now = new Date().toISOString();
      
      // Mark current level as completed with timestamp
      zoneProgress[currentLevel - 1] = {
        ...zoneProgress[currentLevel - 1],
        status: 'completed',
        completedAt: now
      };
      
      // Unlock next level if it exists
      if (currentLevel < zoneProgress.length) {
        zoneProgress[currentLevel] = {
          ...zoneProgress[currentLevel],
          status: 'active'
        };
      }
      
      // Check if zone is completed to unlock next zone
      const completedLevels = zoneProgress.filter(l => l.status === 'completed').length;
      let newUnlockedZones = [...prev.unlockedZones];
      
      if (zone === 'beach' && completedLevels >= 15 && !newUnlockedZones.includes('jungle')) {
        newUnlockedZones.push('jungle');
        newProgress.jungle[0].status = 'active';
      } else if (zone === 'jungle' && completedLevels >= 20 && !newUnlockedZones.includes('ruins')) {
        newUnlockedZones.push('ruins');
        newProgress.ruins[0].status = 'active';
      }
      
      newProgress[zone] = zoneProgress;
      
      // Update statistics
      const newStatistics = {
        ...prev.statistics,
        levelsCompleted: prev.statistics.levelsCompleted + 1,
        correctQueries: prev.statistics.correctQueries + 1
      };
      
      // Calculate score (base score + bonus for fewer attempts)
      const attempts = zoneProgress[currentLevel - 1].attempts;
      const baseScore = 100;
      const attemptBonus = Math.max(0, 50 - (attempts * 10));
      const newScore = prev.score + baseScore + attemptBonus;
      
      const newState = {
        ...prev,
        unlockedZones: newUnlockedZones,
        progress: newProgress,
        score: newScore,
        statistics: newStatistics
      };
      
      console.log('New game state after unlockNextLevel:', {
        score: newScore,
        levelsCompleted: newStatistics.levelsCompleted,
        unlockedZones: newUnlockedZones,
        currentZoneProgress: zoneProgress.map(l => ({ level: l.level, status: l.status }))
      });
      
      // Manually save to localStorage immediately after state update
      setTimeout(() => {
        try {
          localStorage.setItem('sqlSurvivalProgress', JSON.stringify(newState));
          console.log('IMMEDIATE SAVE: Game progress saved to localStorage after unlockNextLevel');
        } catch (error) {
          console.error('IMMEDIATE SAVE FAILED:', error);
        }
      }, 100);
      
      return newState;
    });
  };

  const skipLevel = (zone, currentLevel) => {
    setGameState(prev => {
      const newProgress = { ...prev.progress };
      const zoneProgress = [...newProgress[zone]];
      
      // Mark current level as skipped
      zoneProgress[currentLevel - 1] = {
        ...zoneProgress[currentLevel - 1],
        status: 'skipped'
      };
      
      // Unlock next level if it exists
      if (currentLevel < zoneProgress.length) {
        zoneProgress[currentLevel] = {
          ...zoneProgress[currentLevel],
          status: 'active'
        };
      }
      
      newProgress[zone] = zoneProgress;
      
      return {
        ...prev,
        progress: newProgress
      };
    });
  };

  const incrementAttempts = (zone, level) => {
    setGameState(prev => {
      const newProgress = { ...prev.progress };
      const zoneProgress = [...newProgress[zone]];
      
      zoneProgress[level - 1] = {
        ...zoneProgress[level - 1],
        attempts: zoneProgress[level - 1].attempts + 1
      };
      
      newProgress[zone] = zoneProgress;
      
      return {
        ...prev,
        progress: newProgress
      };
    });
  };

  const executeQuery = async (query, zone, level) => {
    try {
      // Update statistics for query execution
      setGameState(prev => ({
        ...prev,
        statistics: {
          ...prev.statistics,
          totalQueriesExecuted: prev.statistics.totalQueriesExecuted + 1
        }
      }));

      // Get or initialize database for the zone
      const database = await initializeZoneDatabase(zone);
      
      // Execute the user's query
      const userResult = executeUserQuery(query, database);
      
      if (!userResult.success) {
        incrementAttempts(zone, level);
        return {
          success: false,
          correct: false,
          result: null,
          error: userResult.error
        };
      }

      // Get the expected result by executing the expected query
      const task = gameTasks[zone]?.[level - 1];
      if (!task) {
        return {
          success: false,
          correct: false,
          result: null,
          error: 'Task not found'
        };
      }

      const expectedResult = executeUserQuery(task.expectedQuery, database);
      
      if (!expectedResult.success) {
        console.error('Expected query failed:', expectedResult.error);
        return {
          success: true,
          correct: false,
          result: userResult.result,
          error: 'Unable to validate result'
        };
      }

      // Compare results
      const isCorrect = compareResults(userResult.result, expectedResult.result);
      
      if (!isCorrect) {
        incrementAttempts(zone, level);
      }
      
      return {
        success: true,
        correct: isCorrect,
        result: userResult.result,
        error: null
      };

    } catch (error) {
      console.error('Query execution error:', error);
      incrementAttempts(zone, level);
      return {
        success: false,
        correct: false,
        result: null,
        error: error.message
      };
    }
  };

  // Get database schema for a zone
  const getZoneSchema = async (zone) => {
    try {
      const database = await initializeZoneDatabase(zone);
      return getDatabaseSchema(database);
    } catch (error) {
      console.error(`Failed to get schema for ${zone}:`, error);
      return {};
    }
  };

  // Get table data for a zone and table name
  const getTableData = async (zone, tableName, limit = 10) => {
    try {
      const database = await initializeZoneDatabase(zone);
      const query = `SELECT * FROM ${tableName} LIMIT ${limit}`;
      const result = executeUserQuery(query, database);
      if (result.success) {
        return result.result;
      }
      return [];
    } catch (error) {
      console.error(`Failed to get table data for ${tableName}:`, error);
      return [];
    }
  };

  // Get task data for a zone and level
  const getTask = (zone, level) => {
    return gameTasks[zone]?.[level - 1] || null;
  };

  // Reset game progress
  const resetGameProgress = () => {
    try {
      localStorage.removeItem('sqlSurvivalProgress');
      setGameState(getDefaultGameState());
      console.log('Game progress reset successfully');
    } catch (error) {
      console.error('Failed to reset game progress:', error);
    }
  };

  // Update settings
  const updateSettings = (newSettings) => {
    setGameState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...newSettings
      }
    }));
  };

  // Add item to inventory
  const addToInventory = (item) => {
    setGameState(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        items: [...prev.inventory.items, { ...item, id: Date.now() }]
      }
    }));
  };

  // Remove item from inventory
  const removeFromInventory = (itemId) => {
    setGameState(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        items: prev.inventory.items.filter(item => item.id !== itemId)
      }
    }));
  };

  // Update currency
  const updateCurrency = (amount) => {
    setGameState(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        currency: Math.max(0, prev.inventory.currency + amount)
      }
    }));
  };

  // Manual save function for testing
  const manualSave = () => {
    try {
      localStorage.setItem('sqlSurvivalProgress', JSON.stringify(gameState));
      console.log('Manual save completed:', {
        score: gameState.score,
        levelsCompleted: gameState.statistics.levelsCompleted,
        unlockedZones: gameState.unlockedZones
      });
      return true;
    } catch (error) {
      console.error('Manual save failed:', error);
      return false;
    }
  };

  // Check if a zone is completed
  const isZoneCompleted = (zone) => {
    const zoneProgress = gameState.progress[zone] || [];
    const completedLevels = zoneProgress.filter(level => level.status === 'completed').length;
    return completedLevels === zoneProgress.length;
  };

  // Get zone completion status
  const getZoneCompletionStatus = (zone) => {
    const zoneProgress = gameState.progress[zone] || [];
    const completedLevels = zoneProgress.filter(level => level.status === 'completed').length;
    return {
      isCompleted: completedLevels === zoneProgress.length,
      completedLevels,
      totalLevels: zoneProgress.length,
      completionRate: Math.round((completedLevels / zoneProgress.length) * 100)
    };
  };

  const value = {
    gameState,
    unlockNextLevel,
    skipLevel,
    executeQuery,
    getZoneSchema,
    getTableData,
    getTask,
    initializeZoneDatabase,
    isLoading,
    resetGameProgress,
    updateSettings,
    addToInventory,
    removeFromInventory,
    updateCurrency,
    manualSave,
    isZoneCompleted,
    getZoneCompletionStatus
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};