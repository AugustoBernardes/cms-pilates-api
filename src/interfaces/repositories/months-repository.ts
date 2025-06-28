import { Month } from "../entities";

export default interface IMonthsRepository {
  getAll(): Promise<Month[] | null>;
}   