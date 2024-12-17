/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState } from 'react';
import { Search, Utensils, ChefHat, LeafyGreen, ShieldCheck } from 'lucide-react';
import IngredientInput from './IngredientInput';
import { RecipeGenerationService, RecipeGenerationOptions } from '../lib/recipegenerator';
import toast from 'react-hot-toast';

const CUISINES = [
  'Italian', 'Mexican', 'Japanese', 
  'Indian', 'French', 'Thai', 'Mediterranean'
];

const DIETARY_OPTIONS = [
  { label: 'Vegetarian', icon: <LeafyGreen /> },
  { label: 'Vegan', icon: <LeafyGreen /> },
  { label: 'Gluten-Free', icon: <ShieldCheck /> },
  { label: 'Dairy-Free', icon: <ShieldCheck /> },
  { label: 'Nut-Free', icon: <ShieldCheck /> }
];

const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'];

interface RecipeGeneratorProps {
  onRecipeGenerated: (recipe: any) => void;
}

const RecipeGenerator: React.FC<RecipeGeneratorProps> = ({ onRecipeGenerated }) => {
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isGenerating, setIsGenerating] = useState(false);

  const recipeService = new RecipeGenerationService();

  const generateRecipe = async () => {
    setIsGenerating(true);
    try {
      const generationOptions: RecipeGenerationOptions = {
        cuisine: selectedCuisine || undefined,
        ingredients: ingredients.length > 0 ? ingredients : undefined,
        dietaryRestrictions: dietaryRestrictions.length > 0 ? dietaryRestrictions : undefined,
        difficulty: difficulty
      };

      const recipe = await recipeService.generateRecipe(generationOptions);
      onRecipeGenerated(recipe);
      toast.success('Recipe Generated Successfully!');
    } catch (error) {
      toast.error('Failed to generate recipe. Please try again.');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleDietaryRestriction = (restriction: string) => {
    setDietaryRestrictions(prev => 
      prev.includes(restriction)
        ? prev.filter(r => r !== restriction)
        : [...prev, restriction]
    );
  };

  return (
    <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-4xl mx-auto">
      {/* Cuisine Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Select Cuisine</h2>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          {CUISINES.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => setSelectedCuisine(cuisine)}
              className={`
                p-4 rounded-xl transition-all duration-300
                ${selectedCuisine === cuisine 
                  ? 'bg-blue-600 text-white scale-105' 
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }
              `}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </div>

      {/* Ingredients Input */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">(Optional)</h2>
        <IngredientInput 
          onIngredientsUpdate={(updatedIngredients) => setIngredients(updatedIngredients)}
        />
      </div>

      {/* Dietary Restrictions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Dietary Restrictions</h2>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          {DIETARY_OPTIONS.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => toggleDietaryRestriction(label)}
              className={`
                p-4 rounded-xl flex items-center justify-center space-x-2
                transition-all duration-300
                ${dietaryRestrictions.includes(label)
                  ? 'bg-green-600 text-white scale-105'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
                }
              `}
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Difficulty Level</h2>
        <div className="flex space-x-4 justify-center">
          {DIFFICULTY_LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => setDifficulty(level as 'easy' | 'medium' | 'hard')}
              className={`
                px-6 py-3 rounded-full capitalize
                transition-all duration-300
                ${difficulty === level
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                }
              `}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <div className="text-center">
        <button
          onClick={generateRecipe}
          disabled={isGenerating}
          className="
            bg-green-500 text-white 
            px-10 py-4 rounded-full 
            hover:bg-green-600 
            transition-all duration-300
            flex items-center space-x-2 
            mx-auto
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {isGenerating ? 'Generating...' : 'Generate Recipe'}
          <Search className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default RecipeGenerator;