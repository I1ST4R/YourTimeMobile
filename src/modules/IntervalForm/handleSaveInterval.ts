import { FormIntervalType } from "../../shared/storage";

export const handleSaveInterval = async (intervalData: FormIntervalType): Promise<void> => {
  try {
    let success: boolean;
    
    if (editingInterval) {
      success = await TimeIntervalStorage.updateInterval(editingInterval.id, intervalData);
    } else {
      success = await TimeIntervalStorage.addInterval(intervalData);
    }

    if (success) await loadIntervals(); 
  } catch (error) {
    console.error('Error saving interval:', error);
  }
};