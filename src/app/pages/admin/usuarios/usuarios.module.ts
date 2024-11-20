import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosComponent } from './usuarios.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';


@NgModule({
  declarations: [
    UsuariosComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class UsuariosModule { }
