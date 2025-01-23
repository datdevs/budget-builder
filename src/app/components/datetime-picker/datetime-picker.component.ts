import { ChangeDetectionStrategy, Component, forwardRef, HostBinding, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { v7 as uuid } from 'uuid';

@Component({
  selector: 'app-datetime-picker',
  imports: [FormsModule],
  templateUrl: './datetime-picker.component.html',
  styleUrl: './datetime-picker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatetimePickerComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatetimePickerComponent implements ControlValueAccessor {
  @HostBinding('id') inputId = uuid();

  label = input<string>();
  layout = input<'horizontal' | 'vertical'>('vertical');
  type = input<'date' | 'time' | 'datetime-local' | 'month'>('date');

  value: string | null = null;

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
    const selectElement = event.target as HTMLInputElement;
    const newValue = selectElement.value;
    this.value = newValue;

    this._onChange(newValue);
    this._onTouched();
  }

  private _onChange: (value: string) => void = () => {};

  private _onTouched: () => void = () => {};
}
