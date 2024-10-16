import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ScrollView, TouchableOpacity, Alert, Clipboard, Linking } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import { db } from '../firebase'; // Asegúrate de que la ruta sea correcta
import { collection, addDoc } from 'firebase/firestore';

const API_KEY = '3f1a3db6d57a48d6bf882da0ed75f750';

const HomeScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [language, setLanguage] = useState('en');
  const [sortBy, setSortBy] = useState('publishedAt');
  const [articles, setArticles] = useState([]);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [readLaterArticles, setReadLaterArticles] = useState([]);

  const fetchNews = async () => {
    try {
      const response = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          q: query,
          from: fromDate.toISOString().split('T')[0],
          to: toDate.toISOString().split('T')[0],
          language: language,
          sortBy: sortBy,
          apiKey: API_KEY,
        },
      });
      if (response.data.articles.length === 0) {
        alert('No se encontraron resultados para la búsqueda.');
      } else {
        setArticles(response.data.articles);
      }
    } catch (error) {
      console.error(error);
      alert('Hubo un error al realizar la búsqueda. Por favor, intenta nuevamente.');
    }
  };

  const onFromDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || fromDate;
    setShowFromDatePicker(false);
    setFromDate(currentDate);
  };

  const onToDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || toDate;
    setShowToDatePicker(false);
    setToDate(currentDate);
  };

  const handleShare = (url) => {
    Clipboard.setString(url);
    Alert.alert('URL copiada', '¡Ahora comparte!');
  };

  const openArticle = (url) => {
    Linking.openURL(url);
  };

  const handleReadLater = async (article) => {
    try {
      await addDoc(collection(db, 'readLaterArticles'), {
        title: article.title,
        description: article.description,
        url: article.url,
        publishedAt: article.publishedAt,
        source: article.source.name,
      });
      Alert.alert('Guardado', 'La noticia ha sido guardada para leer más tarde.');
    } catch (e) {
      console.error("Error adding document: ", e);
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
          onPress={() => handleReadLater(item)}
        >
          <Text style={styles.buttonText}>Leer luego</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>NewsApp</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ReadLater')}>
            <Text style={styles.readLaterButton}>!</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Consulta"
          value={query}
          onChangeText={setQuery}
        />
        <View>
          <Button title="Fecha de Inicio" onPress={() => setShowFromDatePicker(true)} />
          {showFromDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={fromDate}
              mode="date"
              display="default"
              onChange={onFromDateChange}
            />
          )}
        </View>
        <View>
          <Button title="Fecha de Fin" onPress={() => setShowToDatePicker(true)} />
          {showToDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={toDate}
              mode="date"
              display="default"
              onChange={onToDateChange}
            />
          )}
        </View>
        <RNPickerSelect
          style={pickerSelectStyles}
          value={language}
          onValueChange={(value) => setLanguage(value)}
          items={[
            { label: 'Inglés', value: 'en' },
            { label: 'Español', value: 'es' },
          ]}
          placeholder={{
            label: 'Selecciona un idioma',
            value: '',
          }}
        />
        <RNPickerSelect
          style={pickerSelectStyles}
          value={sortBy}
          onValueChange={(value) => setSortBy(value)}
          items={[
            { label: 'Relevancia', value: 'relevancy' },
            { label: 'Popularidad', value: 'popularity' },
            { label: 'Últimas noticias', value: 'publishedAt' },
          ]}
          placeholder={{
            label: 'Ordenar por',
            value: '',
          }}
        />
        <Button title="Buscar" onPress={fetchNews} />
        <FlatList
          data={articles}
          keyExtractor={(item) => item.url}
          renderItem={renderArticle}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  readLaterButton: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    marginHorizontal: 20,
  },
  article: {
    marginBottom: 20,
    paddingHorizontal: 20,
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    marginBottom: 20,
    marginHorizontal: 20,
  },
});

export default HomeScreen;
