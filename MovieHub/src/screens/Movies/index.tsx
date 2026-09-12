import { View, Text } from 'react-native';
import { globalStyles } from '../../theme/globalStyles';

export function MoviesScreen() {
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>
                Filmes
            </Text>
        </View>
    );
}