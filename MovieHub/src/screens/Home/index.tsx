import { View, Text } from 'react-native';
import { globalStyles } from '../../theme/globalStyles';

export function HomeScreen() {
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Home
        </Text>
    </View>
    );
}