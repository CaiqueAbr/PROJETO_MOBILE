import { View, Text } from 'react-native';
import { styles } from './style'

export function SplashScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                MovieHub
            </Text>
        </View>
    );
}