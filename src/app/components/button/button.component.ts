import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  theme = input<'primary' | 'secondary'>();
  size = input<'small' | 'large'>();
  width = input<'auto' | 'full'>();
  uiType = input<'filled' | 'outlined' | 'plain' | 'icon'>();
  actionType = input<'submit' | 'reset' | 'button'>('button');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  clickHandler = output<MouseEvent>();

  buttonClass = computed(() => {
    const classes = ['rounded-lg px-5 py-2 font-medium transition'];

    switch (this.theme()) {
      case 'primary':
        classes.push('bg-blue-500 text-white hover:bg-blue-400 active:bg-blue-800');
        break;
      case 'secondary':
        classes.push('bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300');
        break;
      default:
        classes.push('bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300');
        break;
    }

    return classes.join(' ');
  });
}
