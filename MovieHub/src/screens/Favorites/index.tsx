import { View, Text } from 'react-native';
import { globalStyles } from '../../theme/globalStyles';

export function FavoritesScreen() {
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>
                Seus favoritos
            </Text>
        </View>
    );
}