import { FindAllParams, SortOrder } from 'src/interfaces/find-all.interface';
import { FindOptionsWhere, Repository } from 'typeorm';

export function createOrderQuery(filter: FindAllParams) {
  const order: any = {};

  if (filter.orderBy) {
    order[filter.orderBy] = filter.sortOrder;
    return order;
  }

  order.createdAt = SortOrder.DESC;
  return order;
}

export function paginate<T>(
  repository: Repository<T>,
  filter: FindAllParams,
  where: FindOptionsWhere<T>[] | FindOptionsWhere<T>,
  relations?: string[],
) {
  return repository.findAndCount({
    order: createOrderQuery(filter),
    skip: (filter.page - 1) * filter.limit || 0,
    take: filter.limit || 10,
    where: where,
    relations: relations,
  });
}
