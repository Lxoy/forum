import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paginate',
  standalone: false
})
export class PaginatePipe implements PipeTransform {

  transform<T>(items: T[], page: number, pageSize: number): T[] {
    if (!items || !page || !pageSize) {
      return items;
    }

    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }

}
