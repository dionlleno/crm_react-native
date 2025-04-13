import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';

type Cliente = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: {
    logradouro: string;
    cidade: string;
    estado: string;
    pais: string;
    cep: string;
  };
  observacoes: string;
  tags: string[];
  ultimoContato: string;
};

type HistoricoCliente = {
  id: string;
  data: string;
  tipo: 'visita' | 'ligacao' | 'email' | 'documento';
  descricao: string;
};

type TipoNota = 'visita' | 'ligacao' | 'email' | 'documento';
type StatusNota = 'pendente' | 'concluido' | 'cancelado';

export const ClientesScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDetalhesVisible, setModalDetalhesVisible] = useState(false);
  const [erroValidacao, setErroValidacao] = useState<{
    nome?: string;
    telefone?: string;
    cep?: string;
    data?: string;
  }>({});
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [filtroAtivo, setFiltroAtivo] = useState<'todos' | 'nome' | 'endereco' | 'tags'>('todos');
  const [ordemAtiva, setOrdemAtiva] = useState<'nome' | 'data'>('nome');
  const [ordemCrescente, setOrdemCrescente] = useState(true);
  const [termoBusca, setTermoBusca] = useState('');
  const [clientes, setClientes] = useState<Cliente[]>([
    {
      id: '1',
      nome: 'João Silva',
      email: 'joao@email.com',
      telefone: '(11) 99999-9999',
      endereco: {
        logradouro: 'Rua das Flores, 123',
        cidade: 'São Paulo',
        estado: 'SP',
        pais: 'Brasil',
        cep: '01234-567'
      },
      observacoes: 'Cliente interessado em apartamentos de 2 quartos',
      tags: ['Pend. Visita'],
      ultimoContato: '15/04/2024'
    },
    {
      id: '2',
      nome: 'Maria Santos',
      email: 'maria@email.com',
      telefone: '(11) 88888-8888',
      endereco: {
        logradouro: 'Av. Principal, 456',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        pais: 'Brasil',
        cep: '20000-000'
      },
      observacoes: 'Precisa de imóvel próximo ao metrô',
      tags: ['Pend. Documentação'],
      ultimoContato: '14/04/2024'
    }
  ]);
  const [novoCliente, setNovoCliente] = useState<Cliente>({
    id: '',
    nome: '',
    email: '',
    telefone: '',
    endereco: {
      logradouro: '',
      cidade: '',
      estado: '',
      pais: '',
      cep: ''
    },
    observacoes: '',
    tags: [],
    ultimoContato: new Date().toLocaleDateString('pt-BR')
  });
  const [historicoCliente, setHistoricoCliente] = useState<HistoricoCliente[]>([
    {
      id: '1',
      data: '15/04/2024',
      tipo: 'visita',
      descricao: 'Visita ao imóvel na Rua das Flores',
    },
    {
      id: '2',
      data: '14/04/2024',
      tipo: 'ligacao',
      descricao: 'Ligação para confirmar visita',
    },
    {
      id: '3',
      data: '13/04/2024',
      tipo: 'documento',
      descricao: 'Envio de documentação pendente',
    }
  ]);
  const [modalNotaVisible, setModalNotaVisible] = useState(false);
  const [notaEditavel, setNotaEditavel] = useState<HistoricoCliente | null>(null);
  const [novaNota, setNovaNota] = useState<{
    tipo: TipoNota;
    descricao: string;
  }>({
    tipo: 'visita',
    descricao: ''
  });

  const tagsDisponiveis = [
    'Ja Comprou',
    'Não Comprou',
    'Pend. Documentação',
    'Pend. Informação',
    'Pend. Visita'
  ];

  const validarTelefone = (telefone: string) => {
    const regex = /^\(\d{2}\) \d{5}-\d{4}$/;
    return regex.test(telefone);
  };

  const validarCEP = (cep: string) => {
    const regex = /^\d{5}-\d{3}$/;
    return regex.test(cep);
  };

  const formatarTelefone = (telefone: string) => {
    const numeros = telefone.replace(/\D/g, '');
    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 6) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
  };

  const formatarCEP = (cep: string) => {
    const numeros = cep.replace(/\D/g, '');
    if (numeros.length <= 5) return numeros;
    return `${numeros.slice(0, 5)}-${numeros.slice(5, 8)}`;
  };

  const validarCampos = () => {
    const erros: typeof erroValidacao = {};
    
    if (!novoCliente.nome.trim()) {
      erros.nome = 'Nome é obrigatório';
    }
    
    if (novoCliente.telefone && !validarTelefone(novoCliente.telefone)) {
      erros.telefone = 'Telefone inválido';
    }
    
    if (novoCliente.endereco.cep && !validarCEP(novoCliente.endereco.cep)) {
      erros.cep = 'CEP inválido';
    }
    
    if (!novoCliente.ultimoContato) {
      erros.data = 'Data de último contato é obrigatória';
    }
    
    setErroValidacao(erros);
    return Object.keys(erros).length === 0;
  };

  const handleAdicionarCliente = () => {
    if (!validarCampos()) return;
    
    const clienteComId = {
      ...novoCliente,
      id: Date.now().toString(),
    };
    
    setClientes([...clientes, clienteComId]);
    setModalVisible(false);
    setNovoCliente({
      id: '',
      nome: '',
      email: '',
      telefone: '',
      endereco: {
        logradouro: '',
        cidade: '',
        estado: '',
        pais: '',
        cep: ''
      },
      observacoes: '',
      tags: [],
      ultimoContato: new Date().toLocaleDateString('pt-BR')
    });
    setErroValidacao({});
  };

  const handleEditarCliente = () => {
    if (!clienteSelecionado || !validarCampos()) return;
    
    setClientes(clientes.map(cliente => 
      cliente.id === clienteSelecionado.id ? clienteSelecionado : cliente
    ));
    setModalVisible(false);
    setClienteSelecionado(null);
    setNovoCliente({
      id: '',
      nome: '',
      email: '',
      telefone: '',
      endereco: {
        logradouro: '',
        cidade: '',
        estado: '',
        pais: '',
        cep: ''
      },
      observacoes: '',
      tags: [],
      ultimoContato: new Date().toLocaleDateString('pt-BR')
    });
    setErroValidacao({});
  };

  const toggleTag = (tag: string) => {
    setNovoCliente(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const clientesFiltrados = clientes.filter(cliente => {
    if (filtroAtivo === 'todos') return true;
    if (filtroAtivo === 'nome') {
      return cliente.nome.toLowerCase().includes(termoBusca.toLowerCase());
    }
    if (filtroAtivo === 'endereco') {
      const termoBuscaLower = termoBusca.toLowerCase();
      return (
        cliente.endereco.logradouro.toLowerCase().includes(termoBuscaLower) ||
        cliente.endereco.cidade.toLowerCase().includes(termoBuscaLower) ||
        cliente.endereco.estado.toLowerCase().includes(termoBuscaLower) ||
        cliente.endereco.cep.includes(termoBusca)
      );
    }
    if (filtroAtivo === 'tags') {
      return cliente.tags.some(tag => 
        tag.toLowerCase().includes(termoBusca.toLowerCase())
      );
    }
    return true;
  });

  const clientesOrdenados = [...clientesFiltrados].sort((a, b) => {
    if (ordemAtiva === 'nome') {
      return ordemCrescente 
        ? a.nome.localeCompare(b.nome)
        : b.nome.localeCompare(a.nome);
    } else {
      try {
        const dataA = new Date(a.ultimoContato.split('/').reverse().join('-'));
        const dataB = new Date(b.ultimoContato.split('/').reverse().join('-'));
        
        if (isNaN(dataA.getTime()) || isNaN(dataB.getTime())) {
          return 0; // Mantém a ordem original se a data for inválida
        }
        
        return ordemCrescente 
          ? dataA.getTime() - dataB.getTime()
          : dataB.getTime() - dataA.getTime();
      } catch {
        return 0; // Mantém a ordem original se houver erro na conversão
      }
    }
  });

  const handleAdicionarNota = () => {
    if (!novaNota.descricao.trim()) return;
    
    const novaNotaCompleta: HistoricoCliente = {
      id: Date.now().toString(),
      data: new Date().toLocaleDateString('pt-BR'),
      ...novaNota
    };
    
    setHistoricoCliente([...historicoCliente, novaNotaCompleta]);
    setModalNotaVisible(false);
    setNovaNota({
      tipo: 'visita',
      descricao: ''
    });
  };

  const handleEditarNota = () => {
    if (!notaEditavel || !novaNota.descricao.trim()) return;
    
    setHistoricoCliente(historicoCliente.map(nota => 
      nota.id === notaEditavel.id 
        ? { ...nota, ...novaNota }
        : nota
    ));
    setModalNotaVisible(false);
    setNotaEditavel(null);
    setNovaNota({
      tipo: 'visita',
      descricao: ''
    });
  };

  const handleRemoverNota = (id: string) => {
    setHistoricoCliente(historicoCliente.filter(nota => nota.id !== id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Clientes</Text>
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
            style={[styles.filtroButton, filtroAtivo === 'nome' && styles.filtroButtonAtivo]}
            onPress={() => setFiltroAtivo('nome')}
          >
            <Text style={[styles.filtroButtonText, filtroAtivo === 'nome' && styles.filtroButtonTextAtivo]}>
              Nome
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filtroButton, filtroAtivo === 'endereco' && styles.filtroButtonAtivo]}
            onPress={() => setFiltroAtivo('endereco')}
          >
            <Text style={[styles.filtroButtonText, filtroAtivo === 'endereco' && styles.filtroButtonTextAtivo]}>
              Endereço
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filtroButton, filtroAtivo === 'tags' && styles.filtroButtonAtivo]}
            onPress={() => setFiltroAtivo('tags')}
          >
            <Text style={[styles.filtroButtonText, filtroAtivo === 'tags' && styles.filtroButtonTextAtivo]}>
              Situação
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {filtroAtivo !== 'todos' && (
        <View style={styles.buscaContainer}>
          <TextInput
            style={styles.buscaInput}
            placeholder={
              filtroAtivo === 'endereco' 
                ? 'Buscar por logradouro, cidade, estado ou CEP...'
                : `Buscar por ${filtroAtivo}...`
            }
            value={termoBusca}
            onChangeText={setTermoBusca}
          />
        </View>
      )}

      <View style={styles.ordenacaoContainer}>
        <TouchableOpacity 
          style={[styles.ordenacaoButton, ordemAtiva === 'nome' && styles.ordenacaoButtonAtivo]}
          onPress={() => {
            setOrdemAtiva('nome');
            setOrdemCrescente(ordemAtiva === 'nome' ? !ordemCrescente : true);
          }}
        >
          <Text style={[styles.ordenacaoButtonText, ordemAtiva === 'nome' && styles.ordenacaoButtonTextAtivo]}>
            Nome {ordemAtiva === 'nome' && (ordemCrescente ? '↑' : '↓')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.ordenacaoButton, ordemAtiva === 'data' && styles.ordenacaoButtonAtivo]}
          onPress={() => {
            setOrdemAtiva('data');
            setOrdemCrescente(ordemAtiva === 'data' ? !ordemCrescente : true);
          }}
        >
          <Text style={[styles.ordenacaoButtonText, ordemAtiva === 'data' && styles.ordenacaoButtonTextAtivo]}>
            Data {ordemAtiva === 'data' && (ordemCrescente ? '↑' : '↓')}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.clientesList}>
        {clientesOrdenados.map((cliente) => (
          <TouchableOpacity 
            key={cliente.id} 
            style={styles.clienteCard}
            onPress={() => {
              setClienteSelecionado(cliente);
              setModalDetalhesVisible(true);
            }}
          >
            <View style={styles.clienteHeader}>
              <View style={styles.clienteNomeContainer}>
                <Text style={styles.clienteNome}>{cliente.nome}</Text>
                <View style={styles.clienteContato}>
                  <Ionicons name="call" size={16} color="#666" />
                  <Text style={styles.clienteTelefone}>{cliente.telefone}</Text>
                </View>
              </View>
            </View>
            <View style={styles.clienteInfo}>
              <View style={styles.infoRow}>
                <Ionicons name="location" size={16} color="#666" />
                <Text style={styles.infoText}>
                  {cliente.endereco.logradouro}, {cliente.endereco.cidade} - {cliente.endereco.estado}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="calendar" size={16} color="#666" />
                <Text style={styles.infoText}>Último contato: {cliente.ultimoContato}</Text>
              </View>
              {cliente.observacoes && (
                <View style={styles.infoRow}>
                  <Ionicons name="document-text" size={16} color="#666" />
                  <Text style={styles.infoText}>{cliente.observacoes}</Text>
                </View>
              )}
              {cliente.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {cliente.tags.map((tag) => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
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
            <Text style={styles.modalTitle}>Detalhes do Cliente</Text>
            <View style={styles.modalHeaderButtons}>
              <TouchableOpacity 
                style={styles.modalActionButton}
                onPress={() => {
                  setModalDetalhesVisible(false);
                  setNovoCliente(clienteSelecionado!);
                  setModalVisible(true);
                }}
              >
                <Ionicons name="create" size={24} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalActionButton}
                onPress={() => {
                  setClientes(clientes.filter(c => c.id !== clienteSelecionado?.id));
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
            {clienteSelecionado && (
              <>
                <View style={styles.detalheContainer}>
                  <Text style={styles.detalheLabel}>Nome</Text>
                  <Text style={styles.detalheValor}>{clienteSelecionado.nome}</Text>
                </View>

                <View style={styles.detalheContainer}>
                  <Text style={styles.detalheLabel}>Email</Text>
                  <Text style={styles.detalheValor}>{clienteSelecionado.email}</Text>
                </View>

                <View style={styles.detalheContainer}>
                  <Text style={styles.detalheLabel}>Telefone</Text>
                  <Text style={styles.detalheValor}>{clienteSelecionado.telefone}</Text>
                </View>

                <View style={styles.detalheContainer}>
                  <Text style={styles.detalheLabel}>Endereço</Text>
                  <Text style={styles.detalheValor}>{clienteSelecionado.endereco.logradouro}</Text>
                  <Text style={styles.detalheValor}>
                    {clienteSelecionado.endereco.cidade} - {clienteSelecionado.endereco.estado}
                  </Text>
                  <Text style={styles.detalheValor}>{clienteSelecionado.endereco.pais}</Text>
                  <Text style={styles.detalheValor}>CEP: {clienteSelecionado.endereco.cep}</Text>
                </View>

                <View style={styles.detalheContainer}>
                  <Text style={styles.detalheLabel}>Observações</Text>
                  <Text style={styles.detalheValor}>{clienteSelecionado.observacoes}</Text>
                </View>

                <View style={styles.detalheContainer}>
                  <Text style={styles.detalheLabel}>Último Contato</Text>
                  <Text style={styles.detalheValor}>{clienteSelecionado.ultimoContato}</Text>
                </View>

                {clienteSelecionado.tags.length > 0 && (
                  <View style={styles.detalheContainer}>
                    <Text style={styles.detalheLabel}>Situação</Text>
                    <View style={styles.tagsSelectorContainer}>
                      {clienteSelecionado.tags.map((tag) => (
                        <TouchableOpacity
                          key={tag}
                          style={[
                            styles.tagSelector,
                            clienteSelecionado.tags.includes(tag) && styles.tagSelectorActive
                          ]}
                          onPress={() => {
                            setClienteSelecionado(prev => {
                              if (!prev) return null;
                              const newTags = prev.tags.filter(t => t !== tag);
                              return { ...prev, tags: newTags };
                            });
                          }}
                        >
                          <Text style={[
                            styles.tagSelectorText,
                            clienteSelecionado.tags.includes(tag) && styles.tagSelectorTextActive
                          ]}>
                            {tag}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                <View style={styles.historicoContainer}>
                  <View style={styles.historicoHeader}>
                    <Text style={styles.historicoTitle}>Histórico de Interações</Text>
                    <TouchableOpacity 
                      style={styles.adicionarNotaButton}
                      onPress={() => {
                        setNotaEditavel(null);
                        setNovaNota({
                          tipo: 'visita',
                          descricao: ''
                        });
                        setModalNotaVisible(true);
                      }}
                    >
                      <Ionicons name="add" size={24} color="#007AFF" />
                    </TouchableOpacity>
                  </View>
                  {historicoCliente.map((item) => (
                    <View key={item.id} style={styles.historicoItem}>
                      <View style={styles.historicoHeader}>
                        <View style={styles.historicoDataContainer}>
                          <Ionicons 
                            name={
                              item.tipo === 'visita' ? 'walk' :
                              item.tipo === 'ligacao' ? 'call' :
                              item.tipo === 'email' ? 'mail' : 'document'
                            } 
                            size={16} 
                            color="#666" 
                          />
                          <Text style={styles.historicoData}>{item.data}</Text>
                        </View>
                        <View style={styles.historicoAcoes}>
                          <TouchableOpacity 
                            style={styles.acaoButton}
                            onPress={() => {
                              setNotaEditavel(item);
                              setNovaNota({
                                tipo: item.tipo,
                                descricao: item.descricao
                              });
                              setModalNotaVisible(true);
                            }}
                          >
                            <Ionicons name="create" size={16} color="#666" />
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={styles.acaoButton}
                            onPress={() => handleRemoverNota(item.id)}
                          >
                            <Ionicons name="trash" size={16} color="#ff3b30" />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={styles.historicoContent}>
                        <Text style={styles.historicoDescricao}>{item.descricao}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => {
          setModalVisible(false);
          setErroValidacao({});
        }}
        style={styles.modal}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalContent}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Novo Cliente</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.modalForm}
            keyboardShouldPersistTaps="handled"
          >
            {Object.values(erroValidacao).map((error) => (
              <View key={error} style={styles.erroContainer}>
                <Text style={styles.erroText}>{error}</Text>
              </View>
            ))}

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nome *</Text>
              <TextInput
                style={[styles.input, erroValidacao.nome && styles.inputError]}
                value={novoCliente.nome}
                onChangeText={(text) => setNovoCliente({...novoCliente, nome: text})}
                placeholder="Nome completo"
                accessibilityLabel="Campo de nome do cliente"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email *</Text>
              <TextInput
                style={styles.input}
                value={novoCliente.email}
                onChangeText={(text) => setNovoCliente({...novoCliente, email: text})}
                placeholder="email@exemplo.com"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Telefone *</Text>
              <TextInput
                style={[styles.input, erroValidacao.telefone && styles.inputError]}
                value={novoCliente.telefone}
                onChangeText={(text) => {
                  const formatado = formatarTelefone(text);
                  setNovoCliente({...novoCliente, telefone: formatado});
                }}
                placeholder="(00) 00000-0000"
                keyboardType="numeric"
                maxLength={15}
                accessibilityLabel="Campo de telefone do cliente"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Endereço</Text>
              <TextInput
                style={styles.input}
                value={novoCliente.endereco.logradouro}
                onChangeText={(text) => setNovoCliente({
                  ...novoCliente,
                  endereco: { ...novoCliente.endereco, logradouro: text }
                })}
                placeholder="Logradouro"
              />
              <TextInput
                style={styles.input}
                value={novoCliente.endereco.cidade}
                onChangeText={(text) => setNovoCliente({
                  ...novoCliente,
                  endereco: { ...novoCliente.endereco, cidade: text }
                })}
                placeholder="Cidade"
              />
              <TextInput
                style={styles.input}
                value={novoCliente.endereco.estado}
                onChangeText={(text) => setNovoCliente({
                  ...novoCliente,
                  endereco: { ...novoCliente.endereco, estado: text }
                })}
                placeholder="Estado"
              />
              <TextInput
                style={styles.input}
                value={novoCliente.endereco.pais}
                onChangeText={(text) => setNovoCliente({
                  ...novoCliente,
                  endereco: { ...novoCliente.endereco, pais: text }
                })}
                placeholder="País"
              />
              <TextInput
                style={styles.input}
                value={novoCliente.endereco.cep}
                onChangeText={(text) => {
                  const formatado = formatarCEP(text);
                  setNovoCliente({
                    ...novoCliente,
                    endereco: { ...novoCliente.endereco, cep: formatado }
                  });
                }}
                placeholder="CEP"
                keyboardType="numeric"
                maxLength={9}
                accessibilityLabel="Campo de CEP do cliente"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Observações</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={novoCliente.observacoes}
                onChangeText={(text) => setNovoCliente({...novoCliente, observacoes: text})}
                placeholder="Observações sobre o cliente"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Último Contato *</Text>
              <TextInput
                style={[styles.input, erroValidacao.data && styles.inputError]}
                value={novoCliente.ultimoContato}
                onChangeText={(text) => setNovoCliente({...novoCliente, ultimoContato: text})}
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
                maxLength={10}
                accessibilityLabel="Campo de data do último contato"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Situação</Text>
              <View style={styles.tagsSelectorContainer}>
                {tagsDisponiveis.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.tagSelector,
                      novoCliente.tags.includes(tag) && styles.tagSelectorActive
                    ]}
                    onPress={() => toggleTag(tag)}
                  >
                    <Text style={[
                      styles.tagSelectorText,
                      novoCliente.tags.includes(tag) && styles.tagSelectorTextActive
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
              onPress={() => {
                setModalVisible(false);
                setErroValidacao({});
              }}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleAdicionarCliente}
            >
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        isVisible={modalNotaVisible}
        onBackdropPress={() => {
          setModalNotaVisible(false);
          setNotaEditavel(null);
        }}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {notaEditavel ? 'Editar Nota' : 'Nova Nota'}
            </Text>
            <TouchableOpacity onPress={() => {
              setModalNotaVisible(false);
              setNotaEditavel(null);
            }}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalForm}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Tipo</Text>
              <View style={styles.tipoContainer}>
                {(['visita', 'ligacao', 'email', 'documento'] as const).map((tipo) => (
                  <TouchableOpacity
                    key={tipo}
                    style={[
                      styles.tipoButton,
                      novaNota.tipo === tipo && styles.tipoButtonAtivo
                    ]}
                    onPress={() => setNovaNota({...novaNota, tipo})}
                  >
                    <Ionicons 
                      name={
                        tipo === 'visita' ? 'walk' :
                        tipo === 'ligacao' ? 'call' :
                        tipo === 'email' ? 'mail' : 'document'
                      } 
                      size={16} 
                      color={novaNota.tipo === tipo ? 'white' : '#666'} 
                    />
                    <Text style={[
                      styles.tipoButtonText,
                      novaNota.tipo === tipo && styles.tipoButtonTextAtivo
                    ]}>
                      {tipo === 'visita' ? 'Visita' :
                       tipo === 'ligacao' ? 'Ligação' :
                       tipo === 'email' ? 'Email' : 'Documento'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Descrição</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={novaNota.descricao}
                onChangeText={(text) => setNovaNota({...novaNota, descricao: text})}
                placeholder="Descreva a interação..."
                multiline
                numberOfLines={4}
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => {
                setModalNotaVisible(false);
                setNotaEditavel(null);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={notaEditavel ? handleEditarNota : handleAdicionarNota}
            >
              <Text style={styles.saveButtonText}>
                {notaEditavel ? 'Salvar' : 'Adicionar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
  clientesList: {
    flex: 1,
    padding: 20,
  },
  clienteCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  clienteHeader: {
    marginBottom: 10,
  },
  clienteNomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  clienteNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  clienteContato: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  clienteTelefone: {
    marginLeft: 5,
    color: '#666',
    fontSize: 14,
  },
  clienteInfo: {
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoText: {
    marginLeft: 5,
    color: '#666',
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
  modalForm: {
    padding: 20,
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
  erroContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  erroText: {
    color: '#c62828',
    fontSize: 14,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#007AFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  tag: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  tagSelected: {
    backgroundColor: '#007AFF',
  },
  tagText: {
    color: '#666',
    fontSize: 12,
  },
  tagTextSelected: {
    color: 'white',
  },
  detalheContainer: {
    marginBottom: 20,
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
  filtrosContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filtroButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
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
  buscaContainer: {
    padding: 10,
    backgroundColor: 'white',
  },
  buscaInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  ordenacaoContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  ordenacaoButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  ordenacaoButtonAtivo: {
    backgroundColor: '#007AFF',
  },
  ordenacaoButtonText: {
    color: '#666',
    fontSize: 14,
  },
  ordenacaoButtonTextAtivo: {
    color: 'white',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  erroTexto: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 4,
  },
  historicoContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  historicoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  adicionarNotaButton: {
    padding: 8,
  },
  historicoAcoes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  acaoButton: {
    padding: 8,
    marginLeft: 8,
  },
  historicoContent: {
    marginTop: 8,
  },
  historicoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  historicoItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  historicoDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historicoData: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  historicoDescricao: {
    color: '#333',
    fontSize: 14,
  },
  tipoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tipoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    gap: 4,
  },
  tipoButtonAtivo: {
    backgroundColor: '#007AFF',
  },
  tipoButtonText: {
    color: '#666',
    fontSize: 14,
  },
  tipoButtonTextAtivo: {
    color: 'white',
  },
  modalHeaderButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalActionButton: {
    padding: 4,
  },
  tagsSelectorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  tagSelector: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  tagSelectorActive: {
    backgroundColor: '#007AFF',
  },
  tagSelectorText: {
    color: '#666',
    fontSize: 12,
  },
  tagSelectorTextActive: {
    color: 'white',
  },
}); 