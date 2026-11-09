import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { ActionButton, Brand, Page, ui } from '../../components/MovieHubUI';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError('');
    setBusy(true);
    try {
      await signIn(email.trim(), password);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar.');
    } finally {
      setBusy(false);
    }
  }

  return <Page>
    <View style={ui.authCard}>
      <Brand />
      <Text style={[ui.subtitle, { marginTop: 10, marginBottom: 10 }]}>Entre para descobrir, avaliar e salvar filmes.</Text>
      <Text style={ui.label}>E-mail</Text>
      <TextInput style={ui.input} placeholder="voce@email.com" placeholderTextColor="#817A8D" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <Text style={ui.label}>Senha</Text>
      <TextInput style={ui.input} placeholder="Mínimo de 8 caracteres" placeholderTextColor="#817A8D" secureTextEntry value={password} onChangeText={setPassword} onSubmitEditing={submit} />
      {error ? <Text accessibilityRole="alert" style={ui.error}>{error}</Text> : null}
      <View style={{ marginTop: 20 }}><ActionButton title={busy ? 'Entrando...' : 'Entrar'} onPress={submit} disabled={busy || !email || !password} /></View>
      <Pressable onPress={() => navigation.navigate('Register')} style={{ paddingTop: 20 }}><Text style={{ color: '#D5CEDE', textAlign: 'center' }}>Ainda não tem conta? <Text style={{ color: '#F2B90C', fontWeight: '800' }}>Criar conta</Text></Text></Pressable>
      <Text style={[ui.muted, { textAlign: 'center', marginTop: 22 }]}>Sua conta conecta este app à API local do MovieHub.</Text>
    </View>
  </Page>;
}
