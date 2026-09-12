import { View, Text } from 'react-native';
import { globalStyles } from '../../theme/globalStyles';

export function MovieDeleteScreen() {
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>
                Deletar Filme
            </Text>
        </View>
    );
}