import {
  ReportDepositResendReq,
  ReportDepositResendRes,
} from '@/data/repositories/report.repository';
import { UseCases } from '@/domain/usecases/UseCases';
import { useCallback, useState } from 'react';

export function useResendOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ReportDepositResendRes | null>(null);

  const resendOrder = useCallback(
    async (req: ReportDepositResendReq) => {
      setIsLoading(true);
      setError(null);
      setData(null);

      try {
        await UseCases.report.deposit.resendOrder.execute(req);
      } catch (err) {
        setError('Erro ao reenviar pedido ' + err);
      } finally {
        setIsLoading(false);
      }
    },
    [UseCases],
  );

  return {
    resendOrder,
    isLoading,
    error,
    data,
  };
}
