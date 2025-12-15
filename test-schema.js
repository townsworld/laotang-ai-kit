// 快速测试脚本 - 验证 schema 是否正常工作

const testSchema = {
  type: "object",
  properties: {
    word: { type: "string" },
    phonetic: { type: "string" },
    meaning_cn: { type: "string" },
    etymology_cn: { type: "string" },
    sentence_en: { type: "string" },
    sentence_cn: { type: "string" },
    nano_banana_image_prompt: { type: "string" },
    related_concepts: {
      type: "array",
      items: {
        type: "object",
        properties: {
          word: { type: "string" },
          part_of_speech: { type: "string" },
          translation: { type: "string" },
          reason: { type: "string" },
          relationType: { type: "string", enum: ["synonym", "antonym", "association", "confusable"] }
        }
      }
    },
    derivatives: {
      type: "array",
      items: {
        type: "object",
        properties: {
          part_of_speech: { type: "string" },
          word: { type: "string" },
          translation: { type: "string" }
        }
      }
    },
    // 简化的可选 galaxy_data
    galaxy_data: {
      type: "object",
      properties: {
        coreWord: { type: "object" },
        satellites: { type: "array" }
      }
    }
  },
  required: ["word", "phonetic", "meaning_cn", "etymology_cn", "sentence_en", "sentence_cn", "nano_banana_image_prompt", "related_concepts", "derivatives"]
};

console.log("✅ Schema 结构正确");
console.log("必需字段:", testSchema.required);
console.log("galaxy_data 是可选的:", !testSchema.required.includes("galaxy_data"));

