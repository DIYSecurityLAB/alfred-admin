import { RemoteDataSource } from "@/data/datasource/Remote.datasource";
import { ConfigRepositoryImpl } from "@/data/repositories/config.repository";
import { ListConfigUseCaseImpl } from "./config/list.usecase";
import { UpdateConfigUseCaseImpl } from "./config/update.usecase";

const API = new RemoteDataSource(String(import.meta.env.VITE_API_URL));

const ConfigRepository = new ConfigRepositoryImpl(API);

export const UseCases = {
  config: {
    list: new ListConfigUseCaseImpl(ConfigRepository),
    update: new UpdateConfigUseCaseImpl(ConfigRepository),
  },
};
