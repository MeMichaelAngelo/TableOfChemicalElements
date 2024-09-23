import { Component, Inject, ViewEncapsulation } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { PeriodicElement } from '../interfaces/periodicElement.interface';

@Component({
  selector: 'edit-page',
  templateUrl: 'edit-page.component.html',
  styleUrl: 'edit-page.component.scss',
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class EditPageComponent {
  form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditPageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PeriodicElement,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.editForm();
  }

  editForm(): void {
    this.form = this.fb.group({
      position: [this.data?.position, [Validators.required]],
      name: [this.data?.name, [Validators.required]],
      weight: [this.data?.weight, [Validators.required]],
      symbol: [this.data?.symbol, [Validators.required]],
    });
  }

  update(): void {
    const updatedData = {
      ...this.data,
      position: Number(this.form.value.position),
      name: this.form.value.name,
      weight: Number(this.form.value.weight),
      symbol: this.form.value.symbol,
    };

    this.dialogRef.close(updatedData);
  }
}
