import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, TextInput, KeyboardAvoidingView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';

type Imovel = {
  id: string;
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  valor: string;
  area: string;
  quartos: string;
  banheiros: string;
  vagas: string;
  tags: string[];
  observacoes?: string;
  imagens: string[];
};

export const ImoveisScreen = () => {
  const [imoveis, setImoveis] = useState<Imovel[]>([
    {
      id: '1',
      endereco: {
        logradouro: 'Rua das Flores',
        numero: '123',
        complemento: 'Apto 101',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01000-000'
      },
      valor: 'R$ 500.000',
      area: '80m²',
      quartos: '3',
      banheiros: '2',
      vagas: '2',
      tags: ['Apartamento', 'Novo', 'Mobiliado'],
      observacoes: 'Apartamento com vista para o mar',
      imagens: [
        'https://example.com/imagem1.jpg',
        'https://example.com/imagem2.jpg'
      ]
    },
    {
      id: '2',
      endereco: {
        logradouro: 'Avenida Principal',
        numero: '456',
        bairro: 'Jardim América',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        cep: '20000-000'
      },
      valor: 'R$ 800.000',
      area: '200m²',
      quartos: '4',
      banheiros: '3',
      vagas: '3',
      tags: ['Casa', 'Usado', 'Piscina'],
      observacoes: 'Casa com piscina e área de lazer',
      imagens: [
        'https://example.com/imagem3.jpg',
        'https://example.com/imagem4.jpg'
      ]
    }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalDetalhesVisible, setModalDetalhesVisible] = useState(false);
  const [imovelSelecionado, setImovelSelecionado] = useState<Imovel | null>(null);
  const [novoImovel, setNovoImovel] = useState<Partial<Imovel>>({
    endereco: {
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: ''
    },
    valor: '',
    area: '',
    quartos: '',
    banheiros: '',
    vagas: '',
    tags: [],
    observacoes: '',
    imagens: []
  });
  const [erroValidacao, setErroValidacao] = useState<string | null>(null);
  const [filtroAtivo, setFiltroAtivo] = useState<'todos' | 'apartamento' | 'casa' | 'terreno'>('todos');
  const [buscaEndereco, setBuscaEndereco] = useState('');

  const tagsDisponiveis = [
    'Apartamento',
    'Casa',
    'Terreno',
    'Novo',
    'Usado',
    'Mobiliado',
    'Piscina',
    'Garagem',
    'Jardim',
    'Reformado',
    'Vista para o mar'
  ];

  const validarCampos = (imovel: Partial<Imovel>) => {
    if (!imovel.endereco?.logradouro?.trim()) return 'O logradouro é obrigatório';
    if (!imovel.endereco?.numero?.trim()) return 'O número é obrigatório';
    if (!imovel.endereco?.bairro?.trim()) return 'O bairro é obrigatório';
    if (!imovel.endereco?.cidade?.trim()) return 'A cidade é obrigatória';
    if (!imovel.endereco?.estado?.trim()) return 'O estado é obrigatório';
    if (!imovel.endereco?.cep?.trim()) return 'O CEP é obrigatório';
    if (!imovel.valor?.trim()) return 'O valor é obrigatório';
    if (!imovel.area?.trim()) return 'A área é obrigatória';
    if (!imovel.quartos?.trim()) return 'O número de quartos é obrigatório';
    if (!imovel.banheiros?.trim()) return 'O número de banheiros é obrigatório';
    if (!imovel.vagas?.trim()) return 'O número de vagas é obrigatório';
    if (!imovel.tags?.length) return 'Selecione pelo menos um tipo de imóvel';
    return null;
  };

  const handleEditarImovel = () => {
    if (!imovelSelecionado) return;

    const erro = validarCampos(imovelSelecionado);
    if (erro) {
      setErroValidacao(erro);
      return;
    }

    const imoveisAtualizados = imoveis.map(imovel => 
      imovel.id === imovelSelecionado.id ? imovelSelecionado : imovel
    );
    setImoveis(imoveisAtualizados);
    setModalDetalhesVisible(false);
    setErroValidacao(null);
  };

  const handleExcluirImovel = () => {
    if (!imovelSelecionado) return;

    const imoveisAtualizados = imoveis.filter(imovel => imovel.id !== imovelSelecionado.id);
    setImoveis(imoveisAtualizados);
    setModalDetalhesVisible(false);
  };

  const handleAdicionarImovel = () => {
    const erro = validarCampos(novoImovel);
    if (erro) {
      setErroValidacao(erro);
      return;
    }

    const novoId = (imoveis.length + 1).toString();
    const imovel: Imovel = {
      id: novoId,
      endereco: novoImovel.endereco || {
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: ''
      },
      valor: novoImovel.valor || '',
      area: novoImovel.area || '',
      quartos: novoImovel.quartos || '',
      banheiros: novoImovel.banheiros || '',
      vagas: novoImovel.vagas || '',
      tags: novoImovel.tags || [],
      observacoes: novoImovel.observacoes,
      imagens: novoImovel.imagens || []
    };

    setImoveis([...imoveis, imovel]);
    setModalVisible(false);
    setNovoImovel({
      endereco: {
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: ''
      },
      valor: '',
      area: '',
      quartos: '',
      banheiros: '',
      vagas: '',
      tags: [],
      observacoes: '',
      imagens: []
    });
    setErroValidacao(null);
  };

  const toggleTag = (tag: string) => {
    setNovoImovel(prev => {
      const newTags = prev.tags?.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...(prev.tags || []), tag];
      return { ...prev, tags: newTags };
    });
  };

  const imoveisFiltrados = imoveis.filter(imovel => {
    const enderecoCompleto = `${imovel.endereco.logradouro} ${imovel.endereco.numero} ${imovel.endereco.bairro} ${imovel.endereco.cidade} ${imovel.endereco.estado}`;
    const passaFiltroEndereco = !buscaEndereco || 
      enderecoCompleto.toLowerCase().includes(buscaEndereco.toLowerCase());
    return passaFiltroEndereco;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Imóveis</Text>
          </View>
        </View>
      </View>

      <View style={styles.filtrosContainer}>
        <View style={styles.buscaContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.buscaIcon} />
          <TextInput
            style={styles.buscaInput}
            placeholder="Buscar por endereço"
            value={buscaEndereco}
            onChangeText={setBuscaEndereco}
          />
          {buscaEndereco ? (
            <TouchableOpacity onPress={() => setBuscaEndereco('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity 
            style={[styles.filtroButton, filtroAtivo === 'todos' && styles.filtroButtonAtivo]}
            onPress={() => setFiltroAtivo('todos')}
          >
            <Text style={[styles.filtroButtonText, filtroAtivo === 'todos' && styles.filtroButtonTextAtivo]}>
              Todos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filtroButton, filtroAtivo === 'apartamento' && styles.filtroButtonAtivo]}
            onPress={() => setFiltroAtivo('apartamento')}
          >
            <Text style={[styles.filtroButtonText, filtroAtivo === 'apartamento' && styles.filtroButtonTextAtivo]}>
              Apartamentos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filtroButton, filtroAtivo === 'casa' && styles.filtroButtonAtivo]}
            onPress={() => setFiltroAtivo('casa')}
          >
            <Text style={[styles.filtroButtonText, filtroAtivo === 'casa' && styles.filtroButtonTextAtivo]}>
              Casas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filtroButton, filtroAtivo === 'terreno' && styles.filtroButtonAtivo]}
            onPress={() => setFiltroAtivo('terreno')}
          >
            <Text style={[styles.filtroButtonText, filtroAtivo === 'terreno' && styles.filtroButtonTextAtivo]}>
              Terrenos
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView style={styles.listaContainer}>
        {imoveisFiltrados.map((imovel) => (
          <TouchableOpacity
            key={imovel.id}
            style={styles.imovelCard}
            onPress={() => {
              setImovelSelecionado(imovel);
              setModalDetalhesVisible(true);
            }}
          >
            <View style={styles.imovelCardContent}>
              {imovel.imagens.length > 0 && (
                <Image
                  source={{ uri: imovel.imagens[0] }}
                  style={styles.imovelImagem}
                  resizeMode="cover"
                />
              )}
              <View style={styles.imovelInfo}>
                <View style={styles.imovelHeader}>
                  <Text style={styles.imovelValor}>{imovel.valor}</Text>
                </View>
                <Text style={styles.imovelEndereco}>
                  {`${imovel.endereco.logradouro}, ${imovel.endereco.numero}${imovel.endereco.complemento ? ` - ${imovel.endereco.complemento}` : ''}`}
                </Text>
                <Text style={styles.imovelBairro}>
                  {`${imovel.endereco.bairro} - ${imovel.endereco.cidade}/${imovel.endereco.estado}`}
                </Text>
                <View style={styles.imovelInfoContainer}>
                  <View style={styles.imovelInfoItem}>
                    <Ionicons name="home" size={16} color="#666" />
                    <Text style={styles.imovelInfoText}>{imovel.area}</Text>
                  </View>
                  <View style={styles.imovelInfoItem}>
                    <Ionicons name="bed" size={16} color="#666" />
                    <Text style={styles.imovelInfoText}>{imovel.quartos}</Text>
                  </View>
                  <View style={styles.imovelInfoItem}>
                    <Ionicons name="water" size={16} color="#666" />
                    <Text style={styles.imovelInfoText}>{imovel.banheiros}</Text>
                  </View>
                  <View style={styles.imovelInfoItem}>
                    <Ionicons name="car" size={16} color="#666" />
                    <Text style={styles.imovelInfoText}>{imovel.vagas}</Text>
                  </View>
                </View>
                <View style={styles.tagsContainer}>
                  {imovel.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        isVisible={modalDetalhesVisible}
        onBackdropPress={() => setModalDetalhesVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalhes do Imóvel</Text>
            <View style={styles.modalHeaderButtons}>
              <TouchableOpacity 
                style={styles.modalActionButton}
                onPress={() => {
                  setModalDetalhesVisible(false);
                  setNovoImovel({
                    endereco: {
                      logradouro: imovelSelecionado?.endereco.logradouro || '',
                      numero: imovelSelecionado?.endereco.numero || '',
                      complemento: imovelSelecionado?.endereco.complemento || '',
                      bairro: imovelSelecionado?.endereco.bairro || '',
                      cidade: imovelSelecionado?.endereco.cidade || '',
                      estado: imovelSelecionado?.endereco.estado || '',
                      cep: imovelSelecionado?.endereco.cep || ''
                    },
                    valor: imovelSelecionado?.valor || '',
                    area: imovelSelecionado?.area || '',
                    quartos: imovelSelecionado?.quartos || '',
                    banheiros: imovelSelecionado?.banheiros || '',
                    vagas: imovelSelecionado?.vagas || '',
                    tags: imovelSelecionado?.tags || [],
                    observacoes: imovelSelecionado?.observacoes || '',
                    imagens: imovelSelecionado?.imagens || []
                  });
                  setModalVisible(true);
                }}
              >
                <Ionicons name="create" size={24} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalActionButton}
                onPress={handleExcluirImovel}
              >
                <Ionicons name="trash" size={24} color="#ff3b30" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalDetalhesVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.modalForm}>
            {erroValidacao && (
              <View style={styles.erroContainer}>
                <Text style={styles.erroText}>{erroValidacao}</Text>
              </View>
            )}

            {imovelSelecionado?.imagens && imovelSelecionado.imagens.length > 0 && (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.imagensContainer}
              >
                {imovelSelecionado.imagens.map((imagem, index) => (
                  <Image
                    key={index}
                    source={{ uri: imagem }}
                    style={styles.imagemDetalhe}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            )}

            <View style={styles.detalheContainer}>
              <Text style={styles.detalheLabel}>Endereço</Text>
              <Text style={styles.detalheValor}>
                {`${imovelSelecionado?.endereco.logradouro}, ${imovelSelecionado?.endereco.numero}${imovelSelecionado?.endereco.complemento ? ` - ${imovelSelecionado?.endereco.complemento}` : ''}`}
              </Text>
              <Text style={styles.detalheValor}>
                {`${imovelSelecionado?.endereco.bairro} - ${imovelSelecionado?.endereco.cidade}/${imovelSelecionado?.endereco.estado}`}
              </Text>
              <Text style={styles.detalheValor}>
                {`CEP: ${imovelSelecionado?.endereco.cep}`}
              </Text>
            </View>

            <View style={styles.detalheContainer}>
              <Text style={styles.detalheLabel}>Valor</Text>
              <Text style={styles.detalheValor}>{imovelSelecionado?.valor}</Text>
            </View>

            <View style={styles.detalheContainer}>
              <Text style={styles.detalheLabel}>Área</Text>
              <Text style={styles.detalheValor}>{imovelSelecionado?.area}</Text>
            </View>

            <View style={styles.detalheContainer}>
              <Text style={styles.detalheLabel}>Quartos</Text>
              <Text style={styles.detalheValor}>{imovelSelecionado?.quartos}</Text>
            </View>

            <View style={styles.detalheContainer}>
              <Text style={styles.detalheLabel}>Banheiros</Text>
              <Text style={styles.detalheValor}>{imovelSelecionado?.banheiros}</Text>
            </View>

            <View style={styles.detalheContainer}>
              <Text style={styles.detalheLabel}>Vagas</Text>
              <Text style={styles.detalheValor}>{imovelSelecionado?.vagas}</Text>
            </View>

            <View style={styles.detalheContainer}>
              <Text style={styles.detalheLabel}>Observações</Text>
              <Text style={styles.detalheValor}>{imovelSelecionado?.observacoes || 'Nenhuma observação'}</Text>
            </View>

            <View style={styles.detalheContainer}>
              <Text style={styles.detalheLabel}>Tags</Text>
              <View style={styles.tagsContainer}>
                {imovelSelecionado?.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => {
          setModalVisible(false);
          setErroValidacao(null);
        }}
        style={styles.modal}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalContent}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Novo Imóvel</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.modalForm}
            keyboardShouldPersistTaps="handled"
          >
            {erroValidacao && (
              <View style={styles.erroContainer}>
                <Text style={styles.erroText}>{erroValidacao}</Text>
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Logradouro</Text>
              <TextInput
                style={styles.input}
                value={novoImovel.endereco?.logradouro}
                onChangeText={(text) => setNovoImovel(prev => ({
                  ...prev,
                  endereco: { ...prev.endereco!, logradouro: text }
                }))}
                placeholder="Ex: Rua das Flores"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Número</Text>
              <TextInput
                style={styles.input}
                value={novoImovel.endereco?.numero}
                onChangeText={(text) => setNovoImovel(prev => ({
                  ...prev,
                  endereco: { ...prev.endereco!, numero: text }
                }))}
                placeholder="Ex: 123"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Complemento</Text>
              <TextInput
                style={styles.input}
                value={novoImovel.endereco?.complemento}
                onChangeText={(text) => setNovoImovel(prev => ({
                  ...prev,
                  endereco: { ...prev.endereco!, complemento: text }
                }))}
                placeholder="Ex: Apto 101"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Bairro</Text>
              <TextInput
                style={styles.input}
                value={novoImovel.endereco?.bairro}
                onChangeText={(text) => setNovoImovel(prev => ({
                  ...prev,
                  endereco: { ...prev.endereco!, bairro: text }
                }))}
                placeholder="Ex: Centro"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Cidade</Text>
              <TextInput
                style={styles.input}
                value={novoImovel.endereco?.cidade}
                onChangeText={(text) => setNovoImovel(prev => ({
                  ...prev,
                  endereco: { ...prev.endereco!, cidade: text }
                }))}
                placeholder="Ex: São Paulo"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Estado</Text>
              <TextInput
                style={styles.input}
                value={novoImovel.endereco?.estado}
                onChangeText={(text) => setNovoImovel(prev => ({
                  ...prev,
                  endereco: { ...prev.endereco!, estado: text }
                }))}
                placeholder="Ex: SP"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>CEP</Text>
              <TextInput
                style={styles.input}
                value={novoImovel.endereco?.cep}
                onChangeText={(text) => setNovoImovel(prev => ({
                  ...prev,
                  endereco: { ...prev.endereco!, cep: text }
                }))}
                placeholder="Ex: 01000-000"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Valor</Text>
              <TextInput
                style={styles.input}
                value={novoImovel.valor}
                onChangeText={(text) => setNovoImovel({...novoImovel, valor: text})}
                placeholder="Ex: R$ 500.000"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Área</Text>
              <TextInput
                style={styles.input}
                value={novoImovel.area}
                onChangeText={(text) => setNovoImovel({...novoImovel, area: text})}
                placeholder="Ex: 80m²"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Quartos</Text>
              <TextInput
                style={styles.input}
                value={novoImovel.quartos}
                onChangeText={(text) => setNovoImovel({...novoImovel, quartos: text})}
                placeholder="Ex: 3"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Banheiros</Text>
              <TextInput
                style={styles.input}
                value={novoImovel.banheiros}
                onChangeText={(text) => setNovoImovel({...novoImovel, banheiros: text})}
                placeholder="Ex: 2"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Vagas</Text>
              <TextInput
                style={styles.input}
                value={novoImovel.vagas}
                onChangeText={(text) => setNovoImovel({...novoImovel, vagas: text})}
                placeholder="Ex: 2"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Observações</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={novoImovel.observacoes}
                onChangeText={(text) => setNovoImovel({...novoImovel, observacoes: text})}
                placeholder="Digite observações sobre o imóvel"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Tags</Text>
              <View style={styles.tagsSelectorContainer}>
                {tagsDisponiveis.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.tagSelector,
                      novoImovel.tags?.includes(tag) && styles.tagSelectorActive
                    ]}
                    onPress={() => toggleTag(tag)}
                  >
                    <Text style={[
                      styles.tagSelectorText,
                      novoImovel.tags?.includes(tag) && styles.tagSelectorTextActive
                    ]}>
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Imagens</Text>
              <View style={styles.imagensUploadContainer}>
                <TouchableOpacity 
                  style={styles.uploadButton}
                  onPress={() => {
                    // Aqui você implementaria a lógica de upload de imagens
                    // Por exemplo, usando ImagePicker ou outra biblioteca
                  }}
                >
                  <Ionicons name="images" size={24} color="#007AFF" />
                  <Text style={styles.uploadButtonText}>Adicionar Imagens</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleAdicionarImovel}
            >
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    height: 60,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerLeft: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  filtrosContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  buscaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 10,
  },
  buscaIcon: {
    marginRight: 8,
  },
  buscaInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  filtroButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
  },
  filtroButtonAtivo: {
    backgroundColor: '#007AFF',
  },
  filtroButtonText: {
    color: '#666',
    fontSize: 14,
  },
  filtroButtonTextAtivo: {
    color: 'white',
  },
  listaContainer: {
    flex: 1,
    padding: 15,
  },
  imovelCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  imovelCardContent: {
    flexDirection: 'row',
    padding: 15,
  },
  imovelImagem: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 15,
  },
  imovelInfo: {
    flex: 1,
  },
  imovelHeader: {
    marginBottom: 8,
  },
  imovelValor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  imovelEndereco: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  imovelBairro: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  imovelInfoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  imovelInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 4,
  },
  imovelInfoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  tag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#1976D2',
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalForm: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tagsSelectorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  tagSelector: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagSelectorActive: {
    backgroundColor: '#007AFF',
  },
  tagSelectorText: {
    fontSize: 14,
    color: '#666',
  },
  tagSelectorTextActive: {
    color: 'white',
  },
  erroContainer: {
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  erroText: {
    color: '#D32F2F',
    fontSize: 14,
  },
  modalHeaderButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalActionButton: {
    padding: 4,
  },
  detalheContainer: {
    marginBottom: 15,
  },
  detalheLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  detalheValor: {
    fontSize: 16,
    color: '#333',
  },
  imagensContainer: {
    marginBottom: 15,
  },
  imagemDetalhe: {
    width: 300,
    height: 200,
    borderRadius: 10,
    marginRight: 10,
  },
  imagensUploadContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  uploadButtonText: {
    marginLeft: 8,
    color: '#007AFF',
    fontSize: 14,
  },
}); 