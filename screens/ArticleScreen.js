import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';

const ArticleScreen = ({ route, navigation }) => {
  const { article } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{article.title}</Text>
      <Text style={styles.content}>{article.content ? article.content.replace(/\[\+\d+ chars\]/, '') : article.description}</Text>
      <Button title="Regresar" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default ArticleScreen;
