import { Injectable, WritableSignal } from '@angular/core';

@Injectable()
export class NavigationService {
  currentRow = 0;
  currentCol = 0;
  maxRows = 0;
  maxCols = 0;

  /**
   * Update the max rows and columns
   * @param col
   */
  updateMaxRowsAndCols(col: number): void {
    this.maxRows = this.getRowCount();
    this.maxCols = col;
  }

  /**
   * Handle keyboard navigation
   * @param isShift
   * @param rows
   */
  handleTab(isShift: boolean, rows: NodeListOf<HTMLTableRowElement>): void {
    const direction = isShift ? -1 : 1;

    while (true) {
      this.currentCol += direction;

      if (this.currentCol < 0) {
        if (this.currentRow > 0) {
          this.currentRow--;
          this.currentCol = rows[this.currentRow].querySelectorAll('td').length - 1;
        } else {
          this.currentCol = 0;
          break;
        }
      } else if (this.currentCol >= this.maxCols) {
        if (this.currentRow < this.maxRows - 1) {
          this.currentRow++;
          this.currentCol = 0;
        } else {
          this.currentCol = this.maxCols - 1;
          break;
        }
      }

      const cells = rows[this.currentRow]?.querySelectorAll('td');
      if (cells && cells.length > 1) break;
    }
  }

  /**
   * Handle vertical navigation
   * @param key
   * @param rows
   */
  handleVerticalNavigation(key: string, rows: NodeListOf<HTMLTableRowElement>): void {
    while (true) {
      this.currentRow =
        key === 'ArrowUp' ? Math.max(this.currentRow - 1, 0) : Math.min(this.currentRow + 1, this.maxRows - 1);

      const cells = rows[this.currentRow]?.querySelectorAll('td');
      if (cells && (cells.length > 1 || this.currentRow === 0 || this.currentRow === this.maxRows - 1)) break;
    }
  }

  /**
   * Handle horizontal navigation
   * @param key
   */
  handleHorizontalNavigation(key: string): void {
    this.currentCol =
      key === 'ArrowLeft' ? Math.max(this.currentCol - 1, 0) : Math.min(this.currentCol + 1, this.maxCols - 1);
  }

  /**
   * Update the position of the input box
   * @param target
   * @param inputBoxStyle
   */
  handleCellClick(target: HTMLTableCellElement, inputBoxStyle: WritableSignal<any>): void {
    const rows = this.getRows();

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const cells = rows[rowIndex].querySelectorAll('td');

      if (cells.length < 2) continue;

      for (let colIndex = 0; colIndex < cells.length; colIndex++) {
        if (cells[colIndex] === target) {
          this.currentRow = rowIndex;
          this.currentCol = colIndex;

          this.updateInputBoxPosition(rows, inputBoxStyle);
          return;
        }
      }
    }
  }

  /**
   * Update the position of the input box
   */
  getRowCount(): number {
    return document.querySelectorAll('tbody tr').length;
  }

  /**
   * Update the position of the input box
   */
  getRows(): NodeListOf<HTMLTableRowElement> {
    return document.querySelectorAll('tbody tr');
  }

  /**
   *
   * @param rows
   */
  getCurrentCell(rows?: NodeListOf<HTMLTableRowElement>): HTMLElement | null {
    rows = rows || this.getRows();
    const cells = rows[this.currentRow]?.querySelectorAll('td');
    return cells?.[this.currentCol] || null;
  }

  /**
   * Update the position of the input box
   * @param element
   * @param inputBoxStyle
   */
  updateInputBoxToSpecificElement(element: HTMLTableCellElement | undefined, inputBoxStyle: WritableSignal<any>): void {
    if (!element) return;

    const rows = this.getRows();
    const { rowIndex, colIndex } = this._findCellPosition(rows, element);

    if (rowIndex === -1 || colIndex === -1) return;

    this.currentRow = rowIndex;
    this.currentCol = colIndex;

    const { offsetTop, offsetLeft, offsetHeight, offsetWidth } = element;

    inputBoxStyle.update((style) => ({
      ...style,
      top: `${offsetTop}px`,
      left: `${offsetLeft}px`,
      width: `${offsetWidth}px`,
      height: `${offsetHeight}px`,
    }));
  }

  /**
   * Update the position of the input box
   * @param rows
   * @param inputBoxStyle
   */
  updateInputBoxPosition(rows: NodeListOf<HTMLTableRowElement>, inputBoxStyle: WritableSignal<any>): void {
    const targetCell = this.getCurrentCell(rows);

    if (!targetCell) return;

    const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = targetCell;

    inputBoxStyle.update((style) => ({
      ...style,
      top: `${offsetTop}px`,
      left: `${offsetLeft}px`,
      width: `${offsetWidth}px`,
      height: `${offsetHeight}px`,
    }));
  }

  /**
   * Find the position of the cell
   * @param rows
   * @param element
   * @private
   */
  private _findCellPosition(
    rows: NodeListOf<HTMLTableRowElement>,
    element: HTMLTableCellElement,
  ): { rowIndex: number; colIndex: number } {
    for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
      const cells = rows[rowIdx].querySelectorAll<HTMLTableCellElement>('td');
      for (let colIdx = 0; colIdx < cells.length; colIdx++) {
        if (cells[colIdx] === element) {
          return { rowIndex: rowIdx, colIndex: colIdx };
        }
      }
    }
    return { rowIndex: -1, colIndex: -1 };
  }
}
