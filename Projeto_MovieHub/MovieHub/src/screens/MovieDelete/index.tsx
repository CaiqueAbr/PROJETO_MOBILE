import { useState } from 'react';
import { Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { ActionButton, AppHeader, Page, ui } from '../../components/MovieHubUI';

type Props = NativeStackScreenProps<RootStackParamList, 'MovieDelete'>;

export function MovieDeleteScreen({ navigation, route }: Props) {
  const { session, signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function remove() {
    if (!session) { setError('Entre na sua conta para excluir este filme.'); return; }
    setBusy(true); setError('');
    try { await api.deleteMovie(route.params.movieId, session.token); navigation.reset({ index: 0, routes: [{ name: 'Movies' }] }); }
    catch (err) { setError(err instanceof Error ? err.message : 'Não foi possível excluir o filme.'); }
    finally { setBusy(false); }
  }
  function logout() { signOut(); navigation.reset({ index: 0, routes: [{ name: 'Login' }] }); }

  return <Page>
    <AppHeader name={session?.user.name || ''} onHome={() => navigation.navigate('Home')} onCatalog={() => navigation.navigate('Movies')} onFavorites={() => navigation.navigate('Favorites')} onAdd={() => navigation.navigate('MovieCreate')} onSignOut={session ? logout : () => navigation.navigate('Login')} />
    <View style={[ui.card, { padding: 24, maxWidth: 620, alignSelf: 'center', marginTop: 40 }]}>
      <Text style={ui.title}>Excluir este filme?</Text>
      <Text style={ui.subtitle}>Essa ação remove o filme, as avaliações e os favoritos associados do banco de dados. Ela não pode ser desfeita.</Text>
      {error ? <Text style={ui.error}>{error}</Text> : null}
      <View style={ui.row}><ActionButton title={busy ? 'Excluindo...' : 'Sim, excluir filme'} variant="danger" onPress={remove} disabled={busy} /><ActionButton title="Manter filme" variant="secondary" onPress={() => navigation.goBack()} /></View>
    </View>
  </Page>;
}
