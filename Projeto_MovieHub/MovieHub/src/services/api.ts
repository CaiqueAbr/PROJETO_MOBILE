export type User = { id: number; name: string; email: string; createdAt?: string };
export type Session = { user: User; token: string };
export type Review = {
  id: number;
  movieId?: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
};
export type Movie = {
  id: number;
  title: string;
  synopsis: string;
  releaseYear: number | null;
  genre: string;
  director: string;
  posterUrl: string;
  createdBy: number;
  averageRating: number;
  reviewCount: number;
  reviews?: Review[];
};
export type MovieInput = Pick<Movie, 'title' | 'synopsis' | 'releaseYear' | 'genre' | 'director' | 'posterUrl'>;

const baseUrl = (process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:3333/api').replace(/\/+$/, '');

async function request<T>(path: string, options: RequestInit & { token?: string } = {}): Promise<T> {
  const { token, headers, ...requestOptions } = options;
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...requestOptions,
      headers: {
        ...(requestOptions.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
  } catch {
    throw new Error(`Não foi possível acessar a API em ${baseUrl}. Confira se o servidor está iniciado.`);
  }

  if (response.status === 204) return undefined as T;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `A API respondeu com erro (${response.status}).`);
  return data as T;
}

export const api = {
  register: (input: { name: string; email: string; password: string }) =>
    request<Session>('/auth/register', { method: 'POST', body: JSON.stringify(input) }),
  login: (input: { email: string; password: string }) =>
    request<Session>('/auth/login', { method: 'POST', body: JSON.stringify(input) }),
  listMovies: (search = '') => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request<{ items: Movie[]; pagination: { total: number } }>(`/movies${query}`);
  },
  getMovie: (id: number) => request<Movie>(`/movies/${id}`),
  createMovie: (input: MovieInput, token: string) =>
    request<Movie>('/movies', { method: 'POST', body: JSON.stringify(input), token }),
  updateMovie: (id: number, input: Partial<MovieInput>, token: string) =>
    request<Movie>(`/movies/${id}`, { method: 'PATCH', body: JSON.stringify(input), token }),
  deleteMovie: (id: number, token: string) => request<void>(`/movies/${id}`, { method: 'DELETE', token }),
  createReview: (movieId: number, input: { rating: number; comment: string }, token: string) =>
    request<Review>(`/movies/${movieId}/reviews`, { method: 'POST', body: JSON.stringify(input), token }),
  listFavorites: (token: string) => request<{ items: Movie[] }>('/favorites', { token }),
  addFavorite: (movieId: number, token: string) => request<void>(`/favorites/${movieId}`, { method: 'PUT', token }),
  removeFavorite: (movieId: number, token: string) => request<void>(`/favorites/${movieId}`, { method: 'DELETE', token }),
};

export function getPosterUrl(movie: Pick<Movie, 'posterUrl' | 'title'>) {
  return movie.posterUrl || `https://placehold.co/480x720/211b33/F2B90C?text=${encodeURIComponent(movie.title)}`;
}
