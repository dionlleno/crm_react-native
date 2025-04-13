import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, TextInput, KeyboardAvoidingView } from 'react-native';
import { format, addDays, isToday, isYesterday, isTomorrow, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { StatusBar } from 'expo-status-bar';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';

type Cliente = {
  id: string;
  nome: string;
  telefone: string;
};

type Imovel = {
  id: string;
  endereco: string;
  tipo: string;
};

type Compromisso = {
  id: string;
  titulo: string;
  horario: string;
  local: string;
  data: string;
  tags: string[];
  cliente?: string;
  imovel?: string;
  anotacao?: string;
};

// Dados de exemplo
const clientesExemplo: Cliente[] = [
  { id: '1', nome: 'João Silva', telefone: '(11) 99999-9999' },
  { id: '2', nome: 'Maria Santos', telefone: '(11) 88888-8888' },
  { id: '3', nome: 'Pedro Oliveira', telefone: '(11) 77777-7777' },
];

const imoveisExemplo: Imovel[] = [
  { id: '1', endereco: 'Rua das Flores, 123', tipo: 'Apartamento' },
  { id: '2', endereco: 'Avenida Principal, 456', tipo: 'Casa' },
  { id: '3', endereco: 'Rua Nova, 789', tipo: 'Terreno' },
];

// Dados de exemplo com datas reais
const compromissosExemplo: Compromisso[] = [
  {
    id: '1',
    titulo: 'Visita ao apartamento',
    horario: '14:00',
    local: 'Rua das Flores, 123',
    data: format(addDays(new Date(), -1), 'dd/MM/yyyy'), // Ontem
    tags: ['visita', 'imóvel'],
    cliente: 'João Silva',
    imovel: 'Apartamento - Rua das Flores, 123',
    anotacao: 'Cliente interessado em reformar a cozinha',
  },
  {
    id: '2',
    titulo: 'Assinatura de contrato',
    horario: '16:30',
    local: 'Escritório Central',
    data: format(addDays(new Date(), -1), 'dd/MM/yyyy'), // Ontem
    tags: ['contrato', 'documentação'],
    cliente: 'Maria Santos',
    anotacao: 'Trazer cópia do contrato e documentos necessários',
  },
  {
    id: '3',
    titulo: 'Visita à casa',
    horario: '10:00',
    local: 'Avenida Principal, 456',
    data: format(new Date(), 'dd/MM/yyyy'), // Hoje
    tags: ['visita', 'imóvel'],
    cliente: 'Pedro Oliveira',
    imovel: 'Casa - Avenida Principal, 456',
    anotacao: 'Cliente quer verificar estado da piscina',
  },
  {
    id: '4',
    titulo: 'Reunião com cliente',
    horario: '15:00',
    local: 'Café Central',
    data: format(new Date(), 'dd/MM/yyyy'), // Hoje
    tags: ['reunião', 'cliente'],
    cliente: 'João Silva',
    anotacao: 'Discutir opções de financiamento',
  },
  {
    id: '5',
    titulo: 'Visita ao terreno',
    horario: '09:30',
    local: 'Rua Nova, 789',
    data: format(addDays(new Date(), 1), 'dd/MM/yyyy'), // Amanhã
    tags: ['visita', 'terreno'],
    cliente: 'Maria Santos',
    imovel: 'Terreno - Rua Nova, 789',
    anotacao: 'Verificar documentação do terreno',
  },
  {
    id: '6',
    titulo: 'Apresentação de imóvel',
    horario: '11:00',
    local: 'Condomínio Vista Linda',
    data: format(addDays(new Date(), 1), 'dd/MM/yyyy'), // Amanhã
    tags: ['apresentação', 'imóvel'],
    cliente: 'Pedro Oliveira',
    imovel: 'Apartamento - Rua das Flores, 123',
    anotacao: 'Mostrar área de lazer do condomínio',
  },
];

const tagsDisponiveis = [
  'visita',
  'imóvel',
  'contrato',
  'documentação',
  'reunião',
  'cliente',
  'terreno',
  'apresentação',
];

export const InicioScreen = () => {
  const [dataSelecionada, setDataSelecionada] = useState<'ontem' | 'hoje' | 'amanha' | 'todos'>('hoje');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDetalhesVisible, setModalDetalhesVisible] = useState(false);
  const [compromissoSelecionado, setCompromissoSelecionado] = useState<Compromisso | null>(null);
  const [compromissos, setCompromissos] = useState<Compromisso[]>(compromissosExemplo);
  const [novoCompromisso, setNovoCompromisso] = useState({
    titulo: '',
    horario: '',
    local: '',
    data: '',
    tags: [] as string[],
    cliente: '',
    imovel: '',
    anotacao: '',
  });
  const [erroValidacao, setErroValidacao] = useState<string | null>(null);
  const [filtroAtivo, setFiltroAtivo] = useState<'todos' | 'hoje' | 'amanha' | 'semana' | 'mes'>('todos');

  const validarCampos = (compromisso: Partial<Compromisso>) => {
    if (!compromisso.titulo?.trim()) return 'O título é obrigatório';
    if (!compromisso.data?.trim()) return 'A data é obrigatória';
    if (!compromisso.horario?.trim()) return 'O horário é obrigatório';
    if (!compromisso.local?.trim()) return 'O local é obrigatório';
    if (!compromisso.anotacao?.trim()) return 'A anotação é obrigatória';
    return null;
  };

  const handleEditarCompromisso = () => {
    if (!compromissoSelecionado) return;

    const erro = validarCampos(compromissoSelecionado);
    if (erro) {
      setErroValidacao(erro);
      return;
    }

    const compromissosAtualizados = compromissos.map(comp => 
      comp.id === compromissoSelecionado.id ? compromissoSelecionado : comp
    );
    setCompromissos(compromissosAtualizados);
    setModalDetalhesVisible(false);
    setErroValidacao(null);
  };

  const handleExcluirCompromisso = () => {
    if (!compromissoSelecionado) return;

    const compromissosAtualizados = compromissos.filter(comp => comp.id !== compromissoSelecionado.id);
    setCompromissos(compromissosAtualizados);
    setModalDetalhesVisible(false);
  };

  const handleAdicionarCompromisso = () => {
    const erro = validarCampos(novoCompromisso);
    if (erro) {
      setErroValidacao(erro);
      return;
    }

    const novoId = (compromissos.length + 1).toString();
    const compromisso: Compromisso = {
      id: novoId,
      titulo: novoCompromisso.titulo,
      horario: novoCompromisso.horario,
      local: novoCompromisso.local,
      data: novoCompromisso.data,
      tags: novoCompromisso.tags,
      cliente: novoCompromisso.cliente || undefined,
      imovel: novoCompromisso.imovel || undefined,
      anotacao: novoCompromisso.anotacao,
    };

    setCompromissos([...compromissos, compromisso]);
    setModalVisible(false);
    setNovoCompromisso({
      titulo: '',
      horario: '',
      local: '',
      data: '',
      tags: [],
      cliente: '',
      imovel: '',
      anotacao: '',
    });
    setErroValidacao(null);
  };

  const getCompromissos = () => {
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - hoje.getDay());
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 6);
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    return compromissos.filter(compromisso => {
      const dataCompromisso = parse(compromisso.data, 'dd/MM/yyyy', new Date());
      
      switch (filtroAtivo) {
        case 'hoje':
          return format(dataCompromisso, 'dd/MM/yyyy') === format(hoje, 'dd/MM/yyyy');
        case 'amanha':
          return format(dataCompromisso, 'dd/MM/yyyy') === format(amanha, 'dd/MM/yyyy');
        case 'semana':
          return dataCompromisso >= inicioSemana && dataCompromisso <= fimSemana;
        case 'mes':
          return dataCompromisso >= inicioMes && dataCompromisso <= fimMes;
        default:
          return true;
      }
    });
  };

  const formatarData = (data: Date) => {
    if (isToday(data)) return 'Hoje';
    if (isYesterday(data)) return 'Ontem';
    if (isTomorrow(data)) return 'Amanhã';
    return format(data, "EEEE, d 'de' MMMM", { locale: ptBR });
  };

  const compromissosFiltrados = getCompromissos();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Compromissos</Text>
          </View>
        </View>
      </View>

      <View style={styles.filtrosContainer}>
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
            style={[styles.filtroButton, filtroAtivo === 'hoje' && styles.filtroButtonAtivo]}
            onPress={() => setFiltroAtivo('hoje')}
          >
            <Text style={[styles.filtroButtonText, filtroAtivo === 'hoje' && styles.filtroButtonTextAtivo]}>
              Hoje
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filtroButton, filtroAtivo === 'amanha' && styles.filtroButtonAtivo]}
            onPress={() => setFiltroAtivo('amanha')}
          >
            <Text style={[styles.filtroButtonText, filtroAtivo === 'amanha' && styles.filtroButtonTextAtivo]}>
              Amanhã
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filtroButton, filtroAtivo === 'semana' && styles.filtroButtonAtivo]}
            onPress={() => setFiltroAtivo('semana')}
          >
            <Text style={[styles.filtroButtonText, filtroAtivo === 'semana' && styles.filtroButtonTextAtivo]}>
              Esta Semana
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filtroButton, filtroAtivo === 'mes' && styles.filtroButtonAtivo]}
            onPress={() => setFiltroAtivo('mes')}
          >
            <Text style={[styles.filtroButtonText, filtroAtivo === 'mes' && styles.filtroButtonTextAtivo]}>
              Este Mês
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView style={styles.listaContainer}>
        {compromissosFiltrados.map((compromisso) => (
          <TouchableOpacity
            key={compromisso.id}
            style={styles.compromissoCard}
            onPress={() => {
              setCompromissoSelecionado(compromisso);
              setModalDetalhesVisible(true);
            }}
          >
            <View style={styles.compromissoHeader}>
              <Text style={styles.compromissoTitulo}>{compromisso.titulo}</Text>
              <View style={styles.compromissoHorarioContainer}>
                <Text style={styles.compromissoData}>{compromisso.data}</Text>
                <Text style={styles.compromissoHorario}>{compromisso.horario}</Text>
              </View>
            </View>
            <View style={styles.tagsContainer}>
              {compromisso.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.compromissoLocal}>{compromisso.local}</Text>
            {compromisso.anotacao && (
              <Text style={styles.compromissoAnotacao} numberOfLines={2}>
                {compromisso.anotacao}
              </Text>
            )}
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
            <Text style={styles.modalTitle}>Detalhes do Compromisso</Text>
            <View style={styles.modalHeaderButtons}>
              <TouchableOpacity 
                style={styles.modalActionButton}
                onPress={() => {
                  setModalDetalhesVisible(false);
                  setNovoCompromisso({
                    titulo: compromissoSelecionado?.titulo || '',
                    horario: compromissoSelecionado?.horario || '',
                    local: compromissoSelecionado?.local || '',
                    data: compromissoSelecionado?.data || '',
                    tags: compromissoSelecionado?.tags || [],
                    cliente: compromissoSelecionado?.cliente || '',
                    imovel: compromissoSelecionado?.imovel || '',
                    anotacao: compromissoSelecionado?.anotacao || ''
                  });
                  setModalVisible(true);
                }}
              >
                <Ionicons name="create" size={24} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalActionButton}
                onPress={() => {
                  setCompromissos(compromissos.filter(c => c.id !== compromissoSelecionado?.id));
                  setModalDetalhesVisible(false);
                }}
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

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Título</Text>
              <TextInput
                style={styles.input}
                value={compromissoSelecionado?.titulo}
                onChangeText={(text) => setCompromissoSelecionado(prev => prev ? {...prev, titulo: text} : null)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Data</Text>
              <TextInput
                style={styles.input}
                value={compromissoSelecionado?.data}
                onChangeText={(text) => setCompromissoSelecionado(prev => prev ? {...prev, data: text} : null)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Horário</Text>
              <TextInput
                style={styles.input}
                value={compromissoSelecionado?.horario}
                onChangeText={(text) => setCompromissoSelecionado(prev => prev ? {...prev, horario: text} : null)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Local</Text>
              <TextInput
                style={styles.input}
                value={compromissoSelecionado?.local}
                onChangeText={(text) => setCompromissoSelecionado(prev => prev ? {...prev, local: text} : null)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Anotação</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={compromissoSelecionado?.anotacao}
                onChangeText={(text) => setCompromissoSelecionado(prev => prev ? {...prev, anotacao: text} : null)}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Cliente</Text>
              <TextInput
                style={styles.input}
                value={compromissoSelecionado?.cliente}
                onChangeText={(text) => setCompromissoSelecionado(prev => prev ? {...prev, cliente: text} : null)}
                placeholder="Digite o nome do cliente"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Imóvel</Text>
              <TextInput
                style={styles.input}
                value={compromissoSelecionado?.imovel}
                onChangeText={(text) => setCompromissoSelecionado(prev => prev ? {...prev, imovel: text} : null)}
                placeholder="Digite o tipo e endereço do imóvel"
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
                      compromissoSelecionado?.tags.includes(tag) && styles.tagSelectorActive
                    ]}
                    onPress={() => {
                      setCompromissoSelecionado(prev => {
                        if (!prev) return null;
                        const newTags = prev.tags.includes(tag)
                          ? prev.tags.filter(t => t !== tag)
                          : [...prev.tags, tag];
                        return { ...prev, tags: newTags };
                      });
                    }}
                  >
                    <Text style={[
                      styles.tagSelectorText,
                      compromissoSelecionado?.tags.includes(tag) && styles.tagSelectorTextActive
                    ]}>
                      {tag}
                    </Text>
                  </TouchableOpacity>
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
            <Text style={styles.modalTitle}>Novo Compromisso</Text>
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
              <Text style={styles.inputLabel}>Data</Text>
              <TextInput
                style={styles.input}
                value={novoCompromisso.data}
                onChangeText={(text) => setNovoCompromisso({...novoCompromisso, data: text})}
                placeholder="Ex: 15/04/2024"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Horário</Text>
              <TextInput
                style={styles.input}
                value={novoCompromisso.horario}
                onChangeText={(text) => setNovoCompromisso({...novoCompromisso, horario: text})}
                placeholder="Ex: 14:00"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Título</Text>
              <TextInput
                style={styles.input}
                value={novoCompromisso.titulo}
                onChangeText={(text) => setNovoCompromisso({...novoCompromisso, titulo: text})}
                placeholder="Digite o título do compromisso"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Local</Text>
              <TextInput
                style={styles.input}
                value={novoCompromisso.local}
                onChangeText={(text) => setNovoCompromisso({...novoCompromisso, local: text})}
                placeholder="Digite o local do compromisso"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Anotação</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={novoCompromisso.anotacao}
                onChangeText={(text) => setNovoCompromisso({...novoCompromisso, anotacao: text})}
                placeholder="Digite uma anotação (opcional)"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Cliente</Text>
              <TextInput
                style={styles.input}
                value={novoCompromisso.cliente}
                onChangeText={(text) => setNovoCompromisso({...novoCompromisso, cliente: text})}
                placeholder="Digite o nome do cliente"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Imóvel</Text>
              <TextInput
                style={styles.input}
                value={novoCompromisso.imovel}
                onChangeText={(text) => setNovoCompromisso({...novoCompromisso, imovel: text})}
                placeholder="Digite o tipo e endereço do imóvel"
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
                      novoCompromisso.tags.includes(tag) && styles.tagSelectorActive
                    ]}
                    onPress={() => {
                      setNovoCompromisso(prev => {
                        const newTags = prev.tags.includes(tag)
                          ? prev.tags.filter(t => t !== tag)
                          : [...prev.tags, tag];
                        return { ...prev, tags: newTags };
                      });
                    }}
                  >
                    <Text style={[
                      styles.tagSelectorText,
                      novoCompromisso.tags.includes(tag) && styles.tagSelectorTextActive
                    ]}>
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
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
              onPress={handleAdicionarCompromisso}
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
  compromissoCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
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
  compromissoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  compromissoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  compromissoHorarioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compromissoData: {
    fontSize: 14,
    color: '#666',
    marginRight: 5,
  },
  compromissoHorario: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  compromissoLocal: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  compromissoAnotacao: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
    marginBottom: 5,
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
  selectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  selectOption: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectOptionActive: {
    backgroundColor: '#007AFF',
  },
  selectOptionText: {
    fontSize: 14,
    color: '#666',
  },
  selectOptionTextActive: {
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
}); 