import { use, useEffect } from 'react'
import { View, Text,} from 'react-native';
import { globalStyles } from '../../theme/globalStyles';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation'

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
    
        useEffect(() => {
            const timer = setTimeout(() => {
                navigation.navigate('Login');
            }, 3000);

            return () => clearTimeout(timer)
        }, []);

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>
                MovieHub
            </Text>
        </View>
    );
}