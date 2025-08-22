import React, { useState } from 'react';
import { Trophy, Download, Calendar, Award, Trash2 } from 'lucide-react';
import { Winner } from '../types';
import { exportToCSV } from '../utils/export';

interface Props {
  winners: Winner[];
  onDeleteWinner: (id: string) => void;
}

export const WinnerManagement: React.FC<Props> = ({ winners, onDeleteWinner }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const years = ['2023', '2024', '2025', '2026', '2027'];
  const prizeRanks = ['1st Prize', '2nd Prize', '3rd Prize', 'Consolation Prize', 'Special Prize'];
  
  const filteredWinners = winners.filter(w => w.year === selectedYear);

  const getWinnersByRank = (rank: string) => {
    return filteredWinners.filter(w => w.prize === rank);
  };

  const handleExport = () => {
    const exportData = filteredWinners.map(w => ({
      tokenNo: w.participant.tokenNo,
      name: w.participant.name,
      phone: w.participant.phone,
      rank: w.prize,
      year: w.year,
      assignedAt: new Date(w.assignedAt).toLocaleString()
    }));
    
    const headers = ['tokenNo', 'name', 'phone', 'rank', 'year', 'assignedAt'];
    exportToCSV(exportData, `winners_${selectedYear}`, headers);
  };

  const getRankColor = (rank: string) => {
    const colors: Record<string, string> = {
      '1st Prize': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      '2nd Prize': 'bg-gray-100 text-gray-800 border-gray-200',
      '3rd Prize': 'bg-orange-100 text-orange-800 border-orange-200',
      'Consolation Prize': 'bg-blue-100 text-blue-800 border-blue-200',
      'Special Prize': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[rank] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Award className="w-6 h-6 text-yellow-600" />
            <h2 className="text-2xl font-bold text-gray-900">Winner Management</h2>
          </div>
          <div className="flex space-x-3">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <button
              onClick={handleExport}
              disabled={filteredWinners.length === 0}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Winners
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {prizeRanks.map(rank => {
            const count = getWinnersByRank(rank).length;
            return (
              <div key={rank} className="bg-gray-50 rounded-lg p-4 text-center">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRankColor(rank)}`}>
                  {rank}
                </div>
                <div className="text-2xl font-bold text-gray-900 mt-2">{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Winners by Category */}
      <div className="grid gap-6">
        {prizeRanks.map(rank => {
          const rankWinners = getWinnersByRank(rank);
          if (rankWinners.length === 0) return null;

          return (
            <div key={rank} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
                    {rank} ({rankWinners.length})
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRankColor(rank)}`}>
                    {selectedYear}
                  </span>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {rankWinners.map((winner) => (
                  <div key={winner.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                              <span className="text-yellow-600 font-bold text-sm">
                                {winner.participant.tokenNo}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900">
                              {winner.participant.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Token: {winner.participant.tokenNo} | Phone: {winner.participant.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(winner.assignedAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(winner.assignedAt).toLocaleTimeString()}
                        </div>
                      </div>
                         {/* Delete button */}
                         <button
                          onClick={() => {
                            if (confirm(`Delete winner ${winner.participant.name}?`)) {
                              onDeleteWinner(winner.id);
                            }
                          }}
                          className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors"
                          title="Delete Winner"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredWinners.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Winners Yet</h3>
            <p className="text-gray-500">No winners have been assigned for {selectedYear}</p>
          </div>
        </div>
      )}
    </div>
  );
};
