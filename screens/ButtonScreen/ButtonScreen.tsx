import React, { useState } from 'react';
import { TouchableHighlight, Text, View, Image } from 'react-native';
import tw from 'twrnc';
import prikol from "./images/Smilik_prikol.jpg"

const ButtonScreen = () => {
  const [pressing, setPressing] = useState(false);

  return (
    <View style={tw`flex-1 justify-center items-center bg-gray-100`}>
      <TouchableHighlight
        onPressIn={() => setPressing(true)}
        onPressOut={() => setPressing(false)}
      >
        {pressing ? (
          <Image source={prikol}/>
        ) : (
          <View style={tw`h-20 bg-orange-500 w-50 justify-center`}>
            <Text style={tw`text-white text-lg text-center`}>
              {pressing ? 'CLICKED' : 'CLICK'}
            </Text>
          </View>
        )}
      </TouchableHighlight>
    </View>
  );
};

export default ButtonScreen;
