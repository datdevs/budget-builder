import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  HostListener,
  inject,
  signal,
  Signal,
  viewChild,
} from '@angular/core';
import { BudgetModel } from '../../../../types';
import {
  BalanceCalculatorPipe,
  ProfitCalculatePipe,
  SubTotalCalculatePipe,
  TotalCalculatePipe,
} from '../../../../utils/pipes';
import { CARD, TABLE_CELL } from '../../../../utils/tailwindcss';
import { BudgetDataService, BudgetFilterService, NavigationService } from '../../services';

@Component({
  selector: 'app-budget-table',
  templateUrl: './budget-table.component.html',
  styleUrl: './budget-table.component.scss',
  imports: [NgTemplateOutlet, SubTotalCalculatePipe, TotalCalculatePipe, ProfitCalculatePipe, BalanceCalculatorPipe],
  providers: [NavigationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetTableComponent implements AfterViewInit {
  cssCard = CARD;
  cssTableCell = TABLE_CELL;

  readonly monthCollection: Signal<{ localeString: string; isoString: string }[]>;
  readonly budgetData: Signal<BudgetModel>;

  inputBoxElement = viewChild<ElementRef<HTMLDivElement>>('inputBox');
  inputBoxStyle = signal({
    top: '0px',
    left: '0px',
    width: '0px',
    height: '0px',
  });

  contextMenuElement = viewChild<ElementRef<HTMLDivElement>>('contextMenu');
  contextMenuStyle = signal({
    top: '0px',
    left: '0px',
  });

  private readonly budgetFilterService = inject(BudgetFilterService);
  private readonly budgetDataService = inject(BudgetDataService);
  private readonly navigationService = inject(NavigationService);

  constructor() {
    this.monthCollection = this.budgetFilterService.monthCollection;
    this.budgetData = this.budgetDataService.getBudget;

    effect(() => {
      if (this.monthCollection()) {
        this.budgetDataService.updateBudgetMonths(this.monthCollection().map((month) => month.isoString));
      }
    });
  }

  ngAfterViewInit(): void {
    this.navigationService.updateMaxRowsAndCols(this.monthCollection().length + 1);

    this.navigationService.updateInputBoxToSpecificElement(
      document.querySelector('[data-createcategory="income"]') as HTMLTableCellElement,
      this.inputBoxStyle,
    );
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    const rows = this.navigationService.getRows();

    switch (event.key) {
      case 'Tab':
        event.preventDefault();
        this.navigationService.handleTab(event.shiftKey, rows);
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        event.preventDefault();
        this.navigationService.handleVerticalNavigation(event.key, rows);
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
        event.preventDefault();
        this.navigationService.handleHorizontalNavigation(event.key);
        break;
      case 'Enter': {
        event.preventDefault();

        const target = this.navigationService.getCurrentCell();

        if (this._handleCategoryCreation(target as HTMLElement)) return;

        this._enterEditMode();
        break;
      }
    }

    this.navigationService.updateInputBoxPosition(rows, this.inputBoxStyle);
  }

  @HostListener('document:click', ['$event'])
  handleCellClickEvent(event: MouseEvent): void {
    this._resetContextMenu();

    const target = event.target as HTMLElement;

    if (this._handleCategoryCreation(target)) return;

    if (target.tagName === 'TD') {
      this.navigationService.handleCellClick(target as HTMLTableCellElement, this.inputBoxStyle);
    }
  }

  @HostListener('document:dblclick', ['$event'])
  handleCellDoubleClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (target === this.inputBoxElement()?.nativeElement) {
      this._enterEditMode();
    }
  }

  /**
   * Save the cell value
   * @param event
   * @param applyToAll
   */
  onContextMenu(event: MouseEvent, applyToAll?: boolean): void {
    event.preventDefault();

    let target = event.target as HTMLTableCellElement;
    const contextMenu = this.contextMenuElement()?.nativeElement;

    if (target === this.inputBoxElement()?.nativeElement) {
      target = this.navigationService.getCurrentCell() as HTMLTableCellElement;
      applyToAll = true;
    }

    const { clientX, clientY } = event;

    contextMenu?.classList.remove('hidden');
    contextMenu?.setAttribute('data-category', target.dataset['category'] as string);
    contextMenu?.setAttribute('data-categoryid', target.dataset['categoryid'] as string);

    if (target.dataset['subcategoryid']) {
      contextMenu?.setAttribute('data-subcategoryid', target.dataset['subcategoryid'] as string);
    }

    if (applyToAll) {
      contextMenu?.querySelector('#apply-to-all')?.classList.remove('hidden');
      contextMenu?.setAttribute('data-month', target.dataset['month'] as string);
    } else {
      contextMenu?.querySelector('#apply-to-all')?.classList.add('hidden');
    }

    this.contextMenuStyle.update((style) => ({
      ...style,
      top: `${clientY}px`,
      left: `${clientX}px`,
    }));
  }

  /**
   * Delete the row
   */
  onDeleteRow(): void {
    const element = this.contextMenuElement()?.nativeElement;
    if (!element) return;

    const category = element.dataset['category'];
    const categoryId = element.dataset['categoryid'];
    const subCategoryId = element.dataset['subcategoryid'];

    if (!categoryId || !category) return;

    if (subCategoryId) {
      this.budgetDataService.deleteSubCategory(category as 'income' | 'expenses', categoryId, subCategoryId);
    } else {
      this.budgetDataService.deleteCategory(category as 'income' | 'expenses', categoryId);
    }
  }

  /**
   * Apply the value to all after months
   */
  applyToAll(): void {
    const element = this.contextMenuElement()?.nativeElement;
    if (!element) return;

    const category = element.dataset['category'];
    const categoryId = element.dataset['categoryid'];
    const subCategoryId = element.dataset['subcategoryid'];
    const currentMonth = element.dataset['month'];

    if (!categoryId || !category || !currentMonth) return;

    this.budgetDataService.copyValueToAllAfterMonths(
      category as 'income' | 'expenses',
      categoryId,
      subCategoryId || null,
      currentMonth,
    );
  }

  /**
   * Enter edit mode for the cell
   * @private
   */
  private _enterEditMode(): void {
    const targetCell = this.navigationService.getCurrentCell();

    if (!targetCell || targetCell.dataset['editable'] === 'false') return;

    const isEditing = targetCell.getAttribute('contenteditable') === 'true';

    if (isEditing) {
      this._saveCellValue(targetCell);
      targetCell.setAttribute('contenteditable', 'false');
    } else {
      targetCell.setAttribute('contenteditable', 'true');
      targetCell.focus();
      this._moveCursorToEnd(targetCell);

      targetCell.addEventListener(
        'blur',
        () => {
          this._saveCellValue(targetCell);
          targetCell.setAttribute('contenteditable', 'false');
        },
        { once: true },
      );
    }
  }

  /**
   * Save the cell value
   * @param targetCell
   * @private
   */
  private _saveCellValue(targetCell: HTMLElement): void {
    const payload = {
      type: targetCell.dataset['type'] as string,
      category: targetCell.dataset['category'] as string,
      categoryId: targetCell.dataset['categoryid'] as string,
      subCategoryId: targetCell.dataset['subcategoryid'] as string,
      month: targetCell.dataset['month'] as string,
      value: targetCell.innerText,
    };

    this._saveEditedValue(payload.type as any, payload.category as any, payload);
  }

  /**
   * Add new income category
   * @private
   */
  private _addNewIncomeCategory(): void {
    this.budgetDataService.addCategory(
      'income',
      this.monthCollection().map((month) => month.isoString),
    );
  }

  /**
   * Add new income sub category
   * @param categoryId
   * @private
   */
  private _addNewIncomeSubCategory(categoryId: string): void {
    this.budgetDataService.addSubCategory(
      'income',
      categoryId,
      this.monthCollection().map((month) => month.isoString),
    );
  }

  /**
   * Add new expenses category
   * @private
   */
  private _addNewExpensesCategory(): void {
    this.budgetDataService.addCategory(
      'expenses',
      this.monthCollection().map((month) => month.isoString),
    );
  }

  /**
   * Add new expenses sub category
   * @param categoryId
   * @private
   */
  private _addNewExpensesSubCategory(categoryId: string): void {
    this.budgetDataService.addSubCategory(
      'expenses',
      categoryId,
      this.monthCollection().map((month) => month.isoString),
    );
  }

  /**
   * Focus the first cell of the new row
   * @param type
   * @param categoryId
   * @private
   */
  private _focusFirstCellOfNewRow(type: 'income' | 'expenses', categoryId?: string): void {
    let cellId = '';

    if (categoryId) {
      const subCategory = this.budgetData()[type].find((category) => category.id === categoryId)?.children;

      if (subCategory) {
        cellId = subCategory[subCategory.length - 1].id;
      }
    } else {
      cellId = this.budgetData()[type][this.budgetData()[type].length - 1].id;
    }

    setTimeout(() => {
      const cell = document.getElementById(cellId);

      this.navigationService.updateInputBoxToSpecificElement(cell as HTMLTableCellElement, this.inputBoxStyle);
      this._enterEditMode();
    });
  }

  /**
   *
   * @param type 'category' | 'subCategory' | 'categoryValue' | 'subCategoryValue'
   * @param category 'income' | 'expenses'
   * @param expectValue
   * @private
   */
  private _saveEditedValue(
    type: 'category' | 'subCategory' | 'categoryValue' | 'subCategoryValue',
    category: 'income' | 'expenses',
    expectValue: { categoryId: string; value: string | number; subCategoryId?: string; month?: string },
  ): void {
    const { categoryId, subCategoryId, month, value } = expectValue;

    switch (type) {
      case 'category':
        this.budgetDataService.updateCategory(category, categoryId, value as string);
        break;

      case 'categoryValue':
        if (month !== undefined) {
          this.budgetDataService.updateCategoryValue(category, categoryId, month, Number(value));
        }
        break;

      case 'subCategory':
        if (subCategoryId !== undefined) {
          this.budgetDataService.updateSubCategory(category, categoryId, subCategoryId, value as string);
        }
        break;

      case 'subCategoryValue':
        if (subCategoryId !== undefined && month !== undefined) {
          this.budgetDataService.updateSubCategoryValue(category, categoryId, subCategoryId, month, Number(value));
        }
        break;

      default:
        console.error(`Invalid type: ${type}`);
        break;
    }
  }

  /**
   * Move the cursor to the end of text content
   * @param element
   * @private
   */
  private _moveCursorToEnd(element: HTMLElement): void {
    const range = document.createRange();
    const selection = window.getSelection();

    // Fix duplicate text after input number
    if (element.innerText?.trim() === '') {
      element.innerText = '';
    }

    range.selectNodeContents(element);
    range.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  /**
   * Reset the context menu
   * @private
   */
  private _resetContextMenu(): void {
    const contextMenu = this.contextMenuElement()?.nativeElement;

    if (!contextMenu) return;

    contextMenu.classList.add('hidden');
    contextMenu.removeAttribute('data-category');
    contextMenu.removeAttribute('data-categoryid');
    contextMenu.removeAttribute('data-subcategoryid');
  }

  /**
   * Handle category creation
   * @param target
   * @private
   */
  private _handleCategoryCreation(target: HTMLElement): boolean {
    const createCategory = target.dataset['createcategory'];
    const categoryId = target.dataset['categoryid'];

    if (!createCategory) return false;

    if (createCategory === 'income') {
      categoryId ? this._addNewIncomeSubCategory(categoryId) : this._addNewIncomeCategory();
      this._focusFirstCellOfNewRow('income', categoryId);
    } else if (createCategory === 'expenses') {
      categoryId ? this._addNewExpensesSubCategory(categoryId) : this._addNewExpensesCategory();
      this._focusFirstCellOfNewRow('expenses', categoryId);
    }

    return true;
  }
}
