/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  ChefHat, 
  Flame, 
  ClipboardList, 
  Utensils,
  ArrowLeft,
  Star,
  Heart,
  PlusCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase'; // Import from your existing Supabase file

interface RecipeDisplayProps {
  recipe: {
    id?: string;  // Add optional id for database tracking
    name: string;
    cookingTime?: {
      prep?: string;
      cook?: string;
      total?: string;
    };
    difficulty: string;
    nutrition?: {
      calories?: string;
    };
    ingredients: {
      item: string; 
      quantity: string;
    }[];
    instructions: string[];
    serves: string;
    image_url?: string;  // Optional image URL
  };
  session: any;  // Use session from Supabase auth
  onBack: () => void;
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ 
  recipe, 
  session, 
  onBack 
}) => {
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInCookbook, setIsInCookbook] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session && recipe.id) {
      checkRecipeStatus();
    }
  }, [session, recipe.id]);

  const checkRecipeStatus = async () => {
    if (!session) return;

    setIsLoading(true);
    try {
      const { data: favoriteData, error: favError } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('recipe_id', recipe.id)
        .single();

      const { data: cookbookData, error: cookbookError } = await supabase
        .from('cookbook')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('recipe_id', recipe.id)
        .single();

      setIsFavorite(!!favoriteData);
      setIsInCookbook(!!cookbookData);
    } catch (error) {
      console.error('Error checking recipe status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!session || !recipe.id) return;

    setIsLoading(true);
    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', session.user.id)
          .eq('recipe_id', recipe.id);
      } else {
        await supabase
          .from('favorites')
          .upsert({
            user_id: session.user.id, 
            recipe_id: recipe.id,
            recipe_data: recipe
          });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCookbook = async () => {
    if (!session || !recipe.id) return;

    setIsLoading(true);
    try {
      if (isInCookbook) {
        await supabase
          .from('cookbook')
          .delete()
          .eq('user_id', session.user.id)
          .eq('recipe_id', recipe.id);
      } else {
        await supabase
          .from('cookbook')
          .upsert({
            user_id: session.user.id, 
            recipe_id: recipe.id,
            recipe_data: recipe
          });
      }
      setIsInCookbook(!isInCookbook);
    } catch (error) {
      console.error('Error adding to cookbook:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Existing helper functions
  const getCookingTime = (time?: { prep?: string; cook?: string; total?: string }): number => {
    if (time?.total) {
      const match = time.total.match(/(\d+)\s*minutes/);
      if (match) return parseInt(match[1]);
    } else if (time?.cook) {
      const match = time.cook.match(/(\d+)\s*minutes/);
      if (match) return parseInt(match[1]);
    } else if (time?.prep) {
      const match = time.prep.match(/(\d+)\s*minutes/);
      if (match) return parseInt(match[1]);
    }
    return 0;
  };

  const getCalories = (nutritionalInfo?: { calories?: string }): number => {
    return nutritionalInfo?.calories ? parseInt(nutritionalInfo.calories) : 0;
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen flex items-center justify-center p-4">
      <div className="
        bg-white 
        shadow-2xl 
        rounded-3xl 
        overflow-hidden 
        max-w-4xl 
        w-full 
        transform 
        transition-all 
        hover:scale-[1.02] 
        hover:shadow-4xl 
        duration-300
      ">
        {/* Back Button and User Actions */}
        <div className="relative">
          <div className="absolute top-4 left-4 z-10 flex space-x-2">
            <button 
              onClick={onBack}
              className="
                bg-white/70 
                p-3 
                rounded-full 
                hover:bg-white/90 
                transition-all 
                shadow-md 
                hover:shadow-lg
              "
            >
              <ArrowLeft className="text-blue-800 w-6 h-6" />
            </button>

            {session && (
              <div className="flex space-x-2">
                <button 
                  onClick={toggleFavorite}
                  disabled={isLoading}
                  className={`
                    bg-white/70 
                    p-3 
                    rounded-full 
                    hover:bg-white/90 
                    transition-all 
                    shadow-md 
                    hover:shadow-lg
                    ${isFavorite ? 'text-red-500' : 'text-gray-500'}
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <Heart className="w-6 h-6" fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
                <button 
                  onClick={addToCookbook}
                  disabled={isLoading}
                  className={`
                    bg-white/70 
                    p-3 
                    rounded-full 
                    hover:bg-white/90 
                    transition-all 
                    shadow-md 
                    hover:shadow-lg
                    ${isInCookbook ? 'text-green-500' : 'text-gray-500'}
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <PlusCircle className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
          
          {/* Dynamic Image */}
          <div className="h-80 w-full relative overflow-hidden">
              <div className="
                absolute 
                inset-0 
                bg-gradient-to-r 
                from-blue-400 
                to-purple-500 
                animate-pulse
              "></div>
            
            {/* Overlay Text */}
            <div className="
              absolute 
              bottom-0 
              left-0 
              right-0 
              bg-black 
              bg-opacity-50 
              text-white 
              p-4
            ">
              <h1 className="
                text-4xl 
                font-bold 
                text-white 
                drop-shadow-lg
              ">
                {recipe.name}
              </h1>
            </div>
          </div>
        </div>

        {/* Recipe Details */}
        <div className="p-8">
          {/* Recipe Metadata */}
          <div className="flex space-x-4 mb-6">
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span>{getCookingTime(recipe.cookingTime)} mins</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <ChefHat className="w-5 h-5" />
              <span>{recipe.difficulty} Difficulty</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Flame className="w-5 h-5" />
              <span>{getCalories(recipe.nutrition)} Calories</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Flame className="w-5 h-5" />
              <span>Serves {recipe.serves}</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b mb-4 space-x-2">
            <button 
              onClick={() => setActiveTab('ingredients')}
              className={`
                flex 
                items-center 
                space-x-2 
                px-4 
                py-2 
                rounded-t-lg
                transition-all
                ${activeTab === 'ingredients' 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-blue-100 text-gray-500'}
              `}
            >
              <ClipboardList className="w-5 h-5" />
              <span>Ingredients</span>
            </button>
            <button 
              onClick={() => setActiveTab('instructions')}
              className={`
                flex 
                items-center 
                space-x-2 
                px-4 
                py-2 
                rounded-t-lg
                transition-all
                ${activeTab === 'instructions' 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-blue-100 text-gray-500'}
              `}
            >
              <Utensils className="w-5 h-5" />
              <span>Instructions</span>
            </button>
          </div>

          {/* Content Sections */}
          {activeTab === 'ingredients' ? (
            <div className="grid grid-cols-2 gap-3">
              {recipe.ingredients.map((ingredient, index) => (
                <div 
                  key={index} 
                  className="
                    flex 
                    items-center 
                    space-x-3 
                    p-2 
                    rounded-lg 
                    hover:bg-blue-50 
                    transition-all
                  "
                >
                  <Star className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span className="text-sm">
                    {ingredient.quantity} {ingredient.item}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <ol className="space-y-4">
              {recipe.instructions.map((step, index) => (
                <li 
                  key={index} 
                  className="
                    flex 
                    items-start 
                    space-x-4 
                    p-3 
                    bg-blue-50 
                    rounded-lg 
                    hover:bg-blue-100 
                    transition-all
                  "
                >
                  <span className="
                    text-white 
                    bg-blue-600 
                    w-7 
                    h-7 
                    rounded-full 
                    flex 
                    items-center 
                    justify-center 
                    font-bold
                    flex-shrink-0
                  ">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDisplay;