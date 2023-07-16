import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView,  } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AppBar from '../Components/AppBar';
import { Button, Surface } from 'react-native-paper';

const WeatherScreen = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const apiKey = process.env.WEATHER_API;
  const [translatedWeatherCondition, setTranslatedWeatherCondition] = useState('');
  const [translatedFarmActivity, setTranslatedFarmActivity] = useState('');
  const [translatedForecastDays, setTranslatedForecastDays] = useState([]);
  const [isTranslated, setIsTranslated] = useState(false);

  // Translate the weather condition
  const translateWeatherCondition = async () => {
    try {
      const payload = {
        source_language: 'English',
        target_language: 'Luganda', // Replace with the farmer's selected language
        text: currentWeather.current.condition.text,
      };

      const token = process.env.sunbird_api;

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(
        'https://sunbird-ai-api-5bq6okiwgq-ew.a.run.app/tasks/translate',
        payload,
        {
          headers: headers,
        }
      );

      if (response.status === 200) {
        const translatedText = response.data.text;
        setTranslatedWeatherCondition(translatedText);
      } else {
        console.error('Translation failed:', response.status);
      }
    } catch (error) {
      console.error('Translation request failed:', error);
    }
  };

  // Translate the farm activity
  const translateFarmActivity = async () => {
    try {
      const payload = {
        source_language: 'English',
        target_language: 'Luganda', // Replace with the farmer's selected language
        text: getFarmActivity(),
      };

      const token = process.env.sunbird_api;

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(
        'https://sunbird-ai-api-5bq6okiwgq-ew.a.run.app/tasks/translate',
        payload,
        {
          headers: headers,
        }
      );

      if (response.status === 200) {
        const translatedText = response.data.text;
        setTranslatedFarmActivity(translatedText);
      } else {
        console.error('Translation failed:', response.status);
      }
    } catch (error) {
      console.error('Translation request failed:', error);
    }
  };

  // Translate the forecast days
  const translateForecastDays = async () => {
    try {
      const translatedDays = await Promise.all(
        forecast.forecast.forecastday.map(async (day) => {
          const payload = {
            source_language: 'English',
            target_language: 'Luganda', // Replace with the farmer's selected language
            text: day.day.condition.text,
          };

          const token = process.env.sunbird_api;

          const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          };

          const response = await axios.post(
            'https://sunbird-ai-api-5bq6okiwgq-ew.a.run.app/tasks/translate',
            payload,
            {
              headers: headers,
            }
          );

          if (response.status === 200) {
            return response.data.text;
          } else {
            console.error('Translation failed:', response.status);
            return day.day.condition.text; // Use original date if translation fails
          }
        })
      );

      setTranslatedForecastDays(translatedDays);
    } catch (error) {
      console.error('Translation request failed:', error);
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&aqi=no`;

      axios
        .get(url)
        .then((response) => {
          setCurrentWeather(response.data);
        })
        .catch((error) => {
          console.error('Error fetching current weather data:', error);
        });

      const forecastUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=7`;

      axios
        .get(forecastUrl)
        .then((response) => {
          setForecast(response.data);
        })
        .catch((error) => {
          console.error('Error fetching weather forecast data:', error);
        });
    })();
  }, []);

  if (!currentWeather || !forecast) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const weatherCondition = currentWeather.current.condition.text;
  const currentTemp = currentWeather.current.temp_c;
  const forecastDays = forecast.forecast.forecastday;

  const getFarmActivity = () => {
    if (weatherCondition === 'Clear') {
      return 'It is a good time for harvesting your crops.';
    } else if (weatherCondition === 'Sunny') {
      return 'It is a sunny day, make sure to provide adequate shade and irrigation to your crops.';
    } else if (weatherCondition === 'Partly cloudy') {
      return 'The weather is suitable for planting or transplanting your crops.';
    } else if (weatherCondition === 'Cloudy') {
      return 'Consider conducting your weeding tasks during cloudy weather to avoid excessive heat.';
    } else if (weatherCondition === 'Overcast') {
      return 'It is a great time for spraying your crops to control pests and diseases.';
    } else if (
      weatherCondition === 'Light rain' ||
      weatherCondition === 'Moderate rain' ||
      weatherCondition === 'Heavy rain'
    ) {
      return 'Take advantage of the rain to plant your seeds or transplant seedlings.';
    } else if (
      weatherCondition === 'Patchy rain possible' ||
      weatherCondition === 'Patchy light rain' ||
      weatherCondition === 'Patchy moderate rain'
    ) {
      return 'There might be some rain showers, so be prepared for possible interruptions to your farm activities.';
    } else if (weatherCondition === 'Mist' || weatherCondition === 'Fog') {
      return 'The weather conditions are not suitable for outdoor farming activities. Consider focusing on indoor tasks or planning for future activities.';
    } else if (weatherCondition === 'Thunderstorm') {
      return 'Due to the thunderstorms, avoid outdoor activities and ensure that your crops are well protected.';
    } else {
      return 'Stay informed about the weather forecast for more specific farm activity recommendations.';
    }
  };

  const handleTranslation = () => {
    if (isTranslated) {
      setTranslatedWeatherCondition('');
      setTranslatedFarmActivity('');
      setTranslatedForecastDays([]);
    } else {
      translateWeatherCondition();
      translateFarmActivity();
      translateForecastDays();
    }

    setIsTranslated(!isTranslated);
  };

  return (
    <View style={{ flex: 1,}} >

        <AppBar />

        <View style={styles.container}>
      {/* AppBar */}
      <Text>Todays weather</Text>
      
      <Surface style={styles.currentWeatherContainer}  elevation={2}>
        <Text style={styles.currentTemp}>{currentTemp}°C</Text>
        <Text style={styles.weatherCondition}>{isTranslated ? translatedWeatherCondition : weatherCondition}</Text>
        <Text style={styles.farmActivity}>{isTranslated ? translatedFarmActivity : getFarmActivity()}</Text>
      </Surface>
      
      <Button icon="translate" mode="contained" onPress={handleTranslation}>
            {isTranslated ? 'Back to English' : 'Translate'}
      </Button>

      <Text>Weather forecasts</Text>

      <ScrollView contentContainerStyle={styles.forecastContainer} showsVerticalScrollIndicator={false} >
        {forecastDays.map((day, index) => (
          <Surface key={index} style={styles.forecastItem}>
            <Text style={styles.forecastDay}>{day.date}</Text>
            <Text style={styles.forecastCondition}>{ isTranslated ? translatedForecastDays[index] : day.day.condition.text}</Text>
            <Text style={styles.forecastTemp}>{day.day.maxtemp_c}°C</Text>
            <Ionicons name={getWeatherIcon(day.day.condition.code)} size={32} color="black" />
          </Surface>
        ))}
      </ScrollView>

      <StatusBar style="auto" />
      </View>
    </View>
  );
};

const getWeatherIcon = (code) => {
  // Map weather condition codes to corresponding Ionicons names
  switch (code) {
    case 1000:
      return 'sunny-outline';
    case 1003:
      return 'partly-sunny-outline';
    case 1006:
      return 'cloudy-outline';
    case 1009:
      return 'cloud-outline';
    case 1030:
    case 1135:
      return 'partly-sunny-sharp';
    case 1063:
    case 1189:
    case 1240:
      return 'rainy-outline';
    case 1066:
    case 1114:
    case 1210:
    case 1213:
      return 'snow-outline';
    case 1087:
      return 'thunderstorm-outline';
    default:
      return 'cloud-outline';
  }
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#fff',
    paddingHorizontal: 5,
    margin: 10
  },
  currentWeatherContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    padding: 10,
    
  },
  currentTemp: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  weatherCondition: {
    fontSize: 24,
    color: '#777',
  },
  farmActivity: {
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
  forecastContainer: {
    paddingBottom: 100,
  },
  forecastItem: {
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 5,
    margin: 5,
  },
  forecastDay: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  forecastCondition: {
    fontSize: 16,
    textAlign: 'center',
  },
  forecastTemp: {
    fontSize: 16,
    marginTop: 5,
  },
  translateButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  surface: {
    height: 200,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    // margin: 10,
    marginHorizontal: 5
  },
});

export default WeatherScreen;
