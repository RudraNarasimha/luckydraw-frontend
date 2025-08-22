import React, { useState } from 'react';
import { Search, Trophy, Shuffle, AlertCircle } from 'lucide-react';
import { Participant, Winner, PrizeRank } from '../types';

interface Props {
  participants: Participant[];
  winners: Winner[];
  onAddWinner: (winner: Omit<Winner, 'id'>) => void;
}

export const DrawManagement: React.FC<Props> = ({
  participants,
  winners,
  onAddWinner
}) => {
  const [tokenInput, setTokenInput] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [selectedRank, setSelectedRank] = useState<PrizeRank>('1st Prize');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [error, setError] = useState('');

  const prizeRanks: PrizeRank[] = ['1st Prize', '2nd Prize', '3rd Prize', 'Consolation Prize', 'Special Prize'];
  const years = ['2023', '2024', '2025', '2026', '2027'];

  const searchParticipant = () => {
    const participant = participants.find(p => p.tokenNo === tokenInput.trim());
    if (participant) {
      setSelectedParticipant(participant);
      setError('');
    } else {
      setSelectedParticipant(null);
      setError('Participant not found with this token number');
    }
  };

  const getRandomParticipant = () => {
    const availableParticipants = participants.filter(p => 
      !winners.some(w => w.participant.id === p.id && w.year === selectedYear)
    );
    
    if (availableParticipants.length === 0) {
      setError('No available participants for random selection');
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * availableParticipants.length);
    const randomParticipant = availableParticipants[randomIndex];
    setSelectedParticipant(randomParticipant);
    setTokenInput(randomParticipant.tokenNo);
    setError('');
  };

  const assignWinner = () => {
    if (!selectedParticipant) {
      setError('Please select a participant first');
      return;
    }

    // Check if participant already won a prize in the selected year
    const existingWinner = winners.find(w => 
      w.participant.id === selectedParticipant.id && w.year === selectedYear
    );

    if (existingWinner) {
      setError(`This participant has already won "${existingWinner.rank}" in ${selectedYear}`);
      return;
    }

    // Check if this rank is already assigned for the selected year
    const rankTaken = winners.find(w => w.rank === selectedRank && w.year === selectedYear);
    if (rankTaken && ['1st Prize', '2nd Prize', '3rd Prize'].includes(selectedRank)) {
      setError(`${selectedRank} has already been assigned for ${selectedYear}`);
      return;
    }

    const winner: Omit<Winner, 'id'> = {
      participant: selectedParticipant,
      rank: selectedRank,
      year: selectedYear,
      assignedAt: new Date().toISOString()
    };

    onAddWinner(winner);
    setSelectedParticipant(null);
    setTokenInput('');
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <Trophy className="w-6 h-6 text-yellow-600" />
          <h2 className="text-2xl font-bold text-gray-900">Draw Management</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Token Search */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Search Participant</h3>
            
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter token number"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={searchParticipant}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={getRandomParticipant}
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Shuffle className="w-5 h-5 mr-2" />
                Random Pick
              </button>
            </div>

            {error && (
              <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}
          </div>

          {/* Prize Assignment */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Prize Assignment</h3>
            
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select
              value={selectedRank}
              onChange={(e) => setSelectedRank(e.target.value as PrizeRank)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {prizeRanks.map(rank => (
                <option key={rank} value={rank}>{rank}</option>
              ))}
            </select>

            <button
              onClick={assignWinner}
              disabled={!selectedParticipant}
              className="w-full px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <Trophy className="w-5 h-5 mr-2" />
              Assign Winner
            </button>
          </div>
        </div>
      </div>

      {/* Selected Participant */}
      {selectedParticipant && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Selected Participant</h3>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Token No</p>
                <p className="font-semibold text-blue-900">{selectedParticipant.tokenNo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold text-blue-900">{selectedParticipant.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold text-blue-900">{selectedParticipant.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Year</p>
                <p className="font-semibold text-blue-900">{selectedParticipant.year}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Winners */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Recent Winners</h3>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {winners.slice(-5).reverse().map((winner) => (
            <div key={winner.id} className="px-6 py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {winner.participant.name} ({winner.participant.tokenNo})
                  </p>
                  <p className="text-sm text-gray-600">
                    {winner.rank} - {winner.year}
                  </p>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(winner.assignedAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
          {winners.length === 0 && (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No winners assigned yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};