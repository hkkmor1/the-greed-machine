import { baseApi } from '../api/baseApi';

export interface Character {
  id: string;
  name: string;
  luck: number;
  avatar: string;
}

export interface MachineState {
  coins_in_machine: number;
  wallet: number;
  bombs: number;
  jam_chance: number;
  is_jammed: boolean;
  payload?: {
    id: string;
    name: string;
    type: string;
    code: string;
  };
}

class GreedService {
  async getCharacters(): Promise<Character[]> {
    const response = await baseApi.get('/api/greed/characters');
    return response.data;
  }

    async createSession(characterId: string): Promise<{ session_id: string }> {
    const response = await baseApi.post('/api/greed/session/new', {}, {
      params: { character_id: characterId }
    });
    return response.data;
  }

  async selectCharacter(characterId: string): Promise<void> {
    await baseApi.post('/api/greed/select-character', { character_id: characterId });
  }

  async verifySession(sessionId: string): Promise<boolean> {
    try {
      const response = await baseApi.get(`/api/greed/session/${sessionId}/verify`);
      return response.data.valid;
    } catch {
      return false;
    }
  }

  async getMachineState(): Promise<MachineState> {
    const response = await baseApi.get('/api/greed/state');
    return response.data;
  }

  async donate(): Promise<MachineState> {
    const response = await baseApi.post('/api/greed/donate', {});
    return response.data;
  }

  async useBomb(): Promise<MachineState> {
    const response = await baseApi.post('/api/greed/bomb', {});
    return response.data;
  }

  async resetMachine(): Promise<MachineState> {
    const response = await baseApi.post('/api/greed/reset', {});
    return response.data;
  }
}

export const greedService = new GreedService();