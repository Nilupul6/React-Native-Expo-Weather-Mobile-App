import { View, Text, StatusBar, Image, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native";
import { theme } from "../theme";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { MapPinIcon, CalendarDaysIcon } from "react-native-heroicons/solid";
import { useCallback, useEffect, useState } from "react";
import { debounce } from 'lodash';
import { fetchWeatherForecast, fetchWeatherLocation } from "../api/weather";
import { weatherImages } from "../constants";
import * as Progress from 'react-native-progress';
import { storeData, getData } from "../utils/asyncStorage";

const HomeScreen = () => {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocation] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  const handleLocations = (loc) => {
    toggleSearch(false);
    setLocation([]);
    setLoading(true);
    fetchWeatherForecast({
      cityName: loc.name,
      days: '7'
    }).then(data => {
      setWeather(data);
      setLoading(false);
      storeData('city', loc.name);
    });
  };

  const handleSearch = value => {
    if (value.length > 2) {
      fetchWeatherLocation({ cityName: value }).then(data => {
        setLocation(data);
      });
    }
  };

  useEffect(() => {
    fetchMyWeatherData();
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardOpen(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardOpen(false)
    );

    // Cleanup event listeners
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const fetchMyWeatherData = async () => {
    let myCity = await getData('city');
    let cityName = 'Colombo';
    if (myCity) cityName = myCity;
    fetchWeatherForecast({
      cityName,
      days: '7'
    }).then(data => {
      setWeather(data);
      setLoading(false);
    });
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 500), []);

  const { current, location } = weather;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 relative">
        <StatusBar style="light" />
        <Image blurRadius={50} source={require("../assets/images/bg.png")} className="absolute h-full w-full z-0" />
        {
          loading ? (
            <View className="flex-1 flex-row justify-center items-center">
              <Progress.CircleSnail indeterminateAnimationDuration={500} thickness={10} size={140} color="#0bb3b2" />
            </View>
          ) : (
            <SafeAreaView className="flex flex-1">
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : null}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
              >
                <View style={{ height: '7%' }} className="mx-4 relative z-50 mb-8">
                  <View className="flex-row justify-end items-center rounded-full"
                    style={{ backgroundColor: showSearch ? theme.bgwhite(0.2) : 'transparent', position: 'absolute', width: '100%' }}
                  >
                    {
                      showSearch ? (
                        <TextInput
                          onChangeText={handleTextDebounce}
                          placeholder="Search City"
                          placeholderTextColor={'lightgray'}
                          className="pl-6 h-10 pb-1 flex-1 text-base text-white"
                        />
                      ) : null
                    }
                    <TouchableOpacity
                      onPress={() => {
                        toggleSearch(!showSearch);
                      }}
                      style={{ backgroundColor: theme.bgwhite(0.3) }}
                      className="rounded-full p-3 m-1"
                    >
                      <MagnifyingGlassIcon size="25" color="white" />
                    </TouchableOpacity>
                    {
                      locations.length > 0 && showSearch && keyboardOpen ? (
                        <View className={`absolute w-full bg-gray-300 top-16 rounded-3xl`}>
                          {
                            locations.map((loc, index) => {
                              let showBorder = index + 1 != locations.length;
                              let borderClass = showBorder ? 'border-b-2 border-b-gray-400' : '';
                              return (
                                <TouchableOpacity
                                  onPress={() => handleLocations(loc)}
                                  key={index}
                                  className={"flex-row items-center border-0 p-3 px-4 mb-1" + borderClass}
                                >
                                  <MapPinIcon size="20" color="gray" />
                                  <Text>{loc?.name}, {loc?.country}</Text>
                                </TouchableOpacity>
                              )
                            })
                          }
                        </View>
                      ) : null
                    }
                  </View>
                </View>

                <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
                  <View className="mx-4 flex justify-around flex-1 mb-2">
                    <Text className="text-white text-center text-2xl font-bold">
                      {location?.name}
                      <Text className="text-lg font-semibold text-gray-400">
                        {"    " + location?.country}
                      </Text>
                    </Text>
                    <View className="flex-row justify-center">
                      <Image
                        source={weatherImages[current?.condition?.text]}
                        className="w-52 h-52"
                      />
                    </View>
                    <View className="space-y-2 mb-7">
                      <Text className="text-center font-bold text-white text-6xl ml-5">
                        {current?.temp_c}&#176;
                      </Text>
                      <Text className="text-center text-white text-xl tracking-widest">
                        {current?.condition?.text}
                      </Text>
                    </View>
                    <View className="flex-row justify-between mx-4 mb-3">
                      <View className="flex-row space-x-2 items-center">
                        <Image source={require('../assets/icons/wind.png')} className="w-6 h-6" />
                        <Text className="text-white font-semibold text-base">
                          {current?.wind_kph}km
                        </Text>
                      </View>
                      <View className="flex-row space-x-2 items-center">
                        <Image source={require('../assets/icons/drop.png')} className="w-6 h-6" />
                        <Text className="text-white font-semibold text-base">
                          {current?.humidity}%
                        </Text>
                      </View>
                      <View className="flex-row space-x-2 items-center">
                        <Image source={require('../assets/icons/sun.png')} className="w-6 h-6" />
                        <Text className="text-white font-semibold text-base">
                          {weather?.forecast?.forecastday[0]?.astro?.sunrise}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="mb-2 space-y-3">
                    <View className="flex-row items-center mx-5 space-x-2">
                      <CalendarDaysIcon size='22' color='white' />
                      <Text className="text-white text-base">Daily forecast</Text>
                    </View>
                    <ScrollView
                      horizontal
                      contentContainerStyle={{ paddingHorizontal: 15 }}
                      showsHorizontalScrollIndicator={false}
                    >
                      {
                        weather?.forecast?.forecastday?.map((item, index) => {
                          let date = new Date(item.date);
                          let option = { weekday: 'long' };
                          let dayName = date.toLocaleDateString('en-US', option);
                          dayName = dayName.split(',')[0]
                          return (
                            <View
                              key={index}
                              className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                              style={{ backgroundColor: theme.bgwhite(0.15) }}
                            >
                              <Image
                                source={{ uri: 'http:' + item?.day?.condition?.icon }}
                                className="h-11 w-11"
                              />
                              <Text className="text-white">{dayName}</Text>
                              <Text className="text-white text-xl font-semibold">{item?.day?.avgtemp_c}&#176;</Text>
                            </View>
                          )
                        })
                      }
                    </ScrollView>
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </SafeAreaView>
          )
        }
      </View>
    </TouchableWithoutFeedback>
  );
};

export default HomeScreen;
