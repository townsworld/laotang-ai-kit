import { openDB, DBSchema } from 'idb';
import { SavedWord, Derivative, RelatedConcept } from '../types';

interface LexiconDB extends DBSchema {
  words: {
    key: number;
    value: SavedWord;
    indexes: { 'by-word': string };
  };
  derivatives: {
    key: string;
    value: { word: string; data: Derivative[]; timestamp: number };
  };
  related_concepts: {
    key: string;
    value: { word: string; data: RelatedConcept[]; timestamp: number };
  };
  audio_cache: {
    key: string;
    value: { text: string; pcmData: ArrayBuffer; timestamp: number };
  };
}

const DB_NAME = 'lexicon-artistry-db';
const DB_VERSION = 3; // Bumped version to force schema upgrade

export const initDB = async () => {
  return openDB<LexiconDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      // --- Store 1: Saved Words (Gallery) ---
      let wordsStore;
      if (!db.objectStoreNames.contains('words')) {
        // Create new store
        wordsStore = db.createObjectStore('words', {
          keyPath: 'id',
          autoIncrement: true,
        });
      } else {
        // Use existing store
        wordsStore = transaction.objectStore('words');
      }

      // Ensure index exists (Fix for missing index on migration)
      if (!wordsStore.indexNames.contains('by-word')) {
        wordsStore.createIndex('by-word', 'word');
      }

      // --- Store 2: Derivatives Cache ---
      if (!db.objectStoreNames.contains('derivatives')) {
        db.createObjectStore('derivatives', { keyPath: 'word' });
      }

      // --- Store 3: Related Concepts Cache ---
      if (!db.objectStoreNames.contains('related_concepts')) {
        db.createObjectStore('related_concepts', { keyPath: 'word' });
      }

      // --- Store 4: Audio Cache (TTS) ---
      if (!db.objectStoreNames.contains('audio_cache')) {
        db.createObjectStore('audio_cache', { keyPath: 'text' });
      }
    },
  });
};

// --- Gallery Collection Methods ---

export const saveToCollection = async (wordData: SavedWord): Promise<number> => {
  const db = await initDB();

  // Check for duplicates using the index
  const existing = await db.getFromIndex('words', 'by-word', wordData.word);

  if (existing) {
    console.log(`Word "${wordData.word}" already in collection.`);
    return existing.id!;
  }

  return await db.add('words', wordData);
};

export const getCollection = async (): Promise<SavedWord[]> => {
  const db = await initDB();
  return await db.getAll('words');
};

export const deleteFromCollection = async (id: number): Promise<void> => {
  const db = await initDB();
  await db.delete('words', id);
};

export const isWordSaved = async (word: string): Promise<boolean> => {
  const db = await initDB();
  const result = await db.getFromIndex('words', 'by-word', word);
  return !!result;
};

// --- Caching Methods ---

// Derivatives
export const getCachedDerivatives = async (word: string): Promise<Derivative[] | null> => {
  const db = await initDB();
  const result = await db.get('derivatives', word);
  return result ? result.data : null;
};

export const cacheDerivatives = async (word: string, data: Derivative[]): Promise<void> => {
  const db = await initDB();
  await db.put('derivatives', { word, data, timestamp: Date.now() });
};

// Related Concepts
export const getCachedRelatedConcepts = async (word: string): Promise<RelatedConcept[] | null> => {
  const db = await initDB();
  const result = await db.get('related_concepts', word);
  return result ? result.data : null;
};

export const cacheRelatedConcepts = async (word: string, data: RelatedConcept[]): Promise<void> => {
  const db = await initDB();
  await db.put('related_concepts', { word, data, timestamp: Date.now() });
};

// Audio (TTS)
export const getCachedAudio = async (text: string): Promise<ArrayBuffer | null> => {
  const db = await initDB();
  const result = await db.get('audio_cache', text);
  return result ? result.pcmData : null;
};

export const cacheAudio = async (text: string, pcmData: ArrayBuffer): Promise<void> => {
  const db = await initDB();
  await db.put('audio_cache', { text, pcmData, timestamp: Date.now() });
};

