import { ListedUser } from '@/domain/entities/User';
import { UseCases } from '@/domain/usecases/UseCases';
import { Container } from '@/view/components/Container';
import { Loading } from '@/view/components/Loading';
import { PageHeader } from '@/view/layout/Page/PageHeader';
import { ROUTES } from '@/view/routes/Routes';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { parse } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CreditCard,
  Edit,
  ExternalLink,
  File,
  Loader2,
  Save,
  ShieldAlert,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';
import React from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

const getLevelName = (level: number): string => {
  switch (level) {
    case 0:
      return 'Madeira';
    case 1:
      return 'Bronze';
    case 2:
      return 'Prata';
    case 3:
      return 'Ouro';
    case 4:
      return 'Platina';
    case 5:
      return 'Diamante';
    default:
      return `Nível ${level}`;
  }
};

export function UserDetailsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedStatus = searchParams.get('status') || 'all';
  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchParams({ status: event.target.value });
  };

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Estados para edição
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editLevel, setEditLevel] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchUserDetails = React.useCallback(async () => {
    if (!id) throw new Error('ID não fornecido');

    const { result } = await UseCases.user.list.execute({
      page: 0,
      itemsPerPage: 1,
      userId: id,
      username: undefined,
    });

    if (result.type === 'ERROR') {
      throw new Error(
        result.error?.code || 'Erro ao carregar detalhes do usuário',
      );
    }

    if (!result.data) {
      throw new Error('Usuário não encontrado');
    }

    return result.data.data[0] as ListedUser;
  }, [id]);

  const {
    data: user,
    isLoading,
    error,
  } = useQuery<ListedUser>({
    queryKey: ['userDetails', id],
    queryFn: fetchUserDetails,
  });

  const handleStartEditing = () => {
    if (user) {
      setEditUsername(user.username || '');
      setEditLevel(user.level);
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const confirmSave = () => {
    setShowConfirmModal(true);
  };

  const cancelSave = () => {
    setShowConfirmModal(false);
  };

  const handleSaveChanges = async () => {
    if (!id || !user) return;

    setIsSubmitting(true);
    setShowConfirmModal(false);

    try {
      // Envie apenas os dados que realmente precisam ser atualizados
      const { result } = await UseCases.user.update.execute({
        id,
        data: {
          username: editUsername || undefined,
          level: editLevel,
        },
      });

      if (result.type === 'ERROR') {
        toast.error(`Erro ao atualizar usuário: ${result.error.code}`);
        return;
      }

      toast.success('Usuário atualizado com sucesso!');
      setIsEditing(false);

      // Recarrega os dados do usuário
      queryClient.invalidateQueries({ queryKey: ['userDetails', id] });
    } catch (error) {
      console.error('Erro detalhado:', error);
      toast.error(
        'Erro ao atualizar usuário. Verifique o console para mais detalhes.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const sortedDeposits = [...(user?.deposits ?? [])].sort((a, b) => {
    const dateA = parse(
      a.transactionDate,
      'dd/MM/yyyy hh:mm:ss a',
      new Date(),
    ).getTime();
    const dateB = parse(
      b.transactionDate,
      'dd/MM/yyyy hh:mm:ss a',
      new Date(),
    ).getTime();
    return dateB - dateA; // Mais recente primeiro
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'complete':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'canceled':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelClass = (level: number) => {
    if (level >= 4) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (level >= 3) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (level >= 2) return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const goBack = () => navigate(-1);

  if (isLoading) {
    return <Loading label="Carregando detalhes do usuário..." />;
  }

  if (error || !user) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="bg-yellow-50 p-3 rounded-full mb-4">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
          <h3 className="text-xl font-medium mb-2 text-gray-800">
            {error instanceof Error ? error.message : 'Usuário não encontrado'}
          </h3>
          <button
            onClick={goBack}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors mt-4"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {/* Modal de confirmação */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
            >
              <div className="flex items-center mb-4 text-amber-500">
                <ShieldAlert className="h-8 w-8 mr-3" />
                <h3 className="text-xl font-semibold">Confirmar alterações</h3>
              </div>

              <p className="text-gray-600 mb-6">
                Tem certeza que deseja salvar as alterações feitas no usuário?
              </p>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="mb-3">
                  <span className="text-gray-500 text-sm">
                    Nome de usuário:
                  </span>
                  <p className="font-medium">{editUsername || 'Sem nome'}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Nível:</span>
                  <p className="font-medium">{getLevelName(editLevel)}</p>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={cancelSave}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
                >
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Confirmar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay de carregamento */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white bg-opacity-70 z-50 flex flex-col items-center justify-center"
          >
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
            <p className="text-lg font-medium text-gray-700">
              Atualizando usuário...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <PageHeader
        title="Detalhes do Usuário"
        description="Visualize as informações detalhadas do usuário"
        button={
          <div className="flex gap-2">
            {!isEditing ? (
              <button
                onClick={handleStartEditing}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
              >
                <Edit className="h-5 w-5" />
                Editar Usuário
              </button>
            ) : null}
            <button
              onClick={goBack}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Voltar
            </button>
          </div>
        }
        collapsed={false}
        toggle={() => {}}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden p-6 space-y-8"
      >
        <div className="border-b border-gray-100 pb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center text-gray-800">
              <User className="h-5 w-5 text-blue-500 mr-2" />
              Informações do Usuário
            </h2>

            {isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={confirmSave}
                  disabled={isSubmitting}
                  className="flex items-center gap-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 shadow-sm"
                >
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                  className="flex items-center gap-1 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              className={`p-4 ${isEditing ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'} rounded-lg transition-colors duration-300`}
            >
              <p className="text-sm text-gray-500 mb-1">Username</p>
              {isEditing ? (
                <div className="relative">
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full p-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    placeholder="Digite o nome de usuário"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Edit className="h-4 w-4 text-blue-400" />
                  </div>
                </div>
              ) : (
                <p className="font-medium text-gray-800">
                  {user.username || 'N/A'}
                </p>
              )}
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">ID do Usuário</p>
              <p className="font-medium text-gray-800 break-all">{user.id}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Provider ID</p>
              <p className="font-medium text-gray-800">
                {user.providerId || 'N/A'}
              </p>
            </div>

            <div
              className={`p-4 ${isEditing ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'} rounded-lg transition-colors duration-300`}
            >
              <p className="text-sm text-gray-500 mb-1">Nível</p>
              {isEditing ? (
                <div className="relative">
                  <select
                    value={editLevel}
                    onChange={(e) => setEditLevel(Number(e.target.value))}
                    className="w-full p-2 border border-blue-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm pr-10"
                  >
                    <option value="0">0 - Madeira</option>
                    <option value="1">1 - Bronze</option>
                    <option value="2">2 - Prata</option>
                    <option value="3">3 - Ouro</option>
                    <option value="4">4 - Platina</option>
                    <option value="5">5 - Diamante</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Edit className="h-4 w-4 text-blue-400" />
                  </div>
                </div>
              ) : (
                <span
                  className={`px-2.5 py-1 rounded-full text-sm font-medium border inline-flex ${getLevelClass(user.level)}`}
                >
                  {getLevelName(user.level)}
                </span>
              )}
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <span
                className={`px-2.5 py-1 rounded-full text-sm font-medium ${user.isActive ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}
              >
                {user.isActive ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Data de Criação</p>
                  <p className="font-medium text-gray-800">{user.createdAt}</p>
                </div>
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Última Atualização
                  </p>
                  <p className="font-medium text-gray-800">{user.updatedAt}</p>
                </div>
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-700 flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
              <p>
                Você está editando informações do usuário. As alterações serão
                aplicadas imediatamente após salvar. Certifique-se de verificar
                os dados antes de confirmar.
              </p>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3 flex items-center text-gray-800">
            <File className="h-5 w-5 text-gray-500 mr-2" />
            Documentos
          </h3>

          {user.documents && user.documents.length > 0 ? (
            <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                      Tipo
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                      Número
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                      País
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                      Verificado
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                      Data de Expiração
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {user.documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {doc.documentType}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {doc.documentNumber}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {doc.countryCode}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${doc.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                        >
                          {doc.isVerified ? 'Sim' : 'Não'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {doc.expirationDate ? doc.expirationDate : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 italic">Nenhum documento registrado.</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
            <CreditCard className="h-5 w-5 text-green-500 mr-2" />
            Histórico de Depósitos
            <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {user.deposits?.length || 0}
            </span>
          </h2>

          <div className="flex items-center mb-4">
            <h3 className="mr-2">Filtrar por Status:</h3>
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="flex items-center px-4 py-2 border rounded"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="canceled">Canceled</option>
              <option value="review">Review</option>
              <option value="expired">Expired</option>
              <option value="refunded">Refunded</option>
              <option value="complete">Complete</option>
            </select>
          </div>

          {user.deposits && user.deposits.length > 0 ? (
            <div className="bg-white border border-gray-100 rounded-lg overflow-x-hidden shadow-sm">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                      Data
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                      Valor (R$)
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                      Valor Crypto
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                      Crypto
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                      Método
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sortedDeposits
                    .filter(
                      (deposit) =>
                        selectedStatus === 'all' ||
                        deposit.status === selectedStatus,
                    ) // Filtro de Status
                    .map((deposit) => (
                      <motion.tr
                        key={deposit.id}
                        className="hover:bg-gray-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ scale: 1.01, x: 5 }}
                      >
                        <td className="py-3 px-4 text-sm text-gray-800">
                          {deposit.transactionDate}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800 font-medium">
                          {formatCurrency(deposit.valueBRL)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800">
                          {deposit.assetValue} {deposit.cryptoType}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800">
                          {deposit.cryptoType || 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(deposit.status)}`}
                          >
                            {deposit.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800">
                          {deposit.paymentMethod}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            title="Ver detalhes"
                            onClick={() =>
                              navigate(ROUTES.sales.details.call(deposit.id))
                            }
                          >
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 italic">Nenhum depósito registrado.</p>
          )}
        </div>
      </motion.div>
    </Container>
  );
}
