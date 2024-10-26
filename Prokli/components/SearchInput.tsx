import { useState } from "react";
import { View, TextInput, TouchableOpacity, Image, Alert } from "react-native";

import { icons } from "../constants";
import { router, usePathname } from "expo-router";

const SearchInput = ({initialQuery}) => {
  const pathname = usePathname()
  const [query, setQuery] = useState(initialQuery || '')


  return (
   

      <View className=" w-full
                        h-16 px-4
                        bg-white-200 
                        rounded-2xl border-2 
                        border-black-200 
                        focus:border-secondary 
                        flex flex-row items-center
                        space-x-4
                        ">
        <TextInput
          className="flex-1 text-black font-pregular text-base mt-0.5 "
          value={query}  
          placeholder="Recherche les DEFIS"
          placeholderTextColor="#555555"
          onChangeText={(e) => setQuery(e)}
          
        />

        <TouchableOpacity
          onPress={() => {
            if(!query) {
              return Alert.alert('Requête manquante' ,"Par pitié recherchez un truc ^^")
            }
            if(pathname.startsWith('/search')) router.setParams({query})
            else router.push(`/search/${query}`)
          }}
        >
            <Image source={icons.search}
                    className='w-5 h-5'
                    resizeMode="contain"
            />
        </TouchableOpacity>
      </View>
   
  );
};

export default SearchInput;