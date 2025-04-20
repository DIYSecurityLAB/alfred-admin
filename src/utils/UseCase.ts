import { Result } from "./Result";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface UseCase<Req, Res extends Promise<Result<any, any>>> {
  execute(req: Req): Res;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
