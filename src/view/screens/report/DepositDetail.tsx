import { ReportedDeposit } from '@/domain/entities/report.entity';
import { UseCases } from '@/domain/usecases/UseCases';
import {
  AlertCircle,
  ArrowLeft,
  Clock,
  CreditCard,
  Globe,
  Receipt,
  Smartphone,
  Wallet,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ROUTES } from '../../routes/Routes';

const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    canceled: 'bg-red-100 text-red-800',
    expired: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status as keyof typeof statusStyles]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const InfoCard = ({
  icon: Icon,
  title,
  value,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  title: string;
  value: string | number;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-blue-50 rounded-lg">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-lg font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

export function DepositDetail() {
  const { depositId } = useParams<{ depositId: string }>();
  const [deposit, setDeposit] = useState<ReportedDeposit>();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDeposits = useCallback(async () => {
    setLoading(true);
    try {
      const { result } = await UseCases.report.deposit.one.execute({
        id: String(depositId),
      });

      if (result.type === 'ERROR') {
        return;
      }

      setDeposit(result.data);
    } catch (error) {
      console.error('Erro ao buscar depósitos:', error);
    } finally {
      setLoading(false);
    }
  }, [depositId]);

  useEffect(() => {
    fetchDeposits();
  }, [fetchDeposits]);

  if (!deposit) {
    return (
      <>
        {loading && <>Loading...</>}
        {!loading && <div className="text-red-500">Cupom não encontrado.</div>}
      </>
    );
  }

  return (
    <div className=" bg-gray-50 max-w-7xl mx-auto px-4 py-8 rounded-md">
      <div className="mb-8">
        <Link
          to={ROUTES.sales.home}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar para Depósitos
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Detalhes do Depósito
            </h1>
            <p className="text-gray-500">
              ID da Transação: {deposit.transactionId}
            </p>
          </div>
          <StatusBadge status={deposit.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <InfoCard
          icon={CreditCard}
          title="Valor em BRL"
          value={`R$ ${deposit.valueBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
        />
        <InfoCard
          icon={Wallet}
          title="Valor em BTC"
          value={deposit.assetValue.toFixed(8)}
        />
        <InfoCard
          icon={Clock}
          title="Data da Transação"
          value={deposit.transactionDate}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Informações Detalhadas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">ID do Depósito</p>
              <p className="text-gray-900 font-medium">{deposit.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Telefone</p>
              <div className="flex items-center">
                <Smartphone className="w-4 h-4 text-gray-400 mr-2" />
                <p className="text-gray-900 font-medium">{deposit.phone}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Carteira</p>
              <div className="flex items-center">
                <Wallet className="w-4 h-4 text-gray-400 mr-2" />
                <p className="text-gray-900 font-medium">
                  {deposit.coldWallet}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Rede</p>
              <div className="flex items-center">
                <Globe className="w-4 h-4 text-gray-400 mr-2" />
                <p className="text-gray-900 font-medium">{deposit.network}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Método de Pagamento</p>
              <div className="flex items-center">
                <CreditCard className="w-4 h-4 text-gray-400 mr-2" />
                <p className="text-gray-900 font-medium">
                  {deposit.paymentMethod}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Cupom</p>
              <div className="flex items-center">
                <Receipt className="w-4 h-4 text-gray-400 mr-2" />
                <p className="text-gray-900 font-medium">
                  {deposit.coupon || 'Nenhum cupom aplicado'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {deposit.status === 'expired' && (
          <div className="mt-6 p-4 bg-red-50 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
            <div>
              <h3 className="text-red-800 font-medium">Depósito Expirado</h3>
              <p className="text-red-600 text-sm">
                Esta transação expirou. Por favor, solicite que inicie uma nova
                transação se desejar realizar um depósito.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
