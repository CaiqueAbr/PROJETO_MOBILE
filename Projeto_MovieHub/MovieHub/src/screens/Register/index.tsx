import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { ActionButton, Brand, Page, ui } from '../../components/MovieHubUI';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError('');
    setBusy(true);
    try {
      await signUp(name.trim(), email.trim(), password);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível criar a conta.');
    } finally {
      setBusy(false);
    }
  }

  return <Page>
    <View style={ui.authCard}>
      <Brand />
      <Text style={[ui.subtitle, { marginTop: 10, marginBottom: 10 }]}>Crie sua conta para participar da comunidade.</Text>
      <Text style={ui.label}>Nome</Text>
      <TextInput style={ui.input} placeholder="Como podemos chamar você?" placeholderTextColor="#817A8D" value={name} onChangeText={setName} />
      <Text style={ui.label}>E-mail</Text>
      <TextInput style={ui.input} placeholder="voce@email.com" placeholderTextColor="#817A8D" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <Text style={ui.label}>Senha</Text>
      <TextInput style={ui.input} placeholder="Pelo menos 8 caracteres" placeholderTextColor="#817A8D" secureTextEntry value={password} onChangeText={setPassword} onSubmitEditing={submit} />
      {error ? <Text accessibilityRole="alert" style={ui.error}>{error}</Text> : null}
      <View style={{ marginTop: 20 }}><ActionButton title={busy ? 'Criando conta...' : 'Criar conta'} onPress={submit} disabled={busy || !name || !email || password.length < 8} /></View>
      <Pressable onPress={() => navigation.navigate('Login')} style={{ paddingTop: 20 }}><Text style={{ color: '#D5CEDE', textAlign: 'center' }}>Já tem conta? <Text style={{ color: '#F2B90C', fontWeight: '800' }}>Entrar</Text></Text></Pressable>
    </View>
  </Page>;
}
