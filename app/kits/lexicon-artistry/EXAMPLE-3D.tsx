// 3D Galaxy 组件使用示例

import { StarGalaxy3D } from './components/StarGalaxy3D';
import { HolographicRadar3D } from './components/HolographicRadar3D';

// 示例数据
const exampleGalaxyData = {
  coreWord: {
    word: "Serendipity",
    definition: "The occurrence and development of events by chance in a happy or beneficial way.",
    pronunciation: "/ˌserənˈdɪpəti/"
  },
  satellites: [
    // 近义词 (近轨道)
    {
      word: "Chance",
      type: "synonym" as const,
      distance: 1.0,
      nuance_score: {
        formal: 4,
        positive: 6,
        active: 5,
        common: 8,
        intensity: 5
      },
      part_of_speech: "n.",
      translation: "机会，偶然"
    },
    {
      word: "Fortune",
      type: "synonym" as const,
      distance: 1.1,
      nuance_score: {
        formal: 7,
        positive: 8,
        active: 3,
        common: 7,
        intensity: 6
      },
      part_of_speech: "n.",
      translation: "运气，财富"
    },
    {
      word: "Luck",
      type: "synonym" as const,
      distance: 0.9,
      nuance_score: {
        formal: 3,
        positive: 7,
        active: 4,
        common: 9,
        intensity: 5
      },
      part_of_speech: "n.",
      translation: "运气"
    },
    // 反义词 (远轨道)
    {
      word: "Misfortune",
      type: "antonym" as const,
      distance: 2.2,
      nuance_score: {
        formal: 6,
        positive: 1,
        active: 3,
        common: 6,
        intensity: 7
      },
      part_of_speech: "n.",
      translation: "不幸，厄运"
    },
    {
      word: "Disaster",
      type: "antonym" as const,
      distance: 2.5,
      nuance_score: {
        formal: 5,
        positive: 0,
        active: 2,
        common: 8,
        intensity: 9
      },
      part_of_speech: "n.",
      translation: "灾难"
    },
    {
      word: "Catastrophe",
      type: "antonym" as const,
      distance: 2.3,
      nuance_score: {
        formal: 8,
        positive: 0,
        active: 1,
        common: 5,
        intensity: 10
      },
      part_of_speech: "n.",
      translation: "大灾难"
    },
    // 易混词 (中轨道)
    {
      word: "Destiny",
      type: "confusable" as const,
      distance: 1.5,
      nuance_score: {
        formal: 8,
        positive: 7,
        active: 2,
        common: 7,
        intensity: 8
      },
      part_of_speech: "n.",
      translation: "命运"
    },
    {
      word: "Coincidence",
      type: "confusable" as const,
      distance: 1.3,
      nuance_score: {
        formal: 6,
        positive: 5,
        active: 3,
        common: 8,
        intensity: 4
      },
      part_of_speech: "n.",
      translation: "巧合"
    }
  ],
  radar_dimensions: ["Formal", "Positive", "Active", "Common", "Intensity"],
  visual_prompt: "A glowing ethereal orb floating in a soft violet nebula, dreamlike atmosphere, cinematic lighting, pastel pink and lavender hues, flowing cosmic dust"
};

// 雷达图示例数据
const exampleComparisonData = {
  wordA: "Serendipity",
  wordB: "Luck",
  dimensions: [
    { label: "Formal", scoreA: 9, scoreB: 3 },
    { label: "Positive", scoreA: 9, scoreB: 7 },
    { label: "Active", scoreA: 3, scoreB: 4 },
    { label: "Common", scoreA: 2, scoreB: 9 }
  ],
  insight: "Serendipity emphasizes the pleasant surprise and beneficial nature of chance discoveries, often with a literary or sophisticated tone. Luck is more casual and neutral, simply referring to chance without the positive narrative implication.",
  sentenceA: "The scientist's groundbreaking discovery was pure serendipity.",
  sentenceB: "Good luck on your exam tomorrow!"
};

// 使用方式：

export function Example3DGalaxy() {
  return (
    <StarGalaxy3D
      galaxyData={exampleGalaxyData}
      onSelectWord={(word) => console.log('Navigate to:', word)}
      onCompare={(wordA, wordB) => console.log('Compare:', wordA, 'vs', wordB)}
      onClose={() => console.log('Close galaxy')}
      lang="en"
    />
  );
}

export function ExampleRadar() {
  return (
    <HolographicRadar3D
      data={exampleComparisonData}
      onClose={() => console.log('Close radar')}
      isLoading={false}
      lang="en"
    />
  );
}

// 在主页面集成：
/*
{state.explorationStatus === 'active' && state.data?.galaxy_data && (
  <>
    <StarGalaxy3D
      galaxyData={state.data.galaxy_data}
      onSelectWord={(w) => handleSearch(w, 'artistic')}
      onCompare={handleCompare}
      onClose={handleCloseExplore}
      lang={state.language}
    />
    
    {state.comparisonStatus !== 'idle' && (
      <HolographicRadar3D
        data={state.comparisonData!}
        onClose={resetComparison}
        isLoading={state.comparisonStatus === 'analyzing'}
        lang={state.language}
      />
    )}
  </>
)}
*/

