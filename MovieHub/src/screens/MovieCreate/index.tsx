import { View, Text } from 'react-native';
import { globalStyles } from '../../theme/globalStyles';

export function MovieCreateScreen() {
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>
                Cadastro de Filme
            </Text>
        </View>
    );
}