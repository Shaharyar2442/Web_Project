import { useAuth } from '../context/AuthContext';

export const useUnit = () => {
  const { user } = useAuth();
  
  // Default to kg if no user or no preference
  const unitPreference = user?.unitPreference || 'kg';
  
  // Conversion factor: 1 kg = 2.20462 lbs
  const KG_TO_LBS = 2.20462;

  /**
   * Display a weight based on user preference.
   * Assumes the input weight is ALWAYS in kg.
   * Returns a formatted string e.g., "50 kg" or "110 lbs"
   */
  const displayWeight = (weightInKg, showUnit = true) => {
    if (weightInKg == null) return showUnit ? `0 ${unitPreference}` : '0';
    
    let convertedValue = weightInKg;
    if (unitPreference === 'lbs') {
      convertedValue = weightInKg * KG_TO_LBS;
    }
    
    // Round to 1 decimal place to avoid messy numbers
    const formattedValue = Math.round(convertedValue * 10) / 10;
    
    return showUnit ? `${formattedValue} ${unitPreference}` : formattedValue;
  };

  /**
   * Convert an input value (which is in user's preferred unit)
   * BACK to kg for saving in the database.
   */
  const convertToKg = (inputValue) => {
    if (inputValue == null) return 0;
    
    if (unitPreference === 'lbs') {
      return inputValue / KG_TO_LBS;
    }
    return inputValue; // already kg
  };

  return { unitPreference, displayWeight, convertToKg };
};
