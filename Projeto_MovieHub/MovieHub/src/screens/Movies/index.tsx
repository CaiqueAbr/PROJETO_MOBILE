import { useCallback, useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { api, type Movie } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { ActionButton, AppHeader, Loading, MovieCard, Page, ui } from '../../components/MovieHubUI';

type Props = NativeStackScreenProps<RootStackParamList, 'Movies'>;

export function MoviesScreen({ navigation }: Props) {
  const { session, signOut } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [catalog, favorites] = await Promise.all([
        api.listMovies(search),
        session ? api.listFavorites(session.token).catch(() => ({ items: [] as Movie[] })) : Promise.resolve({ items: [] as Movie[] }),
      ]);
      setMovies(catalog.items);
      setFavoriteIds(favorites.items.map((movie) => movie.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível carregar o catálogo.');
    } finally {
      setLoading(false);
    }
  }, [search, session]);

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [load]);

  async function toggleFavorite(movie: Movie) {
    if (!session) {
      setError('Entre na sua conta para salvar favoritos.');
      return;
    }
    setError('');
    try {
      if (favoriteIds.includes(movie.id)) {
        await api.removeFavorite(movie.id, session.token);
        setFavoriteIds((ids) => ids.filter((id) => id !== movie.id));
      } else {
        await api.addFavorite(movie.id, session.token);
        setFavoriteIds((ids) => [...ids, movie.id]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível atualizar os favoritos.');
    }
  }

  function logout() {
    signOut();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  }

  return <Page>
    <AppHeader name={session?.user.name || ''} onHome={() => navigation.navigate('Home')} onCatalog={() => navigation.navigate('Movies')} onFavorites={() => navigation.navigate('Favorites')} onAdd={() => navigation.navigate('MovieCreate')} onSignOut={session ? logout : () => navigation.navigate('Login')} />
    <Text style={ui.title}>Catálogo de filmes</Text>
    <Text style={ui.subtitle}>Busque por título, diretor ou gênero. Abra um filme para ver detalhes e deixar sua avaliação.</Text>
    <TextInput style={ui.input} placeholder="Buscar filmes..." placeholderTextColor="#817A8D" value={search} onChangeText={setSearch} />
    <View style={[ui.row, { marginTop: 14 }]}>
      <Text style={[ui.muted, { flex: 1, alignSelf: 'center' }]}>{movies.length} {movies.length === 1 ? 'filme encontrado' : 'filmes encontrados'}</Text>
      <ActionButton title="+ Cadastrar filme" onPress={() => navigation.navigate('MovieCreate')} />
    </View>
    {error ? <Text style={ui.error}>{error}</Text> : null}
    {loading ? <Loading /> : movies.length ? <View style={[ui.movieGrid, { marginTop: 20 }]}>
      {movies.map((movie) => <MovieCard key={movie.id} movie={movie} favorite={favoriteIds.includes(movie.id)} onFavorite={() => toggleFavorite(movie)} onPress={() => navigation.navigate('MovieDetails', { movieId: movie.id })} />)}
    </View> : <View style={[ui.card, { marginTop: 20, padding: 22 }]}>
      <Text style={ui.cardTitle}>{search ? 'Nenhum resultado' : 'Nenhum filme cadastrado ainda'}</Text>
      <Text style={ui.muted}>{search ? 'Tente outro título, diretor ou gênero.' : 'Cadastre um filme e ele aparecerá neste catálogo.'}</Text>
    </View>}
  </Page>;
}
