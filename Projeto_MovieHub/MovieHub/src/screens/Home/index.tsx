import { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { api, type Movie } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { ActionButton, AppHeader, Loading, MovieCard, Page, ui } from '../../components/MovieHubUI';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { session, signOut } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setMovies((await api.listMovies()).items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível carregar o catálogo.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function logout() {
    signOut();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  }

  return <Page>
    <AppHeader name={session?.user.name || ''} onHome={() => navigation.navigate('Home')} onCatalog={() => navigation.navigate('Movies')} onFavorites={() => navigation.navigate('Favorites')} onAdd={() => navigation.navigate('MovieCreate')} onSignOut={session ? logout : () => navigation.navigate('Login')} />
    <Text style={[ui.muted, { color: '#F2B90C', fontWeight: '800', letterSpacing: 1.4, textTransform: 'uppercase' }]}>Sua comunidade de cinema</Text>
    <Text style={[ui.title, { fontSize: 42, maxWidth: 680, marginTop: 8 }]}>Filmes que ficam com você.</Text>
    <Text style={[ui.subtitle, { maxWidth: 620, marginTop: 6 }]}>Descubra títulos, registre suas opiniões e encontre seu próximo favorito.</Text>
    <View style={[ui.row, { marginBottom: 10 }]}>
      <ActionButton title="Explorar filmes" onPress={() => navigation.navigate('Movies')} />
      <ActionButton title="Cadastrar um filme" variant="secondary" onPress={() => navigation.navigate('MovieCreate')} />
    </View>
    <Text style={ui.sectionTitle}>Catálogo recente</Text>
    {loading ? <Loading /> : error ? <Text style={ui.error}>{error}</Text> : movies.length ? <View style={ui.movieGrid}>
      {movies.slice(0, 6).map((movie) => <MovieCard key={movie.id} movie={movie} onPress={() => navigation.navigate('MovieDetails', { movieId: movie.id })} />)}
    </View> : <View style={[ui.card, { padding: 22 }]}>
      <Text style={ui.cardTitle}>O catálogo está começando agora</Text>
      <Text style={[ui.muted, { marginBottom: 14 }]}>Cadastre o primeiro filme para ele aparecer aqui e ficar salvo no banco.</Text>
      <ActionButton title="Cadastrar primeiro filme" onPress={() => navigation.navigate('MovieCreate')} />
    </View>}
    {!loading && !error && movies.length > 6 ? <View style={{ marginTop: 18 }}><ActionButton title="Ver catálogo completo" variant="secondary" onPress={() => navigation.navigate('Movies')} /></View> : null}
  </Page>;
}
