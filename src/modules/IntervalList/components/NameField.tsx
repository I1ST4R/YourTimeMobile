import { Control, Controller, FieldErrors } from "react-hook-form";
import { Text, TextInput, View } from "react-native";
import tw from 'twrnc';
import { FormIntervalType } from "../interval/intervalStorage";

type NameFieldProps = {
  control: Control<FormIntervalType, any, FormIntervalType>
  errors: FieldErrors<FormIntervalType>
}

export const NameField = ({control, errors} : NameFieldProps) => {
  return (
    <View style={tw`mb-2`}>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              style={[
                tw`w-full bg-gray-100 rounded-lg px-3 py-2 text-base font-bold`,
                errors.name && tw`border border-red-500`,
              ]}
              placeholder="Название"
              placeholderTextColor="#808080"
            />
            {errors.name && (
              <Text style={tw`text-red-500 text-xs mt-1`}>
                {errors.name.message}
              </Text>
            )}
          </>
        )}
      />
    </View>
  );
};
