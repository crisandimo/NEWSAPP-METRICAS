import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Linking, Clipboard, Alert } from 'react-native';
import { db, auth } from '../firebase'; // Importar auth además de db
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const ReadLaterScreen = ({ navigation }) => {
  const [readLaterArticles, setReadLaterArticles] = useState([]);

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const user = auth.currentUser;

    if (user) {
      // Si el usuario está autenticado, procedemos a recuperar los artículos
      const fetchReadLaterArticles = async () => {
        const querySnapshot = await getDocs(collection(db, 'readLaterArticles'));
        const articles = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setReadLaterArticles(articles);
      };

      fetchReadLaterArticles();
    } else {
      // Si no está autenticado, muestra una alerta y redirige al login
      Alert.alert('No autenticado', 'Debes iniciar sesión para ver tus artículos.');
      navigation.navigate('Login'); // Redirigir a la pantalla de login
    }
  }, [navigation]);

  const handleShare = (url) => {
    Clipboard.setString(url);
    Alert.alert('URL copiada', '¡Ahora comparte!');
  };

  const openArticle = (url) => {
    Linking.openURL(url);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'readLaterArticles', id));
      setReadLaterArticles(readLaterArticles.filter(article => article.id !== id));
      Alert.alert('Eliminado', 'La noticia ha sido eliminada.');
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const renderArticle = ({ item }) => (
    <View style={styles.article}>
      <Text style={styles.articleTitle}>{item.title}</Text>
      <Text style={styles.articleDescription}>{item.description}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => openArticle(item.url)}
        >
          <Text style={styles.buttonText}>Ver más</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleShare(item.url)}
        >
          <Text style={styles.buttonText}>Compartir</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={readLaterArticles}
        keyExtractor={(item) => item.id}
        renderItem={renderArticle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  article: {
    marginBottom: 20,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  articleDescription: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ReadLaterScreen;
