import { Component } from '@angular/core';
import { Feature } from '../../model/feature.model';

@Component({
  selector: 'app-about',
  standalone: false,
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
features: Feature[] = [
  {
    icon: 'campaign',
    title: 'Yap Freely',
    description: 'Share your hot takes, opinions, and random thoughts.'
  },
  {
    icon: 'question_answer',
    title: 'Ask Anything',
    description: 'No question is too small or too big — just start yapping.'
  },
  {
    icon: 'groups',
    title: 'Find Your People',
    description: 'Connect with others who love to yap about the same topics.'
  }
];

}
