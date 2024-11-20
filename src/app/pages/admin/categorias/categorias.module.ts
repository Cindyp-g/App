import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriasRoutingModule } from './categorias-routing.module';
import { CategoriasComponent } from './categorias.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';


@NgModule({
  declarations: [
    CategoriasComponent
  ],
  imports: [
    CommonModule,
    CategoriasRoutingModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class CategoriasModule { }
