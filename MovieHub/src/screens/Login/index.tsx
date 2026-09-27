import { View, Text,TextInput, TouchableOpacity } from 'react-native';
import styles from './styles';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors'
import { useState } from 'react';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({navigation}: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Movie<Text style={{color: colors.primary}}>Hub</Text>
        </Text>
        <Text style={styles.subtitle}>Faça login para continuar</Text>

        <View style={styles.form}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor="#8e8286"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />
            <Text style={styles.label}>Senha</Text>
            <TextInput
            style={styles.input}
                placeholder='******'
                placeholderTextColor="#8e8286"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Text style={{ color: '#4da3ff', marginTop: 20}}>Entrar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Text  style={{ color: '#ffffff', marginTop: 20}}> Criar uma conta</Text>
            </TouchableOpacity>
        </View>
    </View>

    
    );
}