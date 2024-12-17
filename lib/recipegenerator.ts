/* eslint-disable @typescript-eslint/no-explicit-any */
import OpenAI from 'openai';

export interface RecipeGenerationOptions {
  cuisine?: string;
  ingredients?: string[];
  dietaryRestrictions?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
}

export class RecipeGenerationService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });
  }

  async generateRecipe(options: RecipeGenerationOptions) {
    const prompt = this.constructPrompt(options);

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "You are a professional chef creating detailed, innovative recipes. Always respect dietary restrictions and preferences."
          },
          {
            role: "user", 
            content: prompt
          }
        ]
      });

      const recipeJson = JSON.parse(
        response.choices[0].message.content || '{}'
      );

      return this.processRecipe(recipeJson, options);
    } catch (error) {
      console.error("Recipe Generation Error:", error);
      throw error;
    }
  }

  private constructPrompt(options: RecipeGenerationOptions): string {
    let basePrompt = `Generate an innovative recipe`;

    // Combine all specifications
    const specifications: string[] = [];

    if (options.cuisine) {
      specifications.push(`in ${options.cuisine} cuisine`);
    }

    if (options.ingredients && options.ingredients.length) {
      specifications.push(`using ingredients: ${options.ingredients.join(', ')}`);
    }

    if (options.dietaryRestrictions && options.dietaryRestrictions.length) {
      specifications.push(`that is ${options.dietaryRestrictions.join(', ')}`);
    }

    if (options.difficulty) {
      specifications.push(`with ${options.difficulty} difficulty`);
    }

    // Combine specifications
    if (specifications.length > 0) {
      basePrompt += ` ${specifications.join(', ')}`;
    }

    basePrompt += `. Requirements:
    - Detailed ingredients list
    - Step-by-step instructions
    - Cooking time
    - Precise difficulty level
    - Estimated nutritional information
    - Ensures all dietary restrictions are strictly followed
    - random unique id for database tracking
    
    Return as detailed JSON with keys: 
    name, 
    ingredients (array with item and quantity), 
    instructions, 
    cookingTime (prep, total, cooking), 
    difficulty, 
    nutrition, 
    serves, 
    dietaryNotes,
    id`;

    return basePrompt;
  }

  private processRecipe(rawRecipe: any, options: RecipeGenerationOptions) {
    // Additional processing and validation
    return {
      ...rawRecipe,
      generatedAt: new Date(),
      generationOptions: options
    };
  }
}

export default RecipeGenerationService;