import { Text, TouchableOpacity, View } from "react-native";
import tw from 'twrnc';

type ModeSwictherProps = {
  analysisMode: "category" | "single",
  setAnalysisMode: React.Dispatch<React.SetStateAction<"category" | "single">>
}

export const ModeSwitcher = ({
  analysisMode, setAnalysisMode
} : ModeSwictherProps) => {
  return (
    <View style={tw`flex-row justify-center mb-4 mx-4`}>
      <TouchableOpacity
        style={[
          tw`px-6 py-3 mx-2 rounded-lg border flex-1`,
          analysisMode === 'category'
            ? tw`bg-blue-500 border-blue-500`
            : tw`bg-white border-gray-300`,
        ]}
        onPress={() => setAnalysisMode('category')}
      >
        <Text
          style={
            analysisMode === 'category'
              ? tw`text-white font-medium text-center`
              : tw`text-gray-700 text-center`
          }
        >
          По категориям
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          tw`px-6 py-3 mx-2 rounded-lg border flex-1`,
          analysisMode === 'single'
            ? tw`bg-blue-500 border-blue-500`
            : tw`bg-white border-gray-300`,
        ]}
        onPress={() => setAnalysisMode('single')}
      >
        <Text
          style={
            analysisMode === 'single'
              ? tw`text-white font-medium text-center`
              : tw`text-gray-700 text-center`
          }
        >
          По одной категории
        </Text>
      </TouchableOpacity>
    </View>
  );
};
