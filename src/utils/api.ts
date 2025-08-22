import { Participant, Winner } from "../types";


const API_URL = import.meta.env.VITE_API_BASE || "https://luckydraw-backend-qqq3.onrender.com";
// Participants
export async function fetchParticipants(): Promise<Participant[]> {
  const res = await fetch(`${API_URL}/participants`);
  return res.json();
}

export async function addParticipant(data: Omit<Participant, "id">): Promise<Participant> {
  const res = await fetch(`${API_URL}/participants`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function editParticipant(participant: Participant): Promise<Participant> {
  const res = await fetch(`${API_URL}/participants/${participant.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(participant),
  });
  return res.json();
}

export async function deleteParticipant(id: string): Promise<void> {
  await fetch(`${API_URL}/participants/${id}`, { method: "DELETE" });
}

// Winners
export async function fetchWinners(): Promise<Winner[]> {
  const res = await fetch(`${API_URL}/winners`);
  return res.json();
}

export async function addWinner(data: Omit<Winner, "id">): Promise<Winner> {
  const res = await fetch(`${API_URL}/winners`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteWinner(id: string): Promise<void> {
  await fetch(`${API_URL}/winners/${id}`, { method: "DELETE" });
}
