import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductosRoutingModule } from './productos-routing.module';
import { ProductosComponent } from './productos.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { ProductoDialogComponent } from './components/producto-dialog/producto-dialog.component';


@NgModule({
  declarations: [
    ProductosComponent,
    ProductoDialogComponent
  ],
  imports: [
    CommonModule,
    ProductosRoutingModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class ProductosModule { }
