import { Pipe, PipeTransform } from '@angular/core';
import { Thread } from '../home/home-component/home-component';

@Pipe({
  name: 'categoryFilter',
  standalone: false
})
export class CategoryFilterPipe implements PipeTransform {

  transform(threads: Thread[], category: string | null): Thread[] {
    if (!threads || !category) {
      return threads;
    }

    return threads.filter(t => t.category === category);
  }

}
