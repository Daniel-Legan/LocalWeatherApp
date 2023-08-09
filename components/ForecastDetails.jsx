import {
    View,
    Text,
} from 'react-native';

export default function ForecastDetails({route}) {
    return (
        <View>
            <Text>{route.params.name} {route.params.temperature}</Text>
        </View>
    );
}