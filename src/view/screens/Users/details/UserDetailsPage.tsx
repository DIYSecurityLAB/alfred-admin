import { ListedUser } from '@/domain/entities/User';
import { UseCases } from '@/domain/usecases/UseCases';
import { Container } from '@/view/components/Container';
import { Loading } from '@/view/components/Loading';
import { PageHeader } from '@/view/layout/Page/PageHeader';
import { ROUTES } from '@/view/routes/Routes';
import { useQuery } from '@tanstack/react-query';
import { parse } from 'date-fns';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CreditCard,
  ExternalLink,
  File,
  User,
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value);
  };

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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
      <PageHeader
        title="Detalhes do Usuário"
        description="Visualize as informações detalhadas do usuário"
        button={
          <button
            onClick={goBack}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>
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
          <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
            <User className="h-5 w-5 text-blue-500 mr-2" />
            Informações do Usuário
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Username</p>
              <p className="font-medium text-gray-800">
                {user.username || 'N/A'}
              </p>
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

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Nível</p>
              <span
                className={`px-2.5 py-1 rounded-full text-sm font-medium border inline-flex ${getLevelClass(user.level)}`}
              >
                {getLevelName(user.level)}
              </span>
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
