import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { ArrowLeft, Search, Copy, Check, BookOpen, FileText, Code, Play, Filter } from 'lucide-react';
import { syntaxReference, examplesLibrary, commonPatterns } from '../utils/referenceData';

const ReferencePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('syntax');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const filteredExamples = examplesLibrary.filter(example => {
    const matchesSearch = !searchQuery || 
      example.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      example.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
      example.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDifficulty = selectedDifficulty === 'all' || example.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesDifficulty;
  });

  const filteredPatterns = commonPatterns.filter(pattern => {
    const matchesSearch = !searchQuery ||
      pattern.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pattern.useCase.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pattern.template.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || pattern.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || pattern.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-900/50 text-green-400 border-green-700/50';
      case 'intermediate':
        return 'bg-yellow-900/50 text-yellow-400 border-yellow-700/50';
      case 'advanced':
        return 'bg-purple-900/50 text-purple-400 border-purple-700/50';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-700/50 bg-gray-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/map')}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Map
              </Button>
              <h1 
                className="text-xl font-bold text-blue-400"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                SQL REFERENCE GUIDE
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('syntax')}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'syntax'
                ? 'border-blue-400 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            Syntax Reference
          </button>
          <button
            onClick={() => setActiveTab('examples')}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'examples'
                ? 'border-blue-400 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Examples Library
          </button>
          <button
            onClick={() => setActiveTab('patterns')}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'patterns'
                ? 'border-blue-400 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            <Code className="w-4 h-4 inline mr-2" />
            Common Patterns
          </button>
        </div>

        {/* Search and Filters */}
        {(activeTab === 'examples' || activeTab === 'patterns') && (
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="flex gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm text-white"
                >
                  <option value="all">All Difficulties</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              {activeTab === 'patterns' && (
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm text-white"
                  >
                    <option value="all">All Categories</option>
                    <option value="aggregation">Aggregation</option>
                    <option value="joins">Joins</option>
                    <option value="subqueries">Subqueries</option>
                    <option value="window-functions">Window Functions</option>
                    <option value="filtering">Filtering</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="space-y-6">
          {/* Syntax Reference Tab */}
          {activeTab === 'syntax' && (
            <div className="space-y-6">
              {syntaxReference.map((category, catIndex) => (
                <Card key={catIndex} className="bg-gray-800/80 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-300">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {category.items.map((item, itemIndex) => {
                        const id = `syntax-${catIndex}-${itemIndex}`;
                        return (
                          <Card key={itemIndex} className="bg-gray-900/50 border-gray-700/50">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="text-sm font-semibold text-gray-200">{item.name}</h3>
                                <button
                                  onClick={() => handleCopy(item.syntax, id)}
                                  className="text-gray-400 hover:text-blue-400 transition-colors"
                                  title="Copy syntax"
                                >
                                  {copiedId === id ? (
                                    <Check className="w-4 h-4" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                              <p className="text-xs text-gray-400 mb-3">{item.description}</p>
                              <div className="bg-gray-800 rounded p-2 mb-2">
                                <code className="text-xs text-green-400 font-mono whitespace-pre-wrap break-all">
                                  {item.syntax}
                                </code>
                              </div>
                              {item.examples && item.examples.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs text-gray-500 mb-1">Example:</p>
                                  <code className="text-xs text-blue-400 font-mono">
                                    {item.examples[0]}
                                  </code>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Examples Library Tab */}
          {activeTab === 'examples' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExamples.map((example) => {
                const id = `example-${example.id}`;
                return (
                  <Card key={example.id} className="bg-gray-800/80 border-gray-700/50 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm text-gray-200">{example.title}</CardTitle>
                        <span className={`text-xs px-2 py-1 rounded border ${getDifficultyColor(example.difficulty)}`}>
                          {example.difficulty}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-gray-900 rounded p-2">
                        <code className="text-xs text-green-400 font-mono whitespace-pre-wrap break-all">
                          {example.query}
                        </code>
                      </div>
                      <p className="text-xs text-gray-400">{example.explanation}</p>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleCopy(example.query, id)}
                          size="sm"
                          variant="outline"
                          className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          {copiedId === id ? (
                            <>
                              <Check className="w-3 h-3 mr-1" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {example.tags.map((tag, idx) => (
                          <span key={idx} className="text-xs px-2 py-0.5 bg-blue-900/30 text-blue-400 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {filteredExamples.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-400">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No examples found matching your search.</p>
                </div>
              )}
            </div>
          )}

          {/* Common Patterns Tab */}
          {activeTab === 'patterns' && (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredPatterns.map((pattern, index) => {
                const id = `pattern-${index}`;
                return (
                  <Card key={index} className="bg-gray-800/80 border-gray-700/50 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm text-gray-200">{pattern.name}</CardTitle>
                        <span className={`text-xs px-2 py-1 rounded border ${getDifficultyColor(pattern.difficulty)}`}>
                          {pattern.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">{pattern.useCase}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Template:</p>
                        <div className="bg-gray-900 rounded p-2">
                          <code className="text-xs text-green-400 font-mono whitespace-pre-wrap break-all">
                            {pattern.template}
                          </code>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Example:</p>
                        <div className="bg-gray-900 rounded p-2">
                          <code className="text-xs text-blue-400 font-mono whitespace-pre-wrap break-all">
                            {pattern.example}
                          </code>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleCopy(pattern.template, id)}
                          size="sm"
                          variant="outline"
                          className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          {copiedId === id ? (
                            <>
                              <Check className="w-3 h-3 mr-1" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 mr-1" />
                              Copy Template
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Category:</span>
                        <span className="text-xs px-2 py-0.5 bg-purple-900/30 text-purple-400 rounded">
                          {pattern.category}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {filteredPatterns.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-400">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No patterns found matching your search.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferencePage;

