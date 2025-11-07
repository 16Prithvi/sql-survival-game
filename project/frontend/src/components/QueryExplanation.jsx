import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info, AlertCircle, Lightbulb, Play, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { explainQuery } from '../utils/queryAnalyzer';
import { analyzeQuery } from '../utils/queryOptimizer';

const QueryExplanation = ({ query, showOptimization = true }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!query || !query.trim()) {
    return null;
  }

  const explanation = explainQuery(query);
  const optimizations = showOptimization ? analyzeQuery(query) : [];

  if (!explanation || explanation.executionSteps.length === 0) {
    return null;
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'warning':
        return 'text-yellow-400 border-yellow-400/50 bg-yellow-900/20';
      case 'error':
        return 'text-red-400 border-red-400/50 bg-red-900/20';
      default:
        return 'text-blue-400 border-blue-400/50 bg-blue-900/20';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'warning':
        return <AlertCircle className="w-4 h-4" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  return (
    <Card className="bg-gray-800/80 border-gray-700/50 backdrop-blur-sm mt-4">
      <CardHeader 
        className="cursor-pointer hover:bg-gray-700/30 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-gray-300 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            Query Explanation
          </CardTitle>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Overview */}
          <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/50">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-200 mb-1">What This Query Does</h4>
                <p className="text-sm text-gray-300">{explanation.overview}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-gray-400">Complexity:</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    explanation.complexity === 'basic' ? 'bg-green-900/50 text-green-400' :
                    explanation.complexity === 'intermediate' ? 'bg-yellow-900/50 text-yellow-400' :
                    'bg-purple-900/50 text-purple-400'
                  }`}>
                    {explanation.complexity.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Execution Steps */}
          <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/50">
            <h4 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
              <Play className="w-4 h-4 text-green-400" />
              Execution Order
            </h4>
            <div className="space-y-3">
              {explanation.executionSteps.map((step, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {step.step}
                    </div>
                    {index < explanation.executionSteps.length - 1 && (
                      <div className="w-0.5 h-6 bg-gray-700 mt-1"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-semibold text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded">
                        {step.action}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-1">{step.description}</p>
                    <code className="text-xs text-gray-400 font-mono bg-gray-800 px-2 py-1 rounded block">
                      {step.sql}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optimization Suggestions */}
          {showOptimization && optimizations.length > 0 && (
            <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/50">
              <h4 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                Optimization Suggestions
              </h4>
              <div className="space-y-2">
                {optimizations.map((opt, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded border ${getSeverityColor(opt.severity)}`}
                  >
                    <div className="flex items-start gap-2">
                      {getSeverityIcon(opt.severity)}
                      <div className="flex-1">
                        <div className="text-xs font-semibold mb-1">{opt.title}</div>
                        <div className="text-xs opacity-90">{opt.message}</div>
                        {opt.example && (
                          <code className="text-xs block mt-2 bg-gray-800/50 p-1.5 rounded">
                            {opt.example}
                          </code>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showOptimization && optimizations.length === 0 && (
            <div className="bg-green-900/20 rounded-lg p-3 border border-green-700/50">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-xs text-green-400">No optimization suggestions. Your query looks good!</span>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default QueryExplanation;

