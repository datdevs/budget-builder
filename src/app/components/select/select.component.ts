import { ChangeDetectionStrategy, Component, forwardRef, HostBinding, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { v7 as uuid } from 'uuid';
import { OptionItem } from '../../types';

@Component({
  selector: 'app-select',
  imports: [FormsModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent implements ControlValueAccessor {
  @HostBinding('id') inputId = uuid();

  label = input<string>();
  options = input.required<OptionItem[]>();
  layout = input<'horizontal' | 'vertical'>('vertical');

  value: string | number | null = null;

  setDisabledState(isDisabled: boolean): void {}

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  writeValue(obj: any): void {
    this.value = obj;
  }

  onChangeHandler(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const newValue = selectElement.value;
    this.value = newValue;

    this._onChange(newValue);
    this._onTouched();
  }

  private _onChange: (value: string | number) => void = () => {};

  private _onTouched: () => void = () => {};
}
