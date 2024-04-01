import { Image, SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import * as Icons from "react-native-heroicons/solid";

import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash'
import { fetchLocations, fetchWeatherForecast } from '@/api/weather';
import { getData, storeData } from '@/utils/asyncStorage';
import * as Location from 'expo-location';
import * as Network from 'expo-network';

const IMAGE_URL = "https://media.istockphoto.com/id/997539878/photo/gorgeous-sunset-on-calm-lake.jpg?s=612x612&w=0&k=20&c=hx4XOzDRxhYALbgEj-3sgtu06nBa2D2dzbtDfNdU0b8="

export default function TabOneScreen() {

  const [showSearch, toggleSearch] = useState<boolean>(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [myCitName, setMyCityName] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<any>(null);
  const handleLocation = (loc: any) => {
      setLocations([]);
      setLoading(true);
      fetchWeatherForecast({
        cityName: loc.name,
        days: '7'
      }).then( (data: any)=> {
        setWeather(data.data);
        setLoading(false)
      });
  }

  const handleSearch = (value: any) => {
    if(value.length > 2) {
      fetchLocations({cityName: value}).then( (data: any) => {
        setLocations(data.data);
      })
    }
    
    
  }

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200,), []);
  const { current, location } = weather;

  const fetchMyWeatherData = async () => {
    
    fetchWeatherForecast({
      cityName: myCitName? myCitName: 'Lusaka',
      days: '7'
    }).then( (data:any)=> {
      setLoading(false);
      setWeather(data.data)
      storeData('myApp', JSON.stringify(data.data));

    })
  }
  const handleNetwork = async () => {
  
    
  }

  useEffect(()=> {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let locationName = await Location.getCurrentPositionAsync({});
      
      let regionName = await Location.reverseGeocodeAsync({
        latitude: locationName.coords.latitude,
        longitude: locationName.coords.longitude,
      });
      if(regionName.length) {
        setMyCityName(regionName[0].city);
      }
    })();

    Network.getNetworkStateAsync().then((n: any)=>{
      fetchMyWeatherData();
      
    }).catch(async (e)=> {
       const data = await getData('myApp');
       if(data)
        setWeather(JSON.parse(data));

    });

   

  },[]);
  return (
    <View className="flex-1 relative" >
      <StatusBar style={'light'}/>
      <Image
        blurRadius={70}
        source={{
          uri: IMAGE_URL
        }}
        className="absolute h-full w-full"
      />
      {
        loading?
        <View 
          className='flex-1 flex-row justify-center bg-transparent'
        >
           <ActivityIndicator size={'large'} color="white" />
           
        </View>
        :
        <SafeAreaView className=' flex flex-1 mt-10'>
        <View style={{ height: '7%'}} className='mx-4 relative z-50 bg-transparent'>
          <View 
          className={`${showSearch? ' bg-#f5f5f5 opacity-[0.2]': ' bg-transparent'} flex-row justify-end items-center rounded-full`}
          
          >
            
            {
              showSearch?
              (
                <TextInput
                    onChangeText={handleTextDebounce}
                    className=' pl-6 h-10 flex-1 text-white '
                    placeholder='Search city'  placeholderTextColor={'#e7dcdc'}
                    />
    
              ):
              null
            }
           
            <TouchableOpacity
              style={{backgroundColor: "#cac6c6"}}
              className='rounded-full p-3 m-1'
              onPress={ ()=> toggleSearch(!showSearch)}
              >
                <Icons.MagnifyingGlassIcon  color={"white"} size={25}/>
              </TouchableOpacity>
          </View>
            {
              locations.length && showSearch?
              (
                <View className=' absolute w-full bg-gray-300 rounded-xl mt-[15%]'>
                  {
                    locations.map((loc:any, index) => {
                      return (
                        <TouchableOpacity 
                          key={index}
                          onPress={()=> handleLocation(loc)}

                          className=' flex-row items-center border-0 p-3 px-4 border-b border-b-gray-400'
                        >
                          <Icons.MapPinIcon size={20} color={'gray'}/>
                          <Text className='text-black text-lg ml-2'>{loc?.name}, {loc?.country}</Text>
                        </TouchableOpacity>
                      )
                    }) 
                  }

                </View>
              ):
              null
            }
        </View>
        
        <View className='mx-4 flex justify-around flex-1 mb-2 bg-transparent '>
            <Text className=' text-white text-center text-2xl font-bold'>
              {location?.name}, 
              <Text className=' text-lg font-semibold text-gray-300'>
                {location?.country}
              </Text>
            </Text>
        </View>

        <View
          className=' flex-row justify-center bg-transparent'
        >
         <Image
          source={require('@/assets/images/pngwing.com.png')}
          className=' w-52 h-52'
         />
        </View>

        <View className=' my-5 bg-transparent'>
            <Text className='text-center font-bold text-white text-6xl ml-5'>
              {current?.temp_c} &#176;
            </Text>
           
        </View>
          {/*More info */}
        <View className=' flex-row justify-between mx-4 bg-transparent mb-10'>
            <View className='flex-row space-x-2 items-center bg-transparent'>
              <Image
                source={require('@/assets/images/pngwing.com.png')}
                className=' w-6 h-6'
              />
              <Text className='text-white font-semibold text-base'>
                {current?.wind_kph}km
              </Text>

              
            </View>
            <View className='flex-row space-x-2 items-center bg-transparent'>
              <Image
                source={require('@/assets/images/pngwing.com.png')}
                className=' w-6 h-6'
              />
              <Text className='text-white font-semibold text-base'>
                {current?.humidity}%
              </Text>

              
            </View>

            <View className='flex-row space-x-2 items-center bg-transparent'>
              <Image
                source={require('@/assets/images/pngwing.com.png')}
                className=' w-6 h-6'
              />
              <Text className='text-white font-semibold text-base'>
                6:05AM
              </Text>

              
            </View>

        </View>

        {/*Other content*/}
        <View className='space-y-2 bg-transparent mb-10'>
            <View className='flex-row items-center mx-5 space-x-2 bg-transparent'>
              <Icons.CalendarIcon size={20} color={'white'}/>
              <Text className='text-white text-base my-5'> Daily Forecast</Text>
            </View>
            <ScrollView
              horizontal
              contentContainerStyle={{ paddingHorizontal: 15}}
              showsHorizontalScrollIndicator={false}

            >
              {
                weather?.forecast?.forecastday?.map((item:any, index: number)=> {
                  
                  let date = new Date(item.date);
                  let options = { weekday: 'long'};

                  let dayName = date.toLocaleDateString('en-US', options);
                  dayName = dayName.split(',')[0];

                  return (
                    <View key={index} className=' opacity-[0.5] flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4'>
                    <Image
                      source={require('@/assets/images/pngwing.com.png')}
                      className=' w-11 h-11'
                    />
                    <Text className='text-white'>
                      {dayName}
                    </Text>
                    
                    <Text className='text-white text-xl font-semibold'>
                    {item?.day?.avgtemp_c}&#176;
                    </Text>
                    </View>
                  )
                })
              }
             
            </ScrollView>
        </View>
      </SafeAreaView>
      }
    
    </View>
  );
}