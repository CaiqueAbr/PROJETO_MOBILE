import type { ReactNode } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import type { Movie } from '../services/api';

export const ui = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#100D1B' },
  scroll: { flexGrow: 1, padding: 24, paddingBottom: 48 },
  content: { width: '100%', maxWidth: 980, alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 28 },
  brand: { color: colors.text, fontSize: 23, fontWeight: '900', letterSpacing: 0.3 },
  brandAccent: { color: colors.primary },
  headerActions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 8 },
  title: { color: colors.text, fontSize: 32, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: '#B4AEC2', fontSize: 15, lineHeight: 22, marginBottom: 22 },
  label: { color: '#DDD8E7', fontWeight: '700', fontSize: 13, marginBottom: 7, marginTop: 12 },
  input: { backgroundColor: '#1B1727', borderColor: '#332D43', borderWidth: 1, borderRadius: 12, color: colors.text, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
  inputMultiline: { minHeight: 100, textAlignVertical: 'top' },
  button: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 17, paddingVertical: 13, minHeight: 46 },
  buttonText: { color: '#17120A', fontSize: 14, fontWeight: '800' },
  secondaryButton: { backgroundColor: '#292337', borderWidth: 1, borderColor: '#423A54' },
  secondaryButtonText: { color: '#F3EFF8' },
  dangerButton: { backgroundColor: '#7B2D3D' },
  dangerButtonText: { color: '#FFF' },
  buttonDisabled: { opacity: 0.55 },
  inlineButton: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
  row: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', alignItems: 'center' },
  card: { backgroundColor: '#1B1727', borderColor: '#302A3F', borderWidth: 1, borderRadius: 17, overflow: 'hidden' },
  cardBody: { padding: 15 },
  cardTitle: { color: colors.text, fontSize: 17, fontWeight: '800', marginBottom: 5 },
  muted: { color: '#AAA3B9', fontSize: 13, lineHeight: 20 },
  error: { color: '#FF9DAB', backgroundColor: '#3A202A', borderRadius: 10, padding: 12, marginTop: 15, lineHeight: 20 },
  success: { color: '#B8F0CC', backgroundColor: '#1B382A', borderRadius: 10, padding: 12, marginTop: 15 },
  sectionTitle: { color: colors.text, fontSize: 21, fontWeight: '800', marginBottom: 14, marginTop: 28 },
  authCard: { width: '100%', maxWidth: 430, alignSelf: 'center', padding: 25, backgroundColor: '#191525', borderColor: '#312A40', borderWidth: 1, borderRadius: 22, marginTop: 35 },
  movieGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  movieCard: { width: 205, flexGrow: 1, flexBasis: 220, maxWidth: 310 },
  poster: { width: '100%', height: 245, backgroundColor: '#282237' },
  detailPoster: { width: 220, height: 320, borderRadius: 15, backgroundColor: '#282237' },
  reviewCard: { backgroundColor: '#1B1727', padding: 15, borderRadius: 13, marginBottom: 10, borderWidth: 1, borderColor: '#302A3F' },
});

export function Page({ children }: { children: ReactNode }) {
  return <View style={ui.page}><ScrollView contentContainerStyle={ui.scroll} keyboardShouldPersistTaps="handled"><View style={ui.content}>{children}</View></ScrollView></View>;
}

export function Brand() {
  return <Text style={ui.brand}>Movie<Text style={ui.brandAccent}>Hub</Text></Text>;
}

export function ActionButton({ title, onPress, variant = 'primary', disabled = false }: { title: string; onPress: () => void; variant?: 'primary' | 'secondary' | 'danger'; disabled?: boolean }) {
  const background = variant === 'danger' ? ui.dangerButton : variant === 'secondary' ? ui.secondaryButton : ui.button;
  const foreground = variant === 'danger' ? ui.dangerButtonText : variant === 'secondary' ? ui.secondaryButtonText : ui.buttonText;
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={({ pressed }) => [background, ui.inlineButton, disabled && ui.buttonDisabled, pressed && { opacity: 0.8 }]}><Text style={foreground}>{title}</Text></Pressable>;
}

export function AppHeader({ name, onHome, onCatalog, onFavorites, onAdd, onSignOut }: { name: string; onHome: () => void; onCatalog: () => void; onFavorites: () => void; onAdd: () => void; onSignOut: () => void }) {
  return <View style={ui.header}>
    <Pressable onPress={onHome}><Brand /></Pressable>
    <View style={ui.headerActions}>
      <ActionButton title="Catálogo" onPress={onCatalog} variant="secondary" />
      <ActionButton title="Favoritos" onPress={onFavorites} variant="secondary" />
      <ActionButton title="+ Filme" onPress={onAdd} />
      <ActionButton title={name ? 'Sair' : 'Entrar'} onPress={onSignOut} variant="secondary" />
    </View>
  </View>;
}

export function MovieCard({ movie, onPress, favorite, onFavorite }: { movie: Movie; onPress: () => void; favorite?: boolean; onFavorite?: () => void }) {
  return <View style={[ui.card, ui.movieCard]}>
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`Ver ${movie.title}`}>
      {movie.posterUrl ? <Image source={{ uri: movie.posterUrl }} style={ui.poster} resizeMode="cover" /> : <View style={[ui.poster, { alignItems: 'center', justifyContent: 'center' }]}><MaterialCommunityIcons name="movie-open-outline" size={48} color={colors.primary} /><Text style={[ui.muted, { marginTop: 10, paddingHorizontal: 14, textAlign: 'center' }]}>{movie.title}</Text></View>}
      <View style={ui.cardBody}>
        <Text style={ui.cardTitle} numberOfLines={1}>{movie.title}</Text>
        <Text style={ui.muted}>{[movie.releaseYear, movie.genre].filter(Boolean).join(' · ') || 'Filme'}</Text>
        <Text style={[ui.muted, { marginTop: 7 }]}>★ {Number(movie.averageRating || 0).toFixed(1)} · {movie.reviewCount || 0} avaliações</Text>
      </View>
    </Pressable>
    {onFavorite ? <Pressable onPress={onFavorite} style={{ paddingHorizontal: 15, paddingBottom: 15 }}><Text style={{ color: colors.primary, fontWeight: '800' }}>{favorite ? '♥ Favorito' : '♡ Favoritar'}</Text></Pressable> : null}
  </View>;
}

export function Loading({ label = 'Carregando...' }: { label?: string }) {
  return <View style={{ paddingVertical: 38, alignItems: 'center', gap: 10 }}><ActivityIndicator color={colors.primary} /><Text style={ui.muted}>{label}</Text></View>;
}
