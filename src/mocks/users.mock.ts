// Importação explícita do tipo User
import type { User } from "../data/types";

export const mockUsers: User[] = [
  {
    id: "1",
    username: "john_doe",
    email: "john@example.com",
    name: "John Doe",
    isActive: true,
    level: 3,
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-11-20T15:45:00Z"
  },
  {
    id: "2",
    username: "maria_silva",
    email: "maria@example.com",
    name: "Maria Silva",
    isActive: true,
    level: 2,
    createdAt: "2023-03-22T08:15:00Z",
    updatedAt: "2023-10-05T11:20:00Z"
  },
  {
    id: "3",
    username: "carlos_santos",
    email: "carlos@example.com",
    name: "Carlos Santos",
    isActive: false,
    level: 1,
    createdAt: "2023-05-10T14:20:00Z",
    updatedAt: "2023-09-18T09:30:00Z"
  },
  {
    id: "4",
    username: "admin",
    email: "admin@example.com",
    name: "Administrador",
    isActive: true,
    level: 5,
    createdAt: "2022-12-01T09:00:00Z",
    updatedAt: "2023-11-25T16:10:00Z"
  },
  {
    id: "5",
    username: "ana_pereira",
    email: "ana@example.com",
    name: "Ana Pereira",
    isActive: true,
    level: 2,
    createdAt: "2023-07-05T11:45:00Z",
    updatedAt: "2023-10-28T13:25:00Z"
  }
];
