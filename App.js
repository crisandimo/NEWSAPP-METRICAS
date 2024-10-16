import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import ArticleScreen from './screens/ArticleScreen';
import ReadLaterScreen from './screens/ReadLaterScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen'; // Importa la pantalla de registro
import { auth } from './firebase'; // Importa Firebase Authentication

const Stack = createStackNavigator();

const App = () => {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      if (userAuth) {
        setUser(userAuth); // Usuario autenticado
      } else {
        setUser(null); // No autenticado
      }
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? 'Home' : 'Login'}>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Noticias' }} />
            <Stack.Screen name="Article" component={ArticleScreen} options={{ title: 'Artículo' }} />
            <Stack.Screen name="ReadLater" component={ReadLaterScreen} options={{ title: 'Leer después' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Iniciar sesión' }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Registrarse' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
