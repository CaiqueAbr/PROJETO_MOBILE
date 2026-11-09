import { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { api, type Movie } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { ActionButton, AppHeader, Loading, Page, ui } from '../../components/MovieHubUI';

type Props = NativeStackScreenProps<RootStackParamList, 'MovieEdit'>;

export function MovieEditScreen({ navigation, route }: Props) {
  const { session, signOut } = useAuth();
  const { movieId } = route.params;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [director, setDirector] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.getMovie(movieId).then((data) => {
      setMovie(data); setTitle(data.title); setSynopsis(data.synopsis || '');
      setYear(data.releaseYear ? String(data.releaseYear) : ''); setGenre(data.genre || '');
      setDirector(data.director || ''); setPosterUrl(data.posterUrl || '');
    }).catch((err) => setError(err instanceof Error ? err.message : 'Não foi possível carregar o filme.'));
  }, [movieId]);

  async function submit() {
    if (!session || !movie) return;
    setError(''); setBusy(true);
    try {
      await api.updateMovie(movieId, { title: title.trim(), synopsis: synopsis.trim(), releaseYear: year ? Number(year) : null, genre: genre.trim(), director: director.trim(), posterUrl: posterUrl.trim() }, session.token);
      navigation.replace('MovieDetails', { movieId });
    } catch (err) { setError(err instanceof Error ? err.message : 'Não foi possível salvar as alterações.'); }
    finally { setBusy(false); }
  }

  function logout() {
    signOut(); navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  }

  return <Page>
    <AppHeader name={session?.user.name || ''} onHome={() => navigation.navigate('Home')} onCatalog={() => navigation.navigate('Movies')} onFavorites={() => navigation.navigate('Favorites')} onAdd={() => navigation.navigate('MovieCreate')} onSignOut={session ? logout : () => navigation.navigate('Login')} />
    <Text style={ui.title}>Editar filme</Text>
    {error ? <Text style={ui.error}>{error}</Text> : null}
    {!movie && !error ? <Loading /> : movie ? <>
      <Text style={ui.label}>Título *</Text><TextInput style={ui.input} value={title} onChangeText={setTitle} />
      <View style={[ui.row, { alignItems: 'flex-start' }]}>
        <View style={{ flex: 1, minWidth: 170 }}><Text style={ui.label}>Ano</Text><TextInput style={ui.input} keyboardType="number-pad" maxLength={4} value={year} onChangeText={setYear} /></View>
        <View style={{ flex: 1, minWidth: 170 }}><Text style={ui.label}>Gênero</Text><TextInput style={ui.input} value={genre} onChangeText={setGenre} /></View>
      </View>
      <Text style={ui.label}>Direção</Text><TextInput style={ui.input} value={director} onChangeText={setDirector} />
      <Text style={ui.label}>Sinopse</Text><TextInput style={[ui.input, ui.inputMultiline]} multiline value={synopsis} onChangeText={setSynopsis} />
      <Text style={ui.label}>URL do pôster</Text><TextInput style={ui.input} autoCapitalize="none" value={posterUrl} onChangeText={setPosterUrl} />
      <View style={[ui.row, { marginTop: 22 }]}><ActionButton title={busy ? 'Salvando...' : 'Salvar alterações'} onPress={submit} disabled={busy || !title.trim()} /><ActionButton title="Cancelar" variant="secondary" onPress={() => navigation.goBack()} /></View>
    </> : null}
  </Page>;
}
