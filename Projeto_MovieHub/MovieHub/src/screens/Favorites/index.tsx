import { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { api, type Movie } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { ActionButton, AppHeader, Loading, MovieCard, Page, ui } from '../../components/MovieHubUI';

type Props = NativeStackScreenProps<RootStackParamList, 'Favorites'>;

export function FavoritesScreen({ navigation }: Props) {
  const { session, signOut } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    if (!session) { setMovies([]); setLoading(false); return; }
    setLoading(true);
    setError('');
    try { setMovies((await api.listFavorites(session.token)).items); }
    catch (err) { setError(err instanceof Error ? err.message : 'Não foi possível carregar os favoritos.'); }
    finally { setLoading(false); }
  }, [session]);
  useEffect(() => { load(); }, [load]);

  function logout() {
    signOut();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  }

  async function removeFavorite(movieId: number) {
    if (!session) return;
    try {
      await api.removeFavorite(movieId, session.token);
      setMovies((items) => items.filter((item) => item.id !== movieId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível atualizar os favoritos.');
    }
  }

  return <Page>
    <AppHeader name={session?.user.name || ''} onHome={() => navigation.navigate('Home')} onCatalog={() => navigation.navigate('Movies')} onFavorites={() => navigation.navigate('Favorites')} onAdd={() => navigation.navigate('MovieCreate')} onSignOut={session ? logout : () => navigation.navigate('Login')} />
    <Text style={ui.title}>Seus favoritos</Text>
    <Text style={ui.subtitle}>Filmes salvos na sua conta para encontrar depois.</Text>
    {error ? <Text style={ui.error}>{error}</Text> : null}
    {loading ? <Loading /> : movies.length ? <View style={ui.movieGrid}>{movies.map((movie) => <MovieCard key={movie.id} movie={movie} favorite onPress={() => navigation.navigate('MovieDetails', { movieId: movie.id })} onFavorite={() => removeFavorite(movie.id)} />)}</View> : <View style={[ui.card, { padding: 22 }]}>
      <Text style={ui.cardTitle}>{session ? 'Sua lista ainda está vazia' : 'Entre para ver seus favoritos'}</Text>
      <Text style={[ui.muted, { marginBottom: 14 }]}>{session ? 'Use o botão de favorito no catálogo para salvar filmes.' : 'Os favoritos são armazenados na sua conta.'}</Text>
      <ActionButton title={session ? 'Explorar catálogo' : 'Entrar'} onPress={() => navigation.navigate(session ? 'Movies' : 'Login')} />
    </View>}
  </Page>;
}
