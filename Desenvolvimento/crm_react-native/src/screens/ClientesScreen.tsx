import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const ClientesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clientes</Text>
      <Text style={styles.subtitle}>Lista de clientes será exibida aqui</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 