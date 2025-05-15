import { RemoteDataSource } from '@/data/datasource/Remote.datasource';
import { ConfigRepositoryImpl } from '@/data/repositories/config.repository';
import { ReportRepositoryImpl } from '@/data/repositories/report.repository';
import { UserRepositoryImpl } from '@/data/repositories/user.repository';
import { ListConfigUseCaseImpl } from './config/list.usecase';
import { UpdateConfigUseCaseImpl } from './config/update.usecase';
import { ReportDepositAllUseCaseImpl } from './report/deposit-all.usecase';
import { ReportDepositOneUseCaseImpl } from './report/deposit-one.usecase';
import { ReportDepositPaginatedUseCaseImpl } from './report/deposit-paginated.usecase';
import { DepositResendUseCaseImpl } from './report/deposit-resend.usecase';
import { BlockUserUseCaseImpl } from './user/blocked/block.usecase';
import { ListBlockedUserUseCaseImpl } from './user/blocked/list-all.usecase';
import { ListAllUserCaseImpl } from './user/list-all.usecase';
import { UpdateUserUseCaseImpl } from './user/update.usecase';

const API = new RemoteDataSource(String(import.meta.env.VITE_API_URL));

const ConfigRepository = new ConfigRepositoryImpl(API);
const UserRepository = new UserRepositoryImpl(API);
const reportRepository = new ReportRepositoryImpl(API);

export const UseCases = {
  config: {
    list: new ListConfigUseCaseImpl(ConfigRepository),
    update: new UpdateConfigUseCaseImpl(ConfigRepository),
  },
  user: {
    block: {
      create: new BlockUserUseCaseImpl(UserRepository),
      list: new ListBlockedUserUseCaseImpl(UserRepository),
    },
    list: new ListAllUserCaseImpl(UserRepository),
    update: new UpdateUserUseCaseImpl(UserRepository),
  },
  report: {
    deposit: {
      paginated: new ReportDepositPaginatedUseCaseImpl(reportRepository),
      all: new ReportDepositAllUseCaseImpl(reportRepository),
      one: new ReportDepositOneUseCaseImpl(reportRepository),
      resendOrder: new DepositResendUseCaseImpl(reportRepository),
    },
  },
};
