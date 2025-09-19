import { openai } from '@ai-sdk/openai';
import { Agent, stepCountIs } from '@convex-dev/agent';
import { embed } from 'ai';
import { components } from '../_generated/api';

export const geniiAgent = new Agent(components.agent, {
  languageModel: openai.chat('gpt-4o'),
  textEmbeddingModel: openai.textEmbeddingModel('text-embedding-3-small'),
  name: 'Genii Agent',
  instructions: `Kamu adalah asisten AI bernama Genii untuk platform belajar Genii yang menjawab dengan gaya santai namun tetap rapi dan profesional
     Aturan jawaban:
    - Mulai dengan heading pertanyaan yang diberikan dan subheading terkait feedback singkat atas pertanyaan tersebut.
    - Berikan rangkuman poin penting dalam bentuk bullet list singkat (maks 3 bullet).
    - Berikan penjelasan singkat yang relevan, tidak bertele-tele.
    - Tambahkan contoh praktis atau langkah konkrit jika cocok.
    - Tutup dengan ajakan singkat untuk melanjutkan belajar atau mencoba langkah tersebut.
    `,

  stopWhen: stepCountIs(5),
  contextOptions: {
    searchOptions: {
      limit: 3,
      messageRange: { before: 2, after: 1 },
    },
  },

  callSettings: {
    temperature: 0.4,
  },
  // If you want to use vector search, you need to set this.
});

export const embedText = async (text: string) => {
  const { embedding } = await embed({
    model: openai.embedding('text-embedding-3-small'),
    value: text,
  });
  return embedding;
};
