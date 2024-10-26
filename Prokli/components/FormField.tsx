import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";

import { icons } from "../constants";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-800 font-dshadow">{title}</Text>

      <View className="w-full h-16 px-4 bg-white-200 rounded-2xl border-2  border-black focus:border-gray-500  flex flex-row items-center">
        <TextInput
          className="flex-1 text-black font-psemibold text-base"
          value={value}  
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={title === 'Mot de passe' && !showPassword}
          {...props}
        />

        {title === 'Mot de passe' && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-8 h-8 "
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;