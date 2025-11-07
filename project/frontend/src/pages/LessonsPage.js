import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { ArrowLeft, ArrowRight, Play, CheckCircle, BookOpen, ChevronRight, Eye, EyeOff, FileText } from 'lucide-react';
import { lessons } from '../utils/lessonsData';
import { createZoneDatabase, executeUserQuery, compareResults } from '../utils/sqlEngine';
import QueryExplanation from '../components/QueryExplanation';

// Helper function to get initial lesson index from localStorage
const getInitialLessonIndex = () => {
  try {
    const lastLesson = localStorage.getItem('sqlSurvivalLastLesson');
    if (lastLesson !== null) {
      const lessonIndex = parseInt(lastLesson, 10);
      if (lessonIndex >= 0 && lessonIndex < lessons.length) {
        return lessonIndex;
      }
    }
  } catch (error) {
    console.error('Failed to load last lesson:', error);
  }
  return 0;
};

const LessonsPage = () => {
  const navigate = useNavigate();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(getInitialLessonIndex);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [database, setDatabase] = useState(null);
  const [completedTasks, setCompletedTasks] = useState({});
  const [completedLessons, setCompletedLessons] = useState({});
  const [shownAnswers, setShownAnswers] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  const currentLesson = lessons[currentLessonIndex];

  // Load lesson progress and current lesson from localStorage on mount
  useEffect(() => {
    try {
      // Load completed tasks
      const savedProgress = localStorage.getItem('sqlSurvivalLessonsProgress');
      if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress);
        // Only set if we have actual data
        if (Object.keys(parsedProgress).length > 0) {
          setCompletedTasks(parsedProgress);
          console.log('Loaded lesson progress from localStorage:', parsedProgress);
        }
        
        // Re-check and update completed lessons based on tasks
        const updatedCompletedLessons = {};
        lessons.forEach((lesson, lessonIndex) => {
          const allTasksCompleted = lesson.tasks.every(task => 
            parsedProgress[`${lessonIndex}-${task.id}`] === true
          );
          if (allTasksCompleted) {
            updatedCompletedLessons[lessonIndex] = true;
          }
        });
        
        // Update completed lessons if we found any changes
        const savedLessons = localStorage.getItem('sqlSurvivalLessonsCompleted');
        const parsedLessons = savedLessons ? JSON.parse(savedLessons) : {};
        const mergedLessons = { ...parsedLessons, ...updatedCompletedLessons };
        if (Object.keys(updatedCompletedLessons).length > 0) {
          localStorage.setItem('sqlSurvivalLessonsCompleted', JSON.stringify(mergedLessons));
        }
        setCompletedLessons(mergedLessons);
        console.log('Loaded completed lessons from localStorage:', mergedLessons);
      } else {
        // Load completed lessons even if no tasks are saved
        const savedLessons = localStorage.getItem('sqlSurvivalLessonsCompleted');
        if (savedLessons) {
          const parsedLessons = JSON.parse(savedLessons);
          if (Object.keys(parsedLessons).length > 0) {
            setCompletedLessons(parsedLessons);
            console.log('Loaded completed lessons from localStorage:', parsedLessons);
          }
        }
      }

      // Ensure we're on the correct lesson (double-check from localStorage)
      const lastLesson = localStorage.getItem('sqlSurvivalLastLesson');
      if (lastLesson !== null) {
        const lessonIndex = parseInt(lastLesson, 10);
        if (lessonIndex >= 0 && lessonIndex < lessons.length) {
          // Only update if different from current (to avoid unnecessary re-renders)
          if (lessonIndex !== currentLessonIndex) {
            setCurrentLessonIndex(lessonIndex);
            console.log('Resumed from lesson:', lessonIndex + 1);
          }
        }
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to load lesson progress:', error);
      setIsInitialized(true);
    }
  }, []); // Empty dependency array - only run on mount

  // Save lesson progress to localStorage whenever completedTasks changes (only after initialization)
  useEffect(() => {
    if (isInitialized && Object.keys(completedTasks).length > 0) {
      try {
        localStorage.setItem('sqlSurvivalLessonsProgress', JSON.stringify(completedTasks));
        console.log('Saved lesson progress to localStorage:', completedTasks);
      } catch (error) {
        console.error('Failed to save lesson progress:', error);
      }
    }
  }, [completedTasks, isInitialized]);

  // Save completed lessons to localStorage (only after initialization)
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('sqlSurvivalLessonsCompleted', JSON.stringify(completedLessons));
        console.log('Saved completed lessons to localStorage:', completedLessons);
      } catch (error) {
        console.error('Failed to save completed lessons:', error);
      }
    }
  }, [completedLessons, isInitialized]);

  // Save current lesson index to localStorage (only after initialization)
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('sqlSurvivalLastLesson', currentLessonIndex.toString());
        console.log('Saved current lesson to localStorage:', currentLessonIndex);
      } catch (error) {
        console.error('Failed to save current lesson:', error);
      }
    }
  }, [currentLessonIndex, isInitialized]);

  // Initialize database for practice
  useEffect(() => {
    const initDatabase = async () => {
      try {
        // Use the lessons database for all lessons (generic business tables)
        const db = await createZoneDatabase('lessons');
        setDatabase(db);
      } catch (error) {
        console.error('Failed to initialize database:', error);
        setError('Failed to initialize database. Please refresh the page.');
      }
    };
    initDatabase();
  }, [currentLessonIndex]);

  // Reset query when lesson changes
  useEffect(() => {
    setQuery('');
    setResult(null);
    setError('');
    setSuccessMessage('');
    // Reset shown answers for new lesson
    setShownAnswers(prev => {
      const newShown = { ...prev };
      Object.keys(newShown).forEach(key => {
        if (key.startsWith(`${currentLessonIndex}-`)) {
          delete newShown[key];
        }
      });
      return newShown;
    });
  }, [currentLessonIndex]);

  const handleExecuteQuery = async () => {
    if (!query.trim()) {
      setError('Please enter a SQL query');
      return;
    }

    if (!database) {
      setError('Database not initialized. Please wait...');
      return;
    }

    setIsExecuting(true);
    setError('');
    setResult(null);

    try {
      const queryResult = executeUserQuery(query, database);
      
      if (queryResult.success) {
        setResult(queryResult.result);
        setError(null);
        
        // Check each task to see if the query matches the expected result
        let taskCompleted = false;
        const savedProgress = JSON.parse(localStorage.getItem('sqlSurvivalLessonsProgress') || '{}');
        
        currentLesson.tasks.forEach(task => {
          if (task.expectedQuery) {
            // Check if task is already completed (from state or localStorage)
            const isAlreadyCompleted = completedTasks[`${currentLessonIndex}-${task.id}`] || 
                                       savedProgress[`${currentLessonIndex}-${task.id}`];
            
            if (!isAlreadyCompleted) {
              // Execute the expected query to get the expected result
              const expectedQueryResult = executeUserQuery(task.expectedQuery, database);
              
              if (expectedQueryResult.success) {
                // Compare the user's result with the expected result
                const isCorrect = compareResults(queryResult.result, expectedQueryResult.result);
                
                if (isCorrect) {
                  markTaskComplete(task.id);
                  taskCompleted = true;
                  setSuccessMessage(`✓ Task ${task.id} completed! Great job!`);
                  setError(null);
                  
                  // Check if all tasks in current lesson are completed (with delay for state update)
                  setTimeout(() => {
                    checkLessonCompletion();
                  }, 100);
                  
                  // Clear success message after 3 seconds
                  setTimeout(() => setSuccessMessage(''), 3000);
                }
              }
            }
          }
        });
        
        // If query executed but didn't match any task, clear any previous success message
        if (!taskCompleted && successMessage) {
          setSuccessMessage('');
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

  const handleNextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      const nextIndex = currentLessonIndex + 1;
      setCurrentLessonIndex(nextIndex);
    } else {
      // Last lesson completed, go to map
      navigate('/map');
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const markTaskComplete = (taskId) => {
    setCompletedTasks(prev => {
      const newCompleted = {
        ...prev,
        [`${currentLessonIndex}-${taskId}`]: true
      };
      return newCompleted;
    });
  };

  const toggleShowAnswer = (taskId) => {
    const key = `${currentLessonIndex}-${taskId}`;
    setShownAnswers(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getTaskAnswer = (task) => {
    return task.expectedQuery || null;
  };

  // Calculate lesson completion progress
  const getLessonProgress = (lessonIndex) => {
    const lesson = lessons[lessonIndex];
    const completedCount = lesson.tasks.filter(task => 
      completedTasks[`${lessonIndex}-${task.id}`]
    ).length;
    return {
      completed: completedCount,
      total: lesson.tasks.length,
      percentage: Math.round((completedCount / lesson.tasks.length) * 100)
    };
  };

  // Get overall progress across all lessons
  const getOverallProgress = () => {
    let totalCompleted = 0;
    let totalTasks = 0;
    lessons.forEach((lesson, index) => {
      totalTasks += lesson.tasks.length;
      totalCompleted += lesson.tasks.filter(task => 
        completedTasks[`${index}-${task.id}`]
      ).length;
    });
    return {
      completed: totalCompleted,
      total: totalTasks,
      percentage: totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0
    };
  };

  // Check if current lesson is completed
  const checkLessonCompletion = () => {
    // Use a longer delay to ensure state is fully updated
    setTimeout(() => {
      const lesson = lessons[currentLessonIndex];
      const updatedCompletedTasks = JSON.parse(localStorage.getItem('sqlSurvivalLessonsProgress') || '{}');
      const reallyAllCompleted = lesson.tasks.every(task => 
        updatedCompletedTasks[`${currentLessonIndex}-${task.id}`] === true
      );

      if (reallyAllCompleted) {
        // Check if lesson is already marked as completed
        const savedLessons = JSON.parse(localStorage.getItem('sqlSurvivalLessonsCompleted') || '{}');
        if (!savedLessons[currentLessonIndex]) {
          // Mark lesson as completed
          const newCompletedLessons = {
            ...savedLessons,
            [currentLessonIndex]: true
          };
          localStorage.setItem('sqlSurvivalLessonsCompleted', JSON.stringify(newCompletedLessons));
          setCompletedLessons(newCompletedLessons);

          // Unlock next lesson if available
          if (currentLessonIndex < lessons.length - 1) {
            const nextLessonIndex = currentLessonIndex + 1;
            setSuccessMessage(`🎉 Lesson ${currentLessonIndex + 1} completed! Lesson ${nextLessonIndex + 1} unlocked!`);
            
            // Auto-advance to next lesson after 2 seconds
            setTimeout(() => {
              setCurrentLessonIndex(nextLessonIndex);
              setSuccessMessage('');
            }, 2000);
          } else {
            setSuccessMessage('🎉 Congratulations! You have completed all lessons!');
          }
        }
      }
    }, 200);
  };

  // Reset all lesson progress
  const resetLessonProgress = () => {
    if (window.confirm('Are you sure you want to reset all lesson progress? This cannot be undone.')) {
      localStorage.removeItem('sqlSurvivalLessonsProgress');
      localStorage.removeItem('sqlSurvivalLessonsCompleted');
      localStorage.removeItem('sqlSurvivalLastLesson');
      setCompletedTasks({});
      setCompletedLessons({});
      setCurrentLessonIndex(0);
      alert('Lesson progress has been reset!');
    }
  };

  // All lessons are unlocked - users can access any lesson at any time
  const isLessonUnlocked = (lessonIndex) => {
    return true;
  };

  const renderTable = (tableData, tableName) => {
    if (!tableData || tableData.length === 0) return null;

    const columns = Object.keys(tableData[0]);

    return (
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">Table: {tableName}</h4>
        <div className="overflow-x-auto border border-gray-700 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-800 border-b border-gray-700">
                {columns.map(col => (
                  <th key={col} className="px-4 py-2 text-left text-gray-300 font-semibold">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.slice(0, 5).map((row, idx) => (
                <tr key={idx} className="border-b border-gray-700/50 hover:bg-gray-800/50">
                  {columns.map(col => (
                    <td key={col} className="px-4 py-2 text-gray-300">
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {tableData.length > 5 && (
            <div className="px-4 py-2 text-xs text-gray-500 text-center bg-gray-800">
              ... and {tableData.length - 5} more rows
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-700/50 bg-gray-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button
                onClick={() => navigate('/reference')}
                variant="outline"
                size="sm"
                className="border-blue-600 text-blue-400 hover:bg-blue-600/10"
              >
                <FileText className="w-4 h-4 mr-2" />
                Reference
              </Button>
              <div>
                <h1 className="text-xl font-bold text-blue-400" style={{ fontFamily: '"Press Start 2P", monospace' }}>
                  SQL LESSONS
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-sm text-gray-400">Lesson {currentLessonIndex + 1} of {lessons.length}</p>
                  {(() => {
                    const overall = getOverallProgress();
                    return (
                      <div className="text-xs text-gray-500">
                        Overall: {overall.completed}/{overall.total} tasks ({overall.percentage}%)
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={resetLessonProgress}
                variant="outline"
                size="sm"
                className="border-red-600 text-red-400 hover:bg-red-600/10"
                title="Reset all lesson progress"
              >
                Reset Progress
              </Button>
              <Button
                onClick={() => navigate('/map')}
                variant="outline"
                className="border-green-600 text-green-400 hover:bg-green-600/10"
              >
                Skip to Game
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Theory and Tasks */}
          <div className="lg:col-span-5 space-y-6">
            {/* Lesson Title */}
            <Card className="bg-gray-800/80 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-2xl text-blue-400">
                    {currentLesson.title}
                  </CardTitle>
                  {(() => {
                    const progress = getLessonProgress(currentLessonIndex);
                    return (
                      <div className="text-sm text-gray-400">
                        {progress.completed}/{progress.total} tasks
                      </div>
                    );
                  })()}
                </div>
                <p className="text-gray-400 mt-2">{currentLesson.description}</p>
                {(() => {
                  const progress = getLessonProgress(currentLessonIndex);
                  return (
                    <div className="mt-3">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress.percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{progress.percentage}% completed</p>
                    </div>
                  );
                })()}
              </CardHeader>
            </Card>

            {/* Theory Section */}
            <Card className="bg-gray-800/80 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-gray-300 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Theory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  {currentLesson.theory.map((paragraph, idx) => (
                    <p key={idx} dangerouslySetInnerHTML={{ 
                      __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-400">$1</strong>')
                        .replace(/`(.*?)`/g, '<code class="bg-gray-700 px-1 py-0.5 rounded text-blue-300">$1</code>')
                    }} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Example Query */}
            <Card className="bg-gray-800/80 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-gray-300">Example Query</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap overflow-x-auto">
                    {currentLesson.example}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Tasks */}
            <Card className="bg-gray-800/80 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-gray-300">Practice Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentLesson.tasks.map((task) => {
                    const isCompleted = completedTasks[`${currentLessonIndex}-${task.id}`];
                    const isAnswerShown = shownAnswers[`${currentLessonIndex}-${task.id}`];
                    const answer = getTaskAnswer(task);
                    
                    return (
                      <div
                        key={task.id}
                        className={`p-3 rounded-lg border ${
                          isCompleted
                            ? 'bg-green-900/20 border-green-600/50'
                            : 'bg-gray-900/50 border-gray-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-sm font-semibold text-gray-300">
                                {task.id}. {task.description}
                              </span>
                              {isCompleted && (
                                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                              )}
                              {answer && (
                                <button
                                  onClick={() => toggleShowAnswer(task.id)}
                                  className="ml-auto flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                  title={isAnswerShown ? "Hide answer" : "Show answer"}
                                >
                                  {isAnswerShown ? (
                                    <>
                                      <EyeOff className="w-3 h-3" />
                                      Hide Answer
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="w-3 h-3" />
                                      Show Answer
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                            {isAnswerShown && answer && (
                              <div className="mt-2 p-2 bg-gray-800 rounded border border-blue-600/50">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-xs text-gray-400">Answer:</p>
                                  <button
                                    onClick={() => {
                                      setQuery(answer);
                                      setResult(null);
                                      setError('');
                                      setSuccessMessage('');
                                    }}
                                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                    title="Copy to editor"
                                  >
                                    Copy to Editor
                                  </button>
                                </div>
                                <code className="text-xs text-green-400 font-mono whitespace-pre-wrap break-all">
                                  {answer}
                                </code>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex gap-2">
              <Button
                onClick={handlePrevLesson}
                disabled={currentLessonIndex === 0}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button
                onClick={handleNextLesson}
                disabled={false}
                variant="outline"
                className="flex-1 border-blue-600 text-blue-400 hover:bg-blue-600/10"
              >
                {currentLessonIndex === lessons.length - 1 ? (
                  <>
                    Start Adventure
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Next Lesson
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right Side - Practice Area */}
          <div className="lg:col-span-7 space-y-6">
            {/* Table Display */}
            <Card className="bg-gray-800/80 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-gray-300">Practice Data</CardTitle>
              </CardHeader>
              <CardContent>
                {renderTable(currentLesson.practiceData.sampleData, currentLesson.practiceData.tableName)}
                {currentLesson.practiceData.relatedTable && 
                  renderTable(currentLesson.practiceData.relatedTable.sampleData, currentLesson.practiceData.relatedTable.name)
                }
              </CardContent>
            </Card>

            {/* SQL Editor */}
            <Card className="bg-gray-800/80 border-gray-700 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg text-gray-300">SQL Editor</CardTitle>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setQuery('');
                      setResult(null);
                      setError('');
                      setSuccessMessage('');
                    }}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={handleExecuteQuery}
                    disabled={isExecuting}
                    className="bg-blue-600 hover:bg-blue-500 text-white"
                  >
                    {isExecuting ? (
                      <>Running...</>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Execute Query
                      </>
                    )}
                  </Button>
                </div>
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
                <p className="text-xs text-gray-500 mt-2">Press Ctrl+Enter to execute • Click Reset to clear</p>
              </CardContent>
            </Card>

            {/* Results */}
            <Card className="bg-gray-800/80 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-gray-300">Results</CardTitle>
              </CardHeader>
              <CardContent>
                {successMessage && (
                  <div className="p-4 bg-green-900/20 border border-green-600/50 rounded mb-4">
                    <p className="text-green-300 text-sm font-semibold">{successMessage}</p>
                  </div>
                )}
                {error ? (
                  <div className="p-4 bg-red-900/20 border border-red-600/50 rounded">
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                ) : result ? (
                  <div className="space-y-4">
                    {result.length === 0 ? (
                      <p className="text-gray-400 text-sm">No results returned</p>
                    ) : (
                      <div className="overflow-x-auto border border-gray-700 rounded-lg">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-800 border-b border-gray-700">
                              {Object.keys(result[0]).map(key => (
                                <th key={key} className="px-4 py-2 text-left text-gray-300 font-semibold">
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {result.slice(0, 10).map((row, index) => (
                              <tr key={index} className="border-b border-gray-700/50 hover:bg-gray-800/50">
                                {Object.values(row).map((value, cellIndex) => (
                                  <td key={cellIndex} className="px-4 py-2 text-gray-300">
                                    {value}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {result.length > 10 && (
                          <div className="px-4 py-2 text-xs text-gray-500 text-center bg-gray-800">
                            Showing 10 of {result.length} rows
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <Play className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Enter a query and press Execute to see results</p>
                  </div>
                )}
                
                {/* Query Explanation */}
                {query && query.trim() && (
                  <QueryExplanation query={query} showOptimization={true} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Lesson Progress Indicator */}
        <div className="mt-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-4 text-center">
              <h3 className="text-sm text-gray-400 mb-2">Lesson Progress</h3>
              {(() => {
                const overall = getOverallProgress();
                return (
                  <div className="text-lg font-semibold text-blue-400">
                    {overall.completed} / {overall.total} tasks completed ({overall.percentage}%)
                  </div>
                );
              })()}
            </div>
            <div className="flex justify-center gap-2 flex-wrap">
              {lessons.map((lesson, index) => {
                const progress = getLessonProgress(index);
                const isCurrent = index === currentLessonIndex;
                const isCompleted = completedLessons[index] === true;
                const isUnlocked = isLessonUnlocked(index);
                const hasProgress = progress.completed > 0;
                
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentLessonIndex(index);
                    }}
                    className={`relative transition-all ${
                      isCurrent
                        ? 'w-12 h-12'
                        : 'w-10 h-10'
                    } rounded-lg flex flex-col items-center justify-center ${
                      isCurrent
                        ? 'bg-blue-600 border-2 border-blue-400'
                        : isCompleted
                        ? 'bg-green-600 border-2 border-green-400'
                        : hasProgress
                        ? 'bg-yellow-600 border-2 border-yellow-400'
                        : 'bg-gray-700 border-2 border-gray-600'
                    } hover:scale-110 cursor-pointer`}
                    title={`Lesson ${index + 1}: ${progress.completed}/${progress.total} tasks`}
                  >
                    <span className="text-xs font-bold text-white">{index + 1}</span>
                    {isCompleted && (
                      <CheckCircle className="w-3 h-3 text-white absolute -top-1 -right-1" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex justify-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-600"></div>
                <span>Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-600"></div>
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-600"></div>
                <span>In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gray-700"></div>
                <span>Not Started</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonsPage;

