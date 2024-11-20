import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

const routes: Routes = [{ path: '', component: AdminComponent }, { path: 'usuarios', loadChildren: () => import('./usuarios/usuarios.module').then(m => m.UsuariosModule) }, { path: 'categorias', loadChildren: () => import('./categorias/categorias.module').then(m => m.CategoriasModule) }, { path: 'productos', loadChildren: () => import('./productos/productos.module').then(m => m.ProductosModule) }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
