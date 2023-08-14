import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator // loading spinner
} from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { getGridPoint, getForecastData } from '../requests/weather.requests';

export default function ForecastList() {
    const navigation = useNavigation();
    const [forecast, setForecast] = useState([]);
    const [location, setLocation] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getLocation();
    }, []);

    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log('permission not granted');
            return;
        }
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
    }

    useEffect(() => {
        if (location && location.coords) {
            getWeatherData();
        }
    }, [location]);

    const getWeatherData = async () => {
        let forecastUrl = await getGridPoint(location);
        let forecastData = await getForecastData(forecastUrl);
        setForecast(forecastData);
        setIsLoading(false); // Set loading state to false after fetching
    }

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>
                    <ActivityIndicator size="large" color="blue" />
                </Text>
            </View>
        );
    }

    return (
        <View style={{ height: '100%' }}>
            <Text>{JSON.stringify(location)}</Text>
            <FlatList
                data={forecast}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={{ padding: 20, borderColor: 'gray', borderBottomWidth: 1 }}
                        onPress={() => {
                            console.log('You pressed a button!');
                            //                    name     props
                            navigation.navigate('Details', item);
                        }}
                    >
                        <Text>{item.name} {item.temperature}</Text>
                    </TouchableOpacity>
                )}
                style={{ width: '100%' }}
            />
        </View>
    );
}
