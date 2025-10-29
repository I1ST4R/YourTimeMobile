import { FieldErrors, UseFormSetValue, UseFormTrigger, UseFormWatch } from 'react-hook-form';
import { Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';
import { FormIntervalType } from '../interval/intervalStorage';
import { CategorySelector } from '../../CategorySelector/CategorySelector';
import { useState } from 'react';

type CategoryFieldProps = {
  watch: UseFormWatch<FormIntervalType>
  errors: FieldErrors<FormIntervalType>
  setValue: UseFormSetValue<FormIntervalType>
  trigger: UseFormTrigger<FormIntervalType>
}

export const CategoryField = ({
  watch,
  errors,
  setValue,
  trigger,
}: CategoryFieldProps) => {

  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const handleChangeCategory = (value: string) => {
    setValue('category', value, { shouldValidate: true });
    trigger('category');
  };

  return (
    <View style={tw`mb-2`}>
      <TouchableOpacity
        onPress={() => setIsSelectOpen(true)}
        style={[
          tw`w-full bg-gray-100 rounded-lg px-3 py-2`,
          errors.category && tw`border border-red-500`,
        ]}
      >
        <Text style={tw`text-sm text-gray-600 text-left`}>
          {watch('category') || 'Категория'}
        </Text>
      </TouchableOpacity>
      {errors.category && (
        <Text style={tw`text-red-500 text-xs mt-1`}>
          {errors.category.message}
        </Text>
      )}

      <CategorySelector
        onCategoryChange={handleChangeCategory}
        setIsOpen={setIsSelectOpen}
        isOpen={isSelectOpen}
      />
    </View>
  );
};
