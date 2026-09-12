import { View, Text } from 'react-native';
import { globalStyles } from '../../theme/globalStyles';

export function RegisterScreen() {
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Cadastro de Usuário
            </Text>
        </View>
    );
}