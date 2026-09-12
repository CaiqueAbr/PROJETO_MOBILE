import { View, Text } from 'react-native';
import { globalStyles } from '../../theme/globalStyles';

export function MovieDetailsScreen() {
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>
                Detales do Filme
            </Text>
        </View>
    );
}