import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { ActionButton, AppHeader, Page, ui } from '../../components/MovieHubUI';

type Props = NativeStackScreenProps<RootStackParamList, 'MovieCreate'>;

export function MovieCreateScreen({ navigation }: Props) {
  const { session, signOut } = useAuth();
  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [director, setDirector] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!session) {
      setError('Entre na sua conta antes de cadastrar um filme.');
      return;
    }
    setError('');
    setBusy(true);
    try {
      const movie = await api.createMovie({
        title: title.trim(), synopsis: synopsis.trim(), releaseYear: year ? Number(year) : null,
        genre: genre.trim(), director: director.trim(), posterUrl: posterUrl.trim(),
      }, session.token);
      navigation.replace('MovieDetails', { movieId: movie.id });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível cadastrar o filme.');
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    signOut();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  }

  return <Page>
    <AppHeader name={session?.user.name || ''} onHome={() => navigation.navigate('Home')} onCatalog={() => navigation.navigate('Movies')} onFavorites={() => navigation.navigate('Favorites')} onAdd={() => navigation.navigate('MovieCreate')} onSignOut={session ? logout : () => navigation.navigate('Login')} />
    <Text style={ui.title}>Cadastrar filme</Text>
    <Text style={ui.subtitle}>Adicione o título ao catálogo. O registro ficará salvo no banco e poderá receber avaliações.</Text>
    <Text style={ui.label}>Título *</Text>
    <TextInput style={ui.input} placeholder="Ex.: A Viagem de Chihiro" placeholderTextColor="#817A8D" value={title} onChangeText={setTitle} />
    <View style={[ui.row, { alignItems: 'flex-start' }]}>
      <View style={{ flex: 1, minWidth: 170 }}><Text style={ui.label}>Ano de lançamento</Text><TextInput style={ui.input} placeholder="2001" placeholderTextColor="#817A8D" keyboardType="number-pad" maxLength={4} value={year} onChangeText={setYear} /></View>
      <View style={{ flex: 1, minWidth: 170 }}><Text style={ui.label}>Gênero</Text><TextInput style={ui.input} placeholder="Fantasia" placeholderTextColor="#817A8D" value={genre} onChangeText={setGenre} /></View>
    </View>
    <Text style={ui.label}>Direção</Text>
    <TextInput style={ui.input} placeholder="Nome do diretor ou diretora" placeholderTextColor="#817A8D" value={director} onChangeText={setDirector} />
    <Text style={ui.label}>Sinopse</Text>
    <TextInput style={[ui.input, ui.inputMultiline]} placeholder="Sobre o que é o filme?" placeholderTextColor="#817A8D" multiline value={synopsis} onChangeText={setSynopsis} />
    <Text style={ui.label}>URL do pôster (opcional)</Text>
    <TextInput style={ui.input} placeholder="https://..." placeholderTextColor="#817A8D" autoCapitalize="none" keyboardType="url" value={posterUrl} onChangeText={setPosterUrl} />
    {error ? <Text style={ui.error}>{error}</Text> : null}
    <View style={[ui.row, { marginTop: 22 }]}>
      <ActionButton title={busy ? 'Salvando...' : 'Salvar filme'} onPress={submit} disabled={busy || !title.trim()} />
      <ActionButton title="Cancelar" variant="secondary" onPress={() => navigation.goBack()} />
    </View>
  </Page>;
}
