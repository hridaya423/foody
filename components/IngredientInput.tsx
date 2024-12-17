import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';

interface Ingredient {
  name: string;
  quantity?: string;
  unit?: string;
}

interface IngredientInputProps {
  onIngredientsUpdate: (updatedIngredients: string[]) => void;
}

const IngredientInput: React.FC<IngredientInputProps> = ({ onIngredientsUpdate }) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState<Ingredient>({
    name: '',
    quantity: '',
    unit: ''
  });

  const addIngredient = () => {
    if (currentIngredient.name.trim()) {
      const updatedIngredients = [...ingredients, currentIngredient];
      setIngredients(updatedIngredients);
      
      // Pass only ingredient names to the parent component
      onIngredientsUpdate(updatedIngredients.map(ing => ing.name));
      
      setCurrentIngredient({ name: '', quantity: '', unit: '' });
    }
  };

  const removeIngredient = (index: number) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
    
    // Pass only ingredient names to the parent component
    onIngredientsUpdate(updatedIngredients.map(ing => ing.name));
  };

  return (
    <div className="bg-white shadow-2xl rounded-2xl p-6 space-y-4">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">
        What&apos;s in Your Kitchen?
      </h2>
      
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Ingredient Name"
          value={currentIngredient.name}
          onChange={(e) => setCurrentIngredient({
            ...currentIngredient, 
            name: e.target.value
          })}
          className="flex-grow p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Qty"
          value={currentIngredient.quantity}
          onChange={(e) => setCurrentIngredient({
            ...currentIngredient, 
            quantity: e.target.value
          })}
          className="w-20 p-2 border rounded"
        />
        <select
          value={currentIngredient.unit}
          onChange={(e) => setCurrentIngredient({
            ...currentIngredient, 
            unit: e.target.value
          })}
          className="w-24 p-2 border rounded"
        >
          <option value="">Unit</option>
          <option value="g">g</option>
          <option value="kg">kg</option>
          <option value="ml">ml</option>
          <option value="cup">cup</option>
        </select>
        <button 
          onClick={addIngredient}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          <PlusCircle />
        </button>
      </div>

      <div className="mt-4">
        {ingredients.map((ingredient, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between bg-blue-50 p-2 rounded mb-2"
          >
            <span>
              {ingredient.quantity} {ingredient.unit} {ingredient.name}
            </span>
            <button 
              onClick={() => removeIngredient(index)}
              className="text-red-500 hover:text-red-700"
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