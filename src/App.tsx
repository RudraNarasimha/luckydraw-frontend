import React, { useState, useEffect } from "react";
import { Users, Trophy, Award, Gift } from "lucide-react";
import { Participant, Winner } from "./types";
import {
  fetchParticipants,
  addParticipant,
  editParticipant,
  deleteParticipant,
  fetchWinners,
  addWinner,
  deleteWinner,
} from "./utils/api";
import { ParticipantManagement } from "./components/ParticipantManagement";
import { DrawManagement } from "./components/DrawManagement";
import { WinnerManagement } from "./components/WinnerManagement";

function App() {
  const [currentTab, setCurrentTab] = useState<"participants" | "draw" | "winners">("participants");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from backend
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [p, w] = await Promise.all([fetchParticipants(), fetchWinners()]);
      setParticipants(p);
      setWinners(w);
      setLoading(false);
    };
    loadData();
  }, []);

  // Participant handlers
  const handleAddParticipant = async (participantData: Omit<Participant, "id">) => {
    const newParticipant = await addParticipant(participantData);
    setParticipants((prev) => [...prev, newParticipant]);
  };

  const handleEditParticipant = async (updatedParticipant: Participant) => {
    const res = await editParticipant(updatedParticipant);
    setParticipants((prev) =>
      prev.map((p) => (p.id === res.id ? res : p))
    );
  };

  const handleDeleteParticipant = async (id: string) => {
    if (confirm("Are you sure you want to delete this participant?")) {
      await deleteParticipant(id);
      setParticipants((prev) => prev.filter((p) => p.id !== id));
      setWinners((prev) => prev.filter((w) => w.participant.id !== id));
    }
  };

  // Winner handlers
  const handleAddWinner = async (winnerData: Omit<Winner, "id">) => {
    const newWinner = await addWinner(winnerData);
    setWinners((prev) => [...prev, newWinner]);
  };

  const handleDeleteWinner = async (id: string) => {
    if (confirm("Are you sure you want to delete this winner?")) {
      await deleteWinner(id);
      setWinners((prev) => prev.filter((w) => w.id !== id));
    }
  };

  const tabs = [
    {
      id: "participants" as const,
      name: "Participants",
      icon: Users,
      count: participants.length,
    },
    {
      id: "draw" as const,
      name: "Draw",
      icon: Gift,
      count: null,
    },
    {
      id: "winners" as const,
      name: "Winners",
      icon: Award,
      count: winners.length,
    },
  ];

  if (loading) {
    return <div className="text-center py-20 text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Lucky Draw Management</h1>
                <p className="text-sm text-gray-600">
                  Manage participants, conduct draws, and track winners
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex space-x-1 bg-white rounded-xl p-1 shadow-sm border border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`
                  flex items-center px-6 py-3 rounded-lg transition-all duration-200 font-medium
                  ${
                    currentTab === tab.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }
                `}
              >
                <Icon className="w-5 h-5 mr-2" />
                {tab.name}
                {tab.count !== null && (
                  <span
                    className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      currentTab === tab.id
                        ? "bg-white bg-opacity-20 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {currentTab === "participants" && (
          <ParticipantManagement
            participants={participants}
            onAddParticipant={handleAddParticipant}
            onEditParticipant={handleEditParticipant}
            onDeleteParticipant={handleDeleteParticipant}
          />
        )}
        {currentTab === "draw" && (
          <DrawManagement
            participants={participants}
            winners={winners}
            onAddWinner={handleAddWinner}
          />
        )}
        {currentTab === "winners" && (
          <WinnerManagement
            winners={winners}
            onDeleteWinner={handleDeleteWinner}
          />
        )}
      </div>
    </div>
  );
}

export default App;
