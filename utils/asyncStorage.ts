import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key:string, value:string) => {
    try{
        await AsyncStorage.setItem(key, value);
    } catch(err) {
        console.log(err)
    }
}

export const getData = async (key:string) => {
    try{
        const data = await AsyncStorage.getItem(key);
        return data;
    } catch(err) {
        console.log(err)
    }
}

