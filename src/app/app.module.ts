import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { MaterialModule } from './material.module';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { UsuarioDialogComponent } from './pages/admin/usuarios/components/usuario-dialog/usuario-dialog.component';
import { tokenInterceptor } from './shared/interceptors/token.interceptor';
import { CategoriaDialogComponent } from './pages/admin/categorias/components/categoria-dialog/categoria-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    UsuarioDialogComponent,
    CategoriaDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    MatCardModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([tokenInterceptor]))
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
