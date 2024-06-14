import AsyncStorage from '@react-native-async-storage/async-storage'

export const storeData = async (key, value) =>{
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        console.log("Error of storing value : ",error)
    }
}

export const getData = async(key) =>{
    try {
        const value = await AsyncStorage.getItem(key);
        return value;
    } catch (error) {
        console.log("Error of getting value : ",error)
    }
}