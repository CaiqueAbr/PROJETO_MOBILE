import { View, Text } from 'react-native';
import { globalStyles } from '../../theme/globalStyles';

export function MovieEditScreen() {
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>
                Editar Filme
            </Text>
        </View>
    );
}