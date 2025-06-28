import { Month } from "../entities";

export default interface IMonthsRepository {
  findAll(): Promise<Month[] | null>;
}   