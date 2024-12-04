import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VentasComponent } from './ventas.component';

const routes: Routes = [
  { 
    path: '', 
    component: VentasComponent 
  },
  { 
    path: 'reportes', 
    loadChildren: () => import('./reportes/reportes.module').then(m => m.ReportesModule) 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
