import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { ArrowLeft, ArrowRight, Play, CheckCircle, BookOpen, ChevronRight, Eye, EyeOff, FileText, Database, Code, Target, Clock, AlertCircle } from 'lucide-react';
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
  const [executionTime, setExecutionTime] = useState(null);
  const [expandedTasks, setExpandedTasks] = useState({});
  const [rowCount, setRowCount] = useState(null);
  const [executionTimestamp, setExecutionTimestamp] = useState(null);

  const currentLesson = lessons[currentLessonIndex];

  // Load lesson progress and current lesson from localStorage on mount
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('sqlSurvivalLessonsProgress');
      if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress);
        if (Object.keys(parsedProgress).length > 0) {
          setCompletedTasks(parsedProgress);
        }
        
        const updatedCompletedLessons = {};
        lessons.forEach((lesson, lessonIndex) => {
          const allTasksCompleted = lesson.tasks.every(task => 
            parsedProgress[`${lessonIndex}-${task.id}`] === true
          );
          if (allTasksCompleted) {
            updatedCompletedLessons[lessonIndex] = true;
          }
        });
        
        const savedLessons = localStorage.getItem('sqlSurvivalLessonsCompleted');
        const parsedLessons = savedLessons ? JSON.parse(savedLessons) : {};
        const mergedLessons = { ...parsedLessons, ...updatedCompletedLessons };
        if (Object.keys(updatedCompletedLessons).length > 0) {
          localStorage.setItem('sqlSurvivalLessonsCompleted', JSON.stringify(mergedLessons));
        }
        setCompletedLessons(mergedLessons);
      } else {
        const savedLessons = localStorage.getItem('sqlSurvivalLessonsCompleted');
        if (savedLessons) {
          const parsedLessons = JSON.parse(savedLessons);
          if (Object.keys(parsedLessons).length > 0) {
            setCompletedLessons(parsedLessons);
          }
        }
      }

      const lastLesson = localStorage.getItem('sqlSurvivalLastLesson');
      if (lastLesson !== null) {
        const lessonIndex = parseInt(lastLesson, 10);
        if (lessonIndex >= 0 && lessonIndex < lessons.length) {
          if (lessonIndex !== currentLessonIndex) {
            setCurrentLessonIndex(lessonIndex);
          }
        }
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to load lesson progress:', error);
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized && Object.keys(completedTasks).length > 0) {
      try {
        localStorage.setItem('sqlSurvivalLessonsProgress', JSON.stringify(completedTasks));
      } catch (error) {
        console.error('Failed to save lesson progress:', error);
      }
    }
  }, [completedTasks, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('sqlSurvivalLessonsCompleted', JSON.stringify(completedLessons));
      } catch (error) {
        console.error('Failed to save completed lessons:', error);
      }
    }
  }, [completedLessons, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('sqlSurvivalLastLesson', currentLessonIndex.toString());
      } catch (error) {
        console.error('Failed to save current lesson:', error);
      }
    }
  }, [currentLessonIndex, isInitialized]);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        const db = await createZoneDatabase('lessons');
        setDatabase(db);
      } catch (error) {
        console.error('Failed to initialize database:', error);
        setError('Failed to initialize database. Please refresh the page.');
      }
    };
    initDatabase();
  }, [currentLessonIndex]);

  useEffect(() => {
    setQuery('');
    setResult(null);
    setError('');
    setSuccessMessage('');
    setExecutionTime(null);
    setRowCount(null);
    setExecutionTimestamp(null);
    setExpandedTasks({});
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
    setExecutionTime(null);
    setRowCount(null);
    setExecutionTimestamp(null);
    
    const startTime = performance.now();
    const timestamp = new Date();

    try {
      const queryResult = executeUserQuery(query, database);
      const endTime = performance.now();
      const executionTimeMs = (endTime - startTime).toFixed(2);
      setExecutionTime(executionTimeMs);
      setExecutionTimestamp(timestamp);
      
      if (queryResult.success) {
        const rows = queryResult.result.length;
        setRowCount(rows);
        setResult(queryResult.result);
        setError(null);
        
        let taskCompleted = false;
        const savedProgress = JSON.parse(localStorage.getItem('sqlSurvivalLessonsProgress') || '{}');
        
        // Normalize user query for comparison
        const normalizeQuery = (q) => {
          return q.trim().toLowerCase().replace(/\s+/g, ' ').replace(/;+$/, '').trim();
        };
        const userQueryNormalized = normalizeQuery(query);
        
        // First pass: Check for exact query matches (prioritize exact matches)
        let exactMatchTask = null;
        for (const task of currentLesson.tasks) {
          if (task.expectedQuery) {
            const isAlreadyCompleted = completedTasks[`${currentLessonIndex}-${task.id}`] || 
                                       savedProgress[`${currentLessonIndex}-${task.id}`];
            
            if (!isAlreadyCompleted) {
              const expectedQueryNormalized = normalizeQuery(task.expectedQuery);
              if (userQueryNormalized === expectedQueryNormalized) {
                exactMatchTask = task;
                break; // Found exact match, stop searching
              }
            }
          }
        }
        
        // If exact match found, mark it and return
        if (exactMatchTask) {
          markTaskComplete(exactMatchTask.id);
          taskCompleted = true;
          setSuccessMessage(`✓ Task ${exactMatchTask.id} completed! Great job!`);
          setError(null);
          setTimeout(() => {
            checkLessonCompletion();
          }, 100);
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          // Second pass: Check result matches (only if no exact query match found)
          // Check tasks in order and stop after first match to avoid marking multiple tasks
          for (const task of currentLesson.tasks) {
            if (task.expectedQuery) {
              const isAlreadyCompleted = completedTasks[`${currentLessonIndex}-${task.id}`] || 
                                         savedProgress[`${currentLessonIndex}-${task.id}`];
              
              if (!isAlreadyCompleted) {
                const expectedQueryResult = executeUserQuery(task.expectedQuery, database);
                
                if (expectedQueryResult.success) {
                  const isCorrect = compareResults(queryResult.result, expectedQueryResult.result);
                  
                  if (isCorrect) {
                    markTaskComplete(task.id);
                    taskCompleted = true;
                    setSuccessMessage(`✓ Task ${task.id} completed! Great job!`);
                    setError(null);
                    
                    setTimeout(() => {
                      checkLessonCompletion();
                    }, 100);
                    
                    setTimeout(() => setSuccessMessage(''), 3000);
                    
                    // Stop after first match to avoid marking multiple tasks
                    break;
                  }
                }
              }
            }
          }
        }
        
        if (!taskCompleted && successMessage) {
          setSuccessMessage('');
        }
      } else {
          const errorMsg = queryResult.error || 'Query execution failed';
          setError(errorMsg);
        }
      } catch (err) {
        const errorMsg = 'Query execution failed: ' + err.message;
        setError(errorMsg);
        const endTime = performance.now();
        const executionTimeMs = (endTime - startTime).toFixed(2);
        setExecutionTime(executionTimeMs);
        setExecutionTimestamp(timestamp);
      } finally {
        setIsExecuting(false);
      }
    };

  const handleNextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else {
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
    setExpandedTasks(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getTaskAnswer = (task) => {
    return task.expectedQuery || null;
  };

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

  const checkLessonCompletion = () => {
    setTimeout(() => {
      const lesson = lessons[currentLessonIndex];
      const updatedCompletedTasks = JSON.parse(localStorage.getItem('sqlSurvivalLessonsProgress') || '{}');
      const reallyAllCompleted = lesson.tasks.every(task => 
        updatedCompletedTasks[`${currentLessonIndex}-${task.id}`] === true
      );

      if (reallyAllCompleted) {
        const savedLessons = JSON.parse(localStorage.getItem('sqlSurvivalLessonsCompleted') || '{}');
        if (!savedLessons[currentLessonIndex]) {
          const newCompletedLessons = {
            ...savedLessons,
            [currentLessonIndex]: true
          };
          localStorage.setItem('sqlSurvivalLessonsCompleted', JSON.stringify(newCompletedLessons));
          setCompletedLessons(newCompletedLessons);

          if (currentLessonIndex < lessons.length - 1) {
            const nextLessonIndex = currentLessonIndex + 1;
            setSuccessMessage(`🎉 Lesson ${currentLessonIndex + 1} completed!`);
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

  const formatTheoryText = (text) => {
    if (!text) return '';
    
    // Split into blocks (double newlines)
    const blocks = text.split(/\n\n+/).filter(block => block.trim());
    
    return blocks.map(block => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      
      // Section headers (## Header)
      if (trimmed.match(/^##\s+/)) {
        const content = trimmed.replace(/^##\s+/, '');
        return `<h3 class="text-blue-400 font-bold text-base mt-6 mb-3 pt-4 border-t border-gray-700/50 first:mt-0 first:pt-0 first:border-t-0">${content}</h3>`;
      }
      
      // Subsection headers (### Subheader)
      if (trimmed.match(/^###\s+/)) {
        const content = trimmed.replace(/^###\s+/, '');
        return `<h4 class="text-cyan-400 font-semibold text-sm mt-4 mb-2">${content}</h4>`;
      }
      
      // Separators (---)
      if (trimmed === '---') {
        return '<hr class="my-4 border-gray-700/50" />';
      }
      
      // Callout boxes (💡 Tip:, ⚠️ Note:, 🧩 Example:)
      if (trimmed.match(/^💡\s+Tip:/)) {
        const content = trimmed.replace(/^💡\s+Tip:\s*/, '');
        const formatted = formatInline(content);
        return `<div class="bg-blue-900/20 border-l-4 border-blue-500 p-3 rounded-r my-3"><div class="text-blue-400 font-semibold text-sm mb-2">💡 Tip</div><div class="text-gray-300 text-sm">${formatted}</div></div>`;
      }
      if (trimmed.match(/^⚠️\s+Note:/)) {
        const content = trimmed.replace(/^⚠️\s+Note:\s*/, '');
        const formatted = formatInline(content);
        return `<div class="bg-yellow-900/20 border-l-4 border-yellow-500 p-3 rounded-r my-3"><div class="text-yellow-400 font-semibold text-sm mb-2">⚠️ Note</div><div class="text-gray-300 text-sm">${formatted}</div></div>`;
      }
      if (trimmed.match(/^🧩\s+Example:/)) {
        const content = trimmed.replace(/^🧩\s+Example:\s*/, '');
        const formatted = formatInline(content);
        return `<div class="bg-green-900/20 border-l-4 border-green-500 p-3 rounded-r my-3"><div class="text-green-400 font-semibold text-sm mb-2">🧩 Example</div><div class="text-gray-300 text-sm">${formatted}</div></div>`;
      }
      
      // Bullet lists
      if (trimmed.match(/^[-\•]\s+/)) {
        const items = trimmed.split('\n').filter(line => line.trim().match(/^[-\•]\s+/));
        const listItems = items.map(item => {
          const content = item.replace(/^[-\•]\s+/, '').trim();
          const formatted = formatInline(content);
          return `<li class="mb-1.5 text-gray-300">${formatted}</li>`;
        }).join('');
        return `<ul class="list-disc list-inside my-2 space-y-1 ml-2">${listItems}</ul>`;
      }
      
      // Regular paragraph
      const formatted = formatInline(trimmed);
      return `<p class="mb-3 text-gray-300 leading-relaxed">${formatted}</p>`;
    }).join('');
  };
  
  const formatInline = (text) => {
    if (!text) return '';
    let formatted = text;
    // Bold text (**text**)
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-400 font-semibold">$1</strong>');
    // Inline code (`code`)
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-gray-700/80 px-1.5 py-0.5 rounded text-blue-300 font-mono text-xs">$1</code>');
    return formatted;
  };

  const renderCompactTable = (tableData, tableName) => {
    if (!tableData || tableData.length === 0) return null;

    const columns = Object.keys(tableData[0]);
    const displayData = tableData.slice(0, 6);

    return (
      <div className="w-full">
        <div className="text-xs font-semibold text-gray-400 mb-2">{tableName}</div>
        <div className="overflow-x-auto border border-gray-700 rounded-lg max-h-64 overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-gray-800 z-10">
              <tr className="border-b border-gray-700">
                {columns.map(col => (
                  <th key={col} className="px-2 py-1.5 text-left text-gray-300 font-semibold whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayData.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-700/50 hover:bg-gray-800/50">
                  {columns.map(col => (
                    <td key={col} className="px-2 py-1.5 text-gray-300 font-mono whitespace-nowrap">
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {tableData.length > 6 && (
            <div className="px-2 py-1 text-xs text-gray-500 text-center bg-gray-800/50">
              +{tableData.length - 6} more rows
            </div>
          )}
        </div>
      </div>
    );
  };

  const progress = getLessonProgress(currentLessonIndex);
  const overall = getOverallProgress();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Compact Header */}
      <header className="border-b border-gray-700/50 bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50 shadow-md">
        <div className="w-full max-w-[1400px] mx-auto px-2 md:px-4 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 h-8"
              >
                <ArrowLeft className="w-3 h-3 mr-1" />
                Home
              </Button>
              <Button
                onClick={() => navigate('/reference')}
                variant="outline"
                size="sm"
                className="border-blue-600 text-blue-400 hover:bg-blue-600/10 h-8"
              >
                <FileText className="w-3 h-3 mr-1" />
                Reference
              </Button>
              <div>
                <h1 className="text-lg font-bold text-blue-400">SQL LESSONS</h1>
                <div className="text-xs text-gray-400">
                  Lesson {currentLessonIndex + 1}/{lessons.length} • {overall.completed}/{overall.total} tasks
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={resetLessonProgress}
                variant="outline"
                size="sm"
                className="border-red-600 text-red-400 hover:bg-red-600/10 h-8 text-xs"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - 2 Column Grid */}
      <div className="w-full max-w-[1400px] mx-auto px-2 md:px-4 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-6">
          
          {/* LEFT COLUMN (60%) */}
          <div className="space-y-4 scroll-smooth">
            
            {/* Theory Section */}
            <Card className="bg-gray-800/90 border-gray-700 shadow-lg rounded-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-gray-200 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    {currentLesson.title}
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">Lesson {currentLessonIndex + 1}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-blue-400">
                        {progress.completed}/{progress.total}
                      </span>
                      <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-2">{currentLesson.description}</p>
              </CardHeader>
              <CardContent>
                <div 
                  className="text-gray-300 text-sm leading-relaxed max-h-96 overflow-y-auto pr-2 scroll-smooth"
                  style={{ scrollSnapType: 'y proximity' }}
                >
                  <div 
                    className="scroll-snap-align-start"
                    dangerouslySetInnerHTML={{ __html: formatTheoryText(typeof currentLesson.theory === 'string' ? currentLesson.theory : currentLesson.theory.join('\n\n')) }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Example Query Box */}
            <Card className="bg-gray-800/90 border-gray-700 shadow-lg rounded-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-gray-200 flex items-center gap-2">
                  <Code className="w-4 h-4 text-green-400" />
                  Example Query
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900/80 rounded-lg p-4 border border-gray-700/50">
                  <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap overflow-x-auto max-h-48 overflow-y-auto">
                    {currentLesson.example}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Practice Tasks - 2 per row on large screens */}
            <Card className="bg-gray-800/90 border-gray-700 shadow-lg rounded-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-gray-200 flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-400" />
                  Practice Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {currentLesson.tasks.map((task) => {
                    const isCompleted = completedTasks[`${currentLessonIndex}-${task.id}`];
                    const isAnswerShown = shownAnswers[`${currentLessonIndex}-${task.id}`];
                    const isExpanded = expandedTasks[`${currentLessonIndex}-${task.id}`];
                    const answer = getTaskAnswer(task);
                    
                    return (
                      <div
                        key={task.id}
                        className={`p-3 rounded-lg border transition-all duration-300 ${
                          isCompleted
                            ? 'bg-green-900/20 border-green-600/50'
                            : 'bg-gray-900/50 border-gray-700'
                        } ${isExpanded ? 'shadow-md' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-xs font-bold text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded">
                              {task.id}
                            </span>
                            <span className="text-sm text-gray-300 flex-1">
                              {task.description}
                            </span>
                            {isCompleted && (
                              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                        
                        {answer && (
                          <button
                            onClick={() => toggleShowAnswer(task.id)}
                            className="w-full flex items-center justify-between text-xs text-blue-400 hover:text-blue-300 transition-colors mb-2"
                          >
                            <span>{isAnswerShown ? 'Hide Answer' : 'Show Answer'}</span>
                            {isAnswerShown ? (
                              <EyeOff className="w-3 h-3" />
                            ) : (
                              <Eye className="w-3 h-3" />
                            )}
                          </button>
                        )}
                        
                        <div 
                          className={`overflow-hidden transition-all duration-300 ${
                            isAnswerShown ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          {isAnswerShown && answer && (
                            <div className="mt-2 p-2 bg-gray-800/80 rounded border border-blue-600/50">
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
                                >
                                  Copy to Editor
                                </button>
                              </div>
                              <code className="text-xs text-green-400 font-mono whitespace-pre-wrap break-all block">
                                {answer}
                              </code>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN (40%) */}
          <div className="space-y-4">
            
            {/* Practice Data Table - Compact Scrollable */}
            <Card className="bg-gray-800/90 border-gray-700 shadow-lg rounded-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-gray-200 flex items-center gap-2">
                  <Database className="w-4 h-4 text-yellow-400" />
                  Practice Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {renderCompactTable(currentLesson.practiceData.sampleData, currentLesson.practiceData.tableName)}
                {currentLesson.practiceData.relatedTable && 
                  renderCompactTable(
                    currentLesson.practiceData.relatedTable.sampleData, 
                    currentLesson.practiceData.relatedTable.name
                  )
                }
              </CardContent>
            </Card>

            {/* SQL Editor - Compact */}
            <Card className="bg-gray-800/90 border-gray-700 shadow-lg rounded-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-gray-200 flex items-center gap-2">
                    <Code className="w-4 h-4 text-green-400" />
                    SQL Editor
                  </CardTitle>
                  <Button
                    onClick={handleExecuteQuery}
                    disabled={isExecuting}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-500 text-white h-8 text-xs"
                  >
                    {isExecuting ? (
                      <>Running...</>
                    ) : (
                      <>
                        <Play className="w-3 h-3 mr-1" />
                        Execute
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
SELECT * FROM employees;"
                  className="h-32 font-mono bg-gray-900/80 border-gray-600 text-green-400 resize-none text-sm"
                  onKeyDown={(e) => {
                    if (e.ctrlKey && e.key === 'Enter') {
                      e.preventDefault();
                      handleExecuteQuery();
                    }
                  }}
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">Ctrl+Enter to execute</p>
                  <Button
                    onClick={() => {
                      setQuery('');
                      setResult(null);
                      setError('');
                      setSuccessMessage('');
                      setExecutionTime(null);
                    }}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 h-6 text-xs"
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results Box - Compact */}
            <Card className="bg-gray-800/90 border-gray-700 shadow-lg rounded-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-gray-200">Results</CardTitle>
              </CardHeader>
              <CardContent>
                {successMessage && (
                  <div className="p-3 bg-green-900/20 border border-green-600/50 rounded mb-3">
                    <p className="text-green-300 text-xs font-semibold">{successMessage}</p>
                  </div>
                )}
                {error ? (
                  <div className="space-y-2">
                    <div className="p-3 bg-red-900/20 border border-red-600/50 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <p className="text-red-300 text-xs font-semibold">Error</p>
                      </div>
                      <p className="text-red-300 text-xs">{error}</p>
                    </div>
                    {executionTime && executionTimestamp && (
                      <div className="flex items-center gap-2 text-xs text-red-400">
                        <Clock className="w-3 h-3" />
                        <span>Failed in {executionTime}ms • {executionTimestamp.toLocaleTimeString()}</span>
                      </div>
                    )}
                  </div>
                ) : result ? (
                  <div className="space-y-3">
                    {result.length === 0 ? (
                      <p className="text-gray-400 text-xs text-center py-4">No results returned</p>
                    ) : (
                      <div className="overflow-x-auto border border-gray-700 rounded-lg max-h-64 overflow-y-auto">
                        <table className="w-full text-xs">
                          <thead className="sticky top-0 bg-gray-800 z-10">
                            <tr className="border-b border-gray-700">
                              {Object.keys(result[0]).map(key => (
                                <th key={key} className="px-2 py-1.5 text-left text-gray-300 font-semibold whitespace-nowrap">
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {result.slice(0, 10).map((row, index) => (
                              <tr key={index} className="border-b border-gray-700/50 hover:bg-gray-800/50">
                                {Object.values(row).map((value, cellIndex) => (
                                  <td key={cellIndex} className="px-2 py-1.5 text-gray-300 font-mono whitespace-nowrap">
                                    {value}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {result.length > 10 && (
                          <div className="px-2 py-1 text-xs text-gray-500 text-center bg-gray-800/50">
                            Showing 10 of {result.length} rows
                          </div>
                        )}
                      </div>
                    )}
                    {executionTime && rowCount !== null && executionTimestamp && (
                      <div className="flex items-center gap-2 text-xs text-gray-400 pt-2 border-t border-gray-700/30">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Executed in {executionTime}ms</span>
                        </div>
                        <span>•</span>
                        <span>{rowCount} rows</span>
                        <span>•</span>
                        <span>{executionTimestamp.toLocaleTimeString()}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <Play className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Run query to see results</p>
                  </div>
                )}
                
                {/* Query Explanation */}
                {query && query.trim() && result && (
                  <div className="mt-4">
                    <QueryExplanation query={query} showOptimization={true} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Lesson Progress Component - Bottom Center */}
      <div className="w-full max-w-[1400px] mx-auto px-2 md:px-4 lg:px-8 pb-6">
        <Card className="bg-gray-800/90 border-gray-700 shadow-lg rounded-lg">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-sm text-gray-400 mb-4">Lesson Progress</h3>
              {(() => {
                const overall = getOverallProgress();
                return (
                  <div className="mb-6">
                    <div className="text-lg font-semibold text-blue-400 mb-1">
                      {overall.completed} / {overall.total} tasks completed ({overall.percentage}%)
                    </div>
                  </div>
                );
              })()}
              
              {/* Lesson Buttons */}
              <div className="flex justify-center gap-2 flex-wrap mb-4">
                {lessons.map((lesson, index) => {
                  const progress = getLessonProgress(index);
                  const isCurrent = index === currentLessonIndex;
                  const isCompleted = completedLessons[index] === true;
                  const hasProgress = progress.completed > 0;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentLessonIndex(index);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`relative transition-all duration-200 ${
                        isCurrent
                          ? 'w-12 h-12 scale-110'
                          : 'w-10 h-10'
                      } rounded-lg flex flex-col items-center justify-center ${
                        isCurrent
                          ? 'bg-blue-600 border-2 border-blue-400 shadow-lg'
                          : isCompleted
                          ? 'bg-green-600 border-2 border-green-400 hover:scale-105'
                          : hasProgress
                          ? 'bg-yellow-600 border-2 border-yellow-400 hover:scale-105'
                          : 'bg-gray-700 border-2 border-gray-600 hover:scale-105'
                      } cursor-pointer`}
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
              
              {/* Legend */}
              <div className="flex justify-center gap-4 text-xs text-gray-500 flex-wrap">
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
          </CardContent>
        </Card>
      </div>

      {/* Fixed Navigation Buttons - Bottom */}
      <div className="fixed bottom-6 left-2 right-2 md:left-4 md:right-4 lg:left-8 lg:right-8 max-w-[1400px] mx-auto flex justify-between pointer-events-none z-40">
        <Button
          onClick={handlePrevLesson}
          disabled={currentLessonIndex === 0}
          variant="outline"
          className="border-gray-600 text-gray-300 disabled:opacity-50 pointer-events-auto shadow-lg"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={handleNextLesson}
          variant="outline"
          className="border-blue-600 text-blue-400 hover:bg-blue-600/10 pointer-events-auto shadow-lg"
          size="sm"
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
  );
};

export default LessonsPage;
