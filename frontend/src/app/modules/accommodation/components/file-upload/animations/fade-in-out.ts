import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const fadeInOutTrigger = trigger('fadeInOutTrigger', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms ease', style({ opacity: 1 })),
  ]),
  // transition(':leave', [animate('0ms', style({ opacity: 0 }))]),
]);
