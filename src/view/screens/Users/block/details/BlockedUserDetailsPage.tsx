import { ListAllBlockedUser } from '@/domain/entities/User';
import { UseCases } from '@/domain/usecases/UseCases';
import { Container } from '@/view/components/Container';
import { Loading } from '@/view/components/Loading';
import { PageHeader } from '@/view/layout/Page/PageHeader';
import { ROUTES } from '@/view/routes/Routes';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CreditCard,
  ExternalLink,
  File,
  Shield,
  User,
} from 'lucide-react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function BlockedUserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const fetchBlockedUserDetails = React.useCallback(async () => {
    if (!id) throw new Error('ID não fornecido');

    const { result } = await UseCases.user.block.list.execute({
      page: 1,
      itemsPerPage: 1,
      userId: id,
    });

    if (result.type === 'ERROR') {
      throw new Error(
        result.error?.code || 'Erro ao carregar detalhes do usuário',
      );
    }

    if (!Array.isArray(result.data) || result.data.length === 0) {
      throw new Error('Usuário bloqueado não encontrado');
    }

    return result.data[0];
  }, [id]);

  const {
    data: blockedUser,
    isLoading,
    error,
  } = useQuery<ListAllBlockedUser>({
    queryKey: ['blockedUserDetails', id],
    queryFn: fetchBlockedUserDetails,
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const goBack = () => navigate(-1);

  if (isLoading) {
    return <Loading label="Carregando detalhes do usuário bloqueado..." />;
  }

  if (error || !blockedUser) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="bg-yellow-50 p-3 rounded-full mb-4">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
          <h3 className="text-xl font-medium mb-2 text-gray-800">
            {error instanceof Error
              ? error.message
              : 'Usuário bloqueado não encontrado'}
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
        title="Detalhes do Usuário Bloqueado"
        description="Visualize as informações detalhadas do bloqueio e do usuário"
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
            <Shield className="h-5 w-5 text-red-500 mr-2" />
            Informações do Bloqueio
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">ID do Bloqueio</p>
              <p className="font-medium text-gray-800 break-all">
                {blockedUser.id}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Motivo</p>
              <p className="font-medium text-gray-800">
                {blockedUser.reason || 'Não especificado'}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Data do Bloqueio</p>
                  <p className="font-medium text-gray-800">
                    {blockedUser.createdAt}
                  </p>
                </div>
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-100 pb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
            <User className="h-5 w-5 text-blue-500 mr-2" />
            Informações do Usuário
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Username</p>
              <p className="font-medium text-gray-800">
                {blockedUser.user.username || 'N/A'}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">ID do Usuário</p>
              <p className="font-medium text-gray-800 break-all">
                {blockedUser.userId}
              </p>
            </div>
          </div>

          <h3 className="text-lg font-medium mb-3 flex items-center text-gray-800">
            <File className="h-5 w-5 text-gray-500 mr-2" />
            Documentos
          </h3>

          {blockedUser.user.documents &&
          blockedUser.user.documents.length > 0 ? (
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {blockedUser.user.documents.map((doc) => (
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
              {blockedUser.user.depositos?.length || 0}
            </span>
          </h2>

          {blockedUser.user.depositos &&
          blockedUser.user.depositos.length > 0 ? (
            <div className="bg-white border border-gray-100 rounded-lg overflow-x-hidden shadow-sm">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                      Data
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                      Valor
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                      Crypto
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                      ID da Transação
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {blockedUser.user.depositos.map((deposito) => (
                    <motion.tr
                      key={deposito.id}
                      className="hover:bg-gray-50"
                      whileHover={{ scale: 1.01, x: 5 }}
                    >
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {deposito.createdAt}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800 font-medium">
                        {formatCurrency(deposito.valorBRL)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {deposito.cryptoType || 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(deposito.status)}`}
                        >
                          {deposito.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 font-mono">
                        {deposito.transactionId.substring(0, 10)}...
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          title="Ver detalhes"
                          onClick={() =>
                            navigate(ROUTES.sales.details.call(deposito.id))
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
