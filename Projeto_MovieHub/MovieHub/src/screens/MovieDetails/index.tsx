import { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { api, type Movie } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { ActionButton, AppHeader, Loading, Page, ui } from '../../components/MovieHubUI';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'MovieDetails'>;

export function MovieDetailsScreen({ navigation, route }: Props) {
  const { session, signOut } = useAuth();
  const { movieId } = route.params;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);
  const [favorite, setFavorite] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const detail = await api.getMovie(movieId);
      setMovie(detail);
      if (session) {
        const favorites = await api.listFavorites(session.token);
        setFavorite(favorites.items.some((item) => item.id === movieId));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível carregar o filme.');
    } finally {
      setLoading(false);
    }
  }, [movieId, session]);

  useEffect(() => { load(); }, [load]);

  async function toggleFavorite() {
    if (!session) {
      navigation.navigate('Login');
      return;
    }
    setError('');
    try {
      if (favorite) await api.removeFavorite(movieId, session.token);
      else await api.addFavorite(movieId, session.token);
      setFavorite(!favorite);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível atualizar os favoritos.');
    }
  }

  async function submitReview() {
    if (!session) {
      navigation.navigate('Login');
      return;
    }
    setError('');
    setBusy(true);
    try {
      await api.createReview(movieId, { rating, comment: comment.trim() }, session.token);
      setComment('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível enviar sua avaliação.');
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    signOut();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  }

  const ownReview = movie?.reviews?.some((review) => review.userId === session?.user.id);

  return <Page>
    <AppHeader name={session?.user.name || ''} onHome={() => navigation.navigate('Home')} onCatalog={() => navigation.navigate('Movies')} onFavorites={() => navigation.navigate('Favorites')} onAdd={() => navigation.navigate('MovieCreate')} onSignOut={session ? logout : () => navigation.navigate('Login')} />
    {loading ? <Loading label="Buscando os detalhes..." /> : error && !movie ? <Text style={ui.error}>{error}</Text> : movie ? <>
      <View style={[ui.row, { alignItems: 'flex-start', flexWrap: 'wrap' }]}>
        {movie.posterUrl ? <Image source={{ uri: movie.posterUrl }} style={ui.detailPoster} resizeMode="cover" /> : <View style={[ui.detailPoster, { justifyContent: 'center', alignItems: 'center' }]}><MaterialCommunityIcons name="movie-open-outline" size={72} color={colors.primary} /></View>}
        <View style={{ flex: 1, minWidth: 260, paddingVertical: 8 }}>
          <Text style={[ui.muted, { color: colors.primary, fontWeight: '800' }]}>{[movie.releaseYear, movie.genre].filter(Boolean).join(' · ')}</Text>
          <Text style={[ui.title, { marginTop: 7 }]}>{movie.title}</Text>
          <Text style={ui.muted}>{movie.director ? `Direção: ${movie.director}` : 'Diretor não informado'}</Text>
          <Text style={{ color: colors.primary, fontSize: 19, fontWeight: '800', marginTop: 14 }}>★ {Number(movie.averageRating || 0).toFixed(1)} <Text style={ui.muted}>({movie.reviewCount} avaliações)</Text></Text>
          <Text style={[ui.subtitle, { marginTop: 15 }]}>{movie.synopsis || 'Sinopse não informada.'}</Text>
          <View style={ui.row}>
            <ActionButton title={favorite ? '♥ Salvo nos favoritos' : '♡ Favoritar'} variant="secondary" onPress={toggleFavorite} />
            {session?.user.id === movie.createdBy ? <ActionButton title="Editar filme" onPress={() => navigation.navigate('MovieEdit', { movieId })} /> : null}
            {session?.user.id === movie.createdBy ? <ActionButton title="Excluir" variant="danger" onPress={() => navigation.navigate('MovieDelete', { movieId })} /> : null}
          </View>
        </View>
      </View>

      <Text style={ui.sectionTitle}>Avaliações da comunidade</Text>
      {session ? <View style={[ui.card, { padding: 18, marginBottom: 18 }]}>
        <Text style={ui.cardTitle}>{ownReview ? 'Sua avaliação' : 'Deixe sua avaliação'}</Text>
        {ownReview ? <Text style={ui.muted}>Você já avaliou este filme. Obrigado por participar!</Text> : <>
          <View style={[ui.row, { marginTop: 12, gap: 5 }]}>{[1, 2, 3, 4, 5].map((value) => <Pressable key={value} accessibilityRole="button" accessibilityLabel={`Nota ${value}`} onPress={() => setRating(value)} style={{ paddingVertical: 5, paddingRight: 5 }}><Text style={{ color: value <= rating ? colors.primary : '#655E70', fontSize: 28 }}>★</Text></Pressable>)}</View>
          <TextInput style={[ui.input, ui.inputMultiline, { marginTop: 8 }]} placeholder="O que você achou? (opcional)" placeholderTextColor="#817A8D" multiline maxLength={2000} value={comment} onChangeText={setComment} />
          <View style={{ marginTop: 12, alignSelf: 'flex-start' }}><ActionButton title={busy ? 'Enviando...' : 'Publicar avaliação'} onPress={submitReview} disabled={busy} /></View>
        </>}</View> : <Text style={[ui.muted, { marginBottom: 18 }]}>Entre para avaliar este filme.</Text>}
      {error ? <Text style={ui.error}>{error}</Text> : null}
      {movie.reviews?.length ? movie.reviews.map((review) => <View key={review.id} style={ui.reviewCard}>
        <View style={[ui.row, { justifyContent: 'space-between' }]}><Text style={ui.cardTitle}>{review.userName}</Text><Text style={{ color: colors.primary, fontWeight: '800' }}>★ {review.rating}/5</Text></View>
        {review.comment ? <Text style={[ui.muted, { marginTop: 7 }]}>{review.comment}</Text> : <Text style={[ui.muted, { marginTop: 7 }]}>Sem comentário.</Text>}
      </View>) : <Text style={ui.muted}>Ainda não há avaliações para este filme.</Text>}
    </> : null}
  </Page>;
}
