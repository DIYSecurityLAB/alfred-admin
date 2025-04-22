import { RemoteDataSource } from '@/data/datasource/Remote.datasource';
import { ConfigRepositoryImpl } from '@/data/repositories/config.repository';
import { UserRepositoryImpl } from '@/data/repositories/user.repository';
import { ListConfigUseCaseImpl } from './config/list.usecase';
import { UpdateConfigUseCaseImpl } from './config/update.usecase';
import { BlockUserUseCaseImpl } from './user/blocked/block.usecase';
import { ListBlockedUserUseCaseImpl } from './user/blocked/list-all.usecase';

const API = new RemoteDataSource(String(import.meta.env.VITE_API_URL));

const ConfigRepository = new ConfigRepositoryImpl(API);
const UserRepository = new UserRepositoryImpl(API);

export const UseCases = {
  config: {
    list: new ListConfigUseCaseImpl(ConfigRepository),
    update: new UpdateConfigUseCaseImpl(ConfigRepository),
  },
  user: {
    block: new BlockUserUseCaseImpl(UserRepository),
    list: new ListBlockedUserUseCaseImpl(UserRepository),
  },
};
