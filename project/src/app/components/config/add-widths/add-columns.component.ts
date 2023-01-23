import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { STORAGE_KEYS } from 'src/app/app.constants';

@Component({
  selector: 'app-add-widths',
  templateUrl: './add-columns.component.html',
  styleUrls: ['./add-columns.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddWidthsComponent implements OnInit, OnDestroy {
  private _unsubscribe$ = new Subject<void>();

  public newColumn = new FormControl(null);

  private _arrayWithColumns: string[] = localStorage.getItem(STORAGE_KEYS.classes)
    ? JSON.parse(localStorage.getItem(STORAGE_KEYS.classes)!)
    : [];

  public hasSuffixButton = false;

  constructor() {
    this.newColumn.valueChanges
      .pipe(takeUntil(this._unsubscribe$), distinctUntilChanged(), debounceTime(1000))
      .subscribe(column => {
        if (!this.hasSuffixButton) {
          if (column) {
            this._arrayWithColumns.push(column);
            this.newColumn.setValue(null, { emitEvent: false });
          }
        }
      });
  }

  public ngOnInit(): void {}

  public onDelete(index: number): void {
    this._arrayWithColumns = this._arrayWithColumns.filter((_, i) => i !== index);
  }

  public clickOnaddColumn(column: string): void {
    if (this.hasSuffixButton) {
      this._arrayWithColumns.push(column);
      this.newColumn.setValue(null);
    }
  }

  public onRegisterColumns(): void {
    localStorage.setItem(STORAGE_KEYS.classes, JSON.stringify(this._arrayWithColumns));
  }

  get arrayWithColumns(): string[] {
    return this._arrayWithColumns;
  }

  public ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
