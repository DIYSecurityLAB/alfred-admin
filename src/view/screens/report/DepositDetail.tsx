import { ReportedDeposit } from '@/domain/entities/report.entity';
import { UseCases } from '@/domain/usecases/UseCases';
import { useAuth } from '@/hooks/useAuth';
import { Permission } from '@/models/permissions';
import { Container } from '@/view/components/Container';
import { Error } from '@/view/components/Error';
import { Loading } from '@/view/components/Loading';
import { PageHeader } from '@/view/layout/Page/PageHeader';
import { ROUTES } from '@/view/routes/Routes';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  Bitcoin,
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  CreditCard,
  ExternalLink,
  Globe,
  LockIcon,
  Package,
  Tag,
  User,
  XCircle,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    const statusLower = status.toLowerCase();

    if (statusLower === 'complete' || statusLower === 'paid') {
      return {
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-200',
        icon: <CheckCircle className="w-4 h-4 mr-2" />,
        label: 'Completo',
      };
    }

    if (statusLower === 'pending' || statusLower === 'review') {
      return {
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-200',
        icon: <Clock className="w-4 h-4 mr-2" />,
        label: 'Pendente',
      };
    }

    if (statusLower === 'canceled' || statusLower === 'expired') {
      return {
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        borderColor: 'border-red-200',
        icon: <XCircle className="w-4 h-4 mr-2" />,
        label: statusLower === 'canceled' ? 'Cancelado' : 'Expirado',
      };
    }

    return {
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      borderColor: 'border-gray-200',
      icon: null,
      label: status.charAt(0).toUpperCase() + status.slice(1),
    };
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`px-4 py-1.5 rounded-full text-sm font-medium inline-flex items-center ${config.bgColor} ${config.textColor} border ${config.borderColor}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};

const InfoCard = ({
  icon: Icon,
  title,
  value,
  className = '',
  iconColor = 'text-blue-600',
  iconBgColor = 'bg-blue-50',
}: {
  icon: React.ElementType;
  title: string;
  value: string | number;
  className?: string;
  iconColor?: string;
  iconBgColor?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${className}`}
  >
    <div className="flex items-center gap-4">
      <div className={`p-3 ${iconBgColor} rounded-lg`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-lg font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </motion.div>
);

const CopyableField = ({ label, value }: { label: string; value: string }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    toast.success('Copiado para a área de transferência!');
  };

  return (
    <div className="group">
      <p className="text-sm text-gray-500">{label}</p>
      <div className="flex items-center justify-between">
        <p className="text-gray-900 font-medium break-all pr-2">{value}</p>
        <button
          onClick={copyToClipboard}
          className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all duration-200"
          title="Copiar para área de transferência"
        >
          <Copy className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export function DepositDetail() {
  const { hasPermission } = useAuth();
  const canManageSales = hasPermission(Permission.SALES_MANAGE);

  const { depositId } = useParams<{ depositId: string }>();
  const [deposit, setDeposit] = useState<ReportedDeposit>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchDeposit = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { result } = await UseCases.report.deposit.one.execute({
        id: String(depositId),
      });

      if (result.type === 'ERROR') {
        setError(
          result.error?.code ||
            'Não foi possível buscar os detalhes do depósito',
        );
        return;
      }

      setDeposit(result.data);
    } catch (error) {
      console.error('Erro ao buscar depósitos:', error);
      setError('Ocorreu um erro ao buscar os detalhes do depósito');
    } finally {
      setLoading(false);
    }
  }, [depositId]);

  useEffect(() => {
    fetchDeposit();
  }, [fetchDeposit]);

  const handleBack = () => {
    navigate(ROUTES.sales.home || '/sales');
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const safeToFixed = (value: any, digits: number = 2): string => {
    if (value === undefined || value === null)
      return '0'.padEnd(digits + 2, '0');
    if (typeof value !== 'number' || isNaN(value))
      return '0'.padEnd(digits + 2, '0');
    return value.toFixed(digits);
  };

  if (loading) {
    return <Loading label="Carregando detalhes do depósito..." />;
  }

  if (error) {
    return <Error error={error} clear={() => setError(null)} />;
  }

  if (!deposit) {
    return (
      <Container>
        <PageHeader
          title="Depósito não encontrado"
          description="Não foi possível encontrar os detalhes deste depósito"
          button={<></>}
          collapsed={false}
          toggle={() => {}}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 rounded-lg shadow-md border border-gray-100 text-center"
        >
          <div className="bg-red-50 p-3 rounded-full inline-flex mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-medium mb-2 text-gray-800">
            Depósito não encontrado
          </h2>
          <p className="text-gray-600 mb-6">
            O depósito que você está procurando não está disponível ou não
            existe.
          </p>
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar para lista de depósitos</span>
          </button>
        </motion.div>
      </Container>
    );
  }

  return (
    <Container>
      <PageHeader
        title="Detalhes do Depósito"
        description={`Informações ${canManageSales ? 'completas' : 'básicas'} sobre o depósito: ${deposit?.transactionId.substring(0, 8) || ''}`}
        button={
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>
        }
        collapsed={false}
        toggle={() => {}}
      />

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-lg shadow-md border border-gray-100 p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Package className="h-5 w-5 text-blue-500" />
                <h2 className="text-xl font-bold text-gray-900">
                  Transação: {deposit.transactionId.substring(0, 12)}...
                </h2>
              </div>
              <p className="text-gray-500 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {deposit.transactionDate}
              </p>
            </div>
            <StatusBadge status={deposit.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <InfoCard
              icon={CreditCard}
              title="Valor em BRL"
              value={`R$ ${deposit.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              iconColor="text-green-600"
              iconBgColor="bg-green-50"
            />
            <InfoCard
              icon={Bitcoin}
              title={`Valor em ${deposit.cryptoType}`}
              value={`${safeToFixed(deposit.cryptoValue, 8)} ${deposit.cryptoType}`}
              iconColor="text-amber-600"
              iconBgColor="bg-amber-50"
            />
            <InfoCard
              icon={User}
              title="Usuário"
              value={deposit.username || 'N/A'}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-50"
            />
          </div>

          {!canManageSales && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start">
              <LockIcon className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-blue-800 font-medium">
                  Visualização Limitada
                </h3>
                <p className="text-blue-600 text-sm">
                  Você está visualizando detalhes limitados. Para acesso
                  completo, contacte um administrador.
                </p>
              </div>
            </div>
          )}

          {/* Exibir detalhes avançados somente para quem pode gerenciar */}
          {canManageSales && (
            <>
              {/* Seção de detalhes da transação */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-50 rounded-lg p-6 mb-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-500" />
                  Detalhes do Pagamento
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <CopyableField
                      label="ID da Transação"
                      value={deposit.transactionId}
                    />
                    <CopyableField label="ID do Depósito" value={deposit.id} />
                    <div>
                      <p className="text-sm text-gray-500">
                        Método de Pagamento
                      </p>
                      <p className="text-gray-900 font-medium">
                        {deposit.paymentMethod}
                      </p>
                    </div>
                    {deposit.valueCollected > 0 && (
                      <div>
                        <p className="text-sm text-gray-500">
                          Valor Coletado (Taxa)
                        </p>
                        <p className="text-gray-900 font-medium">
                          R$ {safeToFixed(deposit.valueCollected, 2)}
                        </p>
                      </div>
                    )}
                    {deposit.coupon && (
                      <div>
                        <p className="text-sm text-gray-500">Cupom Aplicado</p>
                        <div className="flex items-center">
                          <Tag className="w-4 h-4 text-blue-500 mr-2" />
                          <p className="text-gray-900 font-medium">
                            {deposit.coupon}
                          </p>
                        </div>
                      </div>
                    )}
                    {deposit.discountValue > 0 && (
                      <div>
                        <p className="text-sm text-gray-500">
                          Desconto Aplicado
                        </p>
                        <p className="text-gray-900 font-medium">
                          {deposit.discountType === 'fixed'
                            ? `R$ ${safeToFixed(deposit.discountValue, 2)}`
                            : `${deposit.discountValue || 0}%`}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Usuário</p>
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <p className="text-gray-900 font-medium">
                          {deposit.username || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Status do Pagamento
                      </p>
                      <StatusBadge status={deposit.status} />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Seção de detalhes de criptomoeda */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-50 rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Bitcoin className="w-5 h-5 text-amber-500" />
                  Detalhes da Criptomoeda
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Tipo de Criptomoeda
                      </p>
                      <p className="text-gray-900 font-medium">
                        {deposit.cryptoType}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Valor em Crypto</p>
                      <p className="text-gray-900 font-medium">
                        {safeToFixed(deposit.cryptoValue, 8)}{' '}
                        {deposit.cryptoType}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Rede</p>
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 text-gray-400 mr-2" />
                        <p className="text-gray-900 font-medium">
                          {deposit.network}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <CopyableField label="Wallet" value={deposit.coldWallet} />

                    <div>
                      <button
                        onClick={() =>
                          window.open(
                            `https://www.blockchain.com/explorer/addresses/btc/${deposit.coldWallet}`,
                            '_blank',
                          )
                        }
                        className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Ver na Blockchain
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}

          {/* Mensagens de status são visíveis para todos */}
          <AnimatePresence>
            {deposit.status === 'expired' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 p-4 bg-red-50 rounded-lg border border-red-100 flex items-start"
              >
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-red-800 font-medium">
                    Depósito Expirado
                  </h3>
                  <p className="text-red-600 text-sm">
                    Esta transação expirou. Por favor, solicite que o usuário
                    inicie uma nova transação se desejar realizar um depósito.
                  </p>
                </div>
              </motion.div>
            )}

            {deposit.status === 'canceled' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 p-4 bg-red-50 rounded-lg border border-red-100 flex items-start"
              >
                <XCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-red-800 font-medium">
                    Depósito Cancelado
                  </h3>
                  <p className="text-red-600 text-sm">
                    Esta transação foi cancelada. Por favor, verifique com o
                    usuário se deseja iniciar uma nova transação.
                  </p>
                </div>
              </motion.div>
            )}

            {deposit.status === 'complete' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100 flex items-start"
              >
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-green-800 font-medium">
                    Depósito Concluído
                  </h3>
                  <p className="text-green-600 text-sm">
                    Esta transação foi concluída com sucesso.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </Container>
  );
}
