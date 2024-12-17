import React, { useState, useRef, useEffect } from 'react';
import { X, PlusCircle, Sparkles } from 'lucide-react';

interface Ingredient {
  name: string;
  quantity?: string;
  unit?: string;
}

interface IngredientInputProps {
  onIngredientsUpdate: (updatedIngredients: string[]) => void;
}

const UNITS = [
  { value: '', label: 'Unit' },
  { value: 'g', label: 'g' },
  { value: 'kg', label: 'kg' },
  { value: 'ml', label: 'ml' },
  { value: 'cup', label: 'cup' },
  { value: 'tbsp', label: 'tbsp' },
  { value: 'tsp', label: 'tsp' },
  { value: 'oz', label: 'oz' },
  { value: 'lb', label: 'lb' }
];

const IngredientInput: React.FC<IngredientInputProps> = ({ onIngredientsUpdate }) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState<Ingredient>({
    name: '',
    quantity: '',
    unit: ''
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const ingredientInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus on ingredient name input when component mounts or after adding an ingredient
    ingredientInputRef.current?.focus();
  }, [ingredients]);

  const addIngredient = () => {
    if (currentIngredient.name.trim()) {
      // Trigger animation
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);

      const updatedIngredients = [...ingredients, { ...currentIngredient }];
      setIngredients(updatedIngredients);
      
      // Pass only ingredient names to the parent component
      onIngredientsUpdate(updatedIngredients.map(ing => ing.name));
      
      // Reset current ingredient
      setCurrentIngredient({ name: '', quantity: '', unit: '' });
    }
  };

  const removeIngredient = (index: number) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
    
    // Pass only ingredient names to the parent component
    onIngredientsUpdate(updatedIngredients.map(ing => ing.name));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow adding ingredient by pressing Enter
    if (e.key === 'Enter') {
      addIngredient();
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 shadow-2xl rounded-2xl p-6 space-y-4 relative overflow-hidden">
      {/* Decorative Sparkle Background */}
      <div className="absolute top-0 right-0 opacity-10 transform rotate-45 translate-x-1/4 -translate-y-1/4">
        <Sparkles size={200} strokeWidth={1} className="text-blue-200" />
      </div>

      <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
        <Sparkles className="mr-2 text-yellow-500" size={24} />
        What&apos;s in Your Kitchen?
      </h2>
      
      <div className="flex space-x-2">
        <input
          ref={ingredientInputRef}
          type="text"
          placeholder="Ingredient Name"
          value={currentIngredient.name}
          onChange={(e) => setCurrentIngredient({
            ...currentIngredient, 
            name: e.target.value
          })}
          onKeyDown={handleKeyDown}
          className="flex-grow p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
        />
        <input
          type="text"
          placeholder="Qty"
          value={currentIngredient.quantity}
          onChange={(e) => setCurrentIngredient({
            ...currentIngredient, 
            quantity: e.target.value
          })}
          onKeyDown={handleKeyDown}
          className="w-20 p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
        />
        <select
          value={currentIngredient.unit}
          onChange={(e) => setCurrentIngredient({
            ...currentIngredient, 
            unit: e.target.value
          })}
          className="w-24 p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
        >
          {UNITS.map((unit) => (
            <option key={unit.value} value={unit.value}>
              {unit.label}
            </option>
          ))}
        </select>
        <button 
          onClick={addIngredient}
          className="
            bg-blue-500 text-white p-3 rounded-lg 
            hover:bg-blue-600 transition-all duration-300
            transform hover:scale-105 active:scale-95
            flex items-center justify-center
          "
        >
          <PlusCircle />
        </button>
      </div>

      <div className={`mt-4 space-y-2 ${ingredients.length > 0 ? 'animate-fade-in' : ''}`}>
        {ingredients.map((ingredient, index) => (
          <div 
            key={index} 
            className={`
              flex items-center justify-between 
              bg-blue-100 p-3 rounded-lg 
              transform transition-all duration-300
              ${isAnimating ? 'animate-pulse' : ''}
              hover:bg-blue-200
            `}
          >
            <span className="flex-grow">
              {ingredient.quantity ? ingredient.quantity : ''} 
              {ingredient.unit ? ` ${ingredient.unit}` : ''} 
              {` ${ingredient.name}`}
            </span>
            <button 
              onClick={() => removeIngredient(index)}
              className="
                text-red-500 hover:text-red-700 
                transition-all duration-300
                transform hover:scale-110 active:scale-95
              "
            >
              <X size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientInput;
