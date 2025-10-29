import { FieldErrors, UseFormWatch } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import tw from 'twrnc';
import { FormIntervalType } from "../interval/intervalStorage";

type CategoryFieldProps = {
  watch: UseFormWatch<FormIntervalType>
  errors: FieldErrors<FormIntervalType> 
  setIsSelectOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const CategoryField = ({
  watch, 
  errors,
  setIsSelectOpen
}: CategoryFieldProps) => {
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
    </View>
  );
};
