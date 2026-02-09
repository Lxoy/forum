import { Component } from '@angular/core';
import { Rule } from '../../model/rule.model';

@Component({
  selector: 'app-rules',
  standalone: false,
  templateUrl: './rules.html',
  styleUrl: './rules.css',
})
export class Rules {
  rules: Rule[] = [
  {
    title: 'Be Cool',
    description: 'Respect others. Disagreements are fine — disrespect is not.'
  },
  {
    title: 'No Spammy Yap',
    description: 'Don’t flood threads with ads, repeated posts, or irrelevant content.'
  },
  {
    title: 'Keep It Relevant',
    description: 'Post in the right category and stay on topic.'
  },
  {
    title: 'No Toxic Energy',
    description: 'Hate speech, harassment, or attacking others won’t fly here.'
  },
  {
    title: 'Use Common Sense',
    description: 'If you wouldn’t say it in real life, don’t post it here.'
  }
];

}
