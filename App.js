import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import AppNavigation from "./navigation/AppNavigation"
import React from 'react'
import { NativeWindStyleSheet } from 'nativewind';
import { enableScreens } from 'react-native-screens'
enableScreens(true);

NativeWindStyleSheet.setOutput({
default: 'native',
});

const App = () => {
  return (
    <AppNavigation/>
    // <View className=" bg-black">
    //   <SafeAreaView>
    //     <Text className=" text-red-600">HElloo</Text>
    //   </SafeAreaView>
    // </View>
  )
}

export default App