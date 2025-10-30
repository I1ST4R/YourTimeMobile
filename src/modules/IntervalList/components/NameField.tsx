import { Text, TextInput, View } from "react-native";
import tw from 'twrnc';
import { useUpdateIntervalMutation } from "../slices/interval/intervalsApi";
import { intervalSchema } from "../slices/interval/intervalStorage";
import { useState } from "react";

type NameFieldProps = {
  value: string,
  intervalId: string
}

export const NameField = ({ value, intervalId } : NameFieldProps) => {
  const [updateInterval] = useUpdateIntervalMutation();
  const [name, setName] = useState(value);
  const [error, setError] = useState('');

  const handleSave = () => {
    const result = intervalSchema.pick({ name: true }).safeParse({ name });
    
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setError('');
    updateInterval({
      id: intervalId,
      interval: { name: name.trim() }
    });
  };

  return (
    <View style={tw`mb-2`}>
      <TextInput
        value={name}
        onChangeText={setName}
        onBlur={handleSave}
        style={[
          tw`w-full bg-gray-100 rounded-lg px-3 py-2 text-base font-bold`,
          error && tw`border border-red-500`,
        ]}
        placeholder="Название"
        placeholderTextColor="#808080"
      />
      {error && (
        <Text style={tw`text-red-500 text-xs mt-1`}>
          {error}
        </Text>
      )}
    </View>
  );
};