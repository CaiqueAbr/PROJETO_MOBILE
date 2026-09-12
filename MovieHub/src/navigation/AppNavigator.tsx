import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { SplashScreen } from '../screens/Splash';
import { LoginScreen } from '../screens/Login';
import { RegisterScreen } from '../screens/Register';
import { HomeScreen } from '../screens/Home';
import { MoviesScreen } from '../screens/Movies';
import { MovieCreateScreen } from '../screens/MovieCreate';
import { MovieDetailsScreen } from '../screens/MovieDetails';
import { MovieEditScreen } from '../screens/MovieEdit';
import { MovieDeleteScreen } from '../screens/MovieDelete';
import { FavoritesScreen } from '../screens/Favorites';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName ="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Movies" component={MoviesScreen} />
      <Stack.Screen name="MovieCreate" component={MovieCreateScreen} />
      <Stack.Screen name="MovieDetails" component={MovieDetailsScreen} />
      <Stack.Screen name="MovieEdit" component={MovieEditScreen} />
      <Stack.Screen name="MovieDelete" component={MovieDeleteScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
    </Stack.Navigator>
  );
}