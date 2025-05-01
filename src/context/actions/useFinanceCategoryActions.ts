
import { FinanceCategory } from '@/types';

interface UseFinanceCategoryActionsProps {
  financeCategories: FinanceCategory[];
  setFinanceCategories: React.Dispatch<React.SetStateAction<FinanceCategory[]>>;
}

export const useFinanceCategoryActions = ({
  financeCategories,
  setFinanceCategories
}: UseFinanceCategoryActionsProps) => {
  
  const addFinanceCategory = (category: Omit<FinanceCategory, "id">): FinanceCategory => {
    const newCategory: FinanceCategory = {
      ...category,
      id: `category-${Date.now()}`
    };
    
    setFinanceCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  const updateFinanceCategory = (id: string, category: Partial<FinanceCategory>) => {
    let updated = false;
    setFinanceCategories(prev => 
      prev.map(c => {
        if (c.id === id) {
          updated = true;
          return { ...c, ...category };
        }
        return c;
      })
    );
    return updated;
  };

  const deleteFinanceCategory = (id: string) => {
    let deleted = false;
    setFinanceCategories(prev => {
      const filtered = prev.filter(c => {
        if (c.id === id) {
          deleted = true;
          return false;
        }
        return true;
      });
      return filtered;
    });
    return deleted;
  };

  return {
    addFinanceCategory,
    updateFinanceCategory,
    deleteFinanceCategory
  };
};
