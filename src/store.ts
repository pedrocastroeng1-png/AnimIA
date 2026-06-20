import { useEffect, useState } from 'react';
import { MOCK_CHARACTERS, MOCK_HISTORY, MOCK_BACKGROUNDS } from './data';
import { Character, VideoHistory, Background } from './types';

export function useStore() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [history, setHistory] = useState<VideoHistory[]>([]);
  const [backgrounds, setBackgrounds] = useState<Background[]>([]);
  
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const chars = localStorage.getItem('ai_mascot_chars_v2');
    if (chars) {
      setCharacters(JSON.parse(chars));
    } else {
      setCharacters(MOCK_CHARACTERS);
      localStorage.setItem('ai_mascot_chars_v2', JSON.stringify(MOCK_CHARACTERS));
    }

    const hist = localStorage.getItem('ai_mascot_history_v2');
    if (hist) {
      setHistory(JSON.parse(hist));
    } else {
      setHistory(MOCK_HISTORY);
      localStorage.setItem('ai_mascot_history_v2', JSON.stringify(MOCK_HISTORY));
    }

    const bgs = localStorage.getItem('ai_mascot_bgs_v2');
    if (bgs) {
      setBackgrounds(JSON.parse(bgs));
    } else {
      setBackgrounds(MOCK_BACKGROUNDS);
      localStorage.setItem('ai_mascot_bgs_v2', JSON.stringify(MOCK_BACKGROUNDS));
    }
    
    setIsLoaded(true);
  }, []);

  const addHistory = (item: VideoHistory) => {
    const newHist = [item, ...history];
    setHistory(newHist);
    localStorage.setItem('ai_mascot_history_v2', JSON.stringify(newHist));
  };

  const addCharacter = (item: Character) => {
    const newChars = [item, ...characters];
    setCharacters(newChars);
    localStorage.setItem('ai_mascot_chars_v2', JSON.stringify(newChars));
  };

  return {
    characters,
    history,
    backgrounds,
    addHistory,
    addCharacter,
    isLoaded
  };
}
