import { use, useEffect } from 'react'
import { View, Text, ActivityIndicator } from 'react-native';
import { Image } from 'react-native'
import { styles } from './style';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation'
import { colors } from '../../theme/colors'
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
    
        useEffect(() => {
            const timer = setTimeout(() => {
                navigation.navigate('Login');
            }, 3000);

            return () => clearTimeout(timer)
        }, []);

    return (
        
            <View style={styles.container}>

                <MaterialCommunityIcons name="movie-open" 
                size={64} 
                color={colors.primary}
                style={styles.iconMovie}/>

                <Text style={styles.title}>Movie<Text style={{color: colors.primary}}>Hub</Text></Text>
                <Text style={styles.subtitle}>Gerenciador de Filmes</Text>

                <ActivityIndicator 
                    size={"large"}
                    color={colors.primary}
                    style={styles.spinner}
                    />
                <Text style={styles.textLoading}>Carregando...</Text>
                <Text style={styles.subTextLoading}>Preparando sua experiência</Text>
            </View>
    );
}