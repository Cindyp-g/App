import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { error } from 'console';
import { Usuario } from '../../../../shared/models/usuario.interface';
import { Rol } from '../../../../shared/models/rol.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private snackBar: MatSnackBar, private http: HttpClient) { }


  listarUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${environment.API_URL}/usuario`,{headers: {"requireToken" : "true"}})
      .pipe(catchError((error) => this.handlerError(error)));
  }

  listarRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${environment.API_URL}/general/roles`,{headers: {"requireToken" : "true"}})
      .pipe(catchError((error) => this.handlerError(error)));
  }

  insertarUsuario(usuario: Usuario) {
    return this.http.post<Usuario>(`${environment.API_URL}/usuario`, usuario,{headers: {"requireToken" : "true"}})
      .pipe(catchError((error) => this.handlerError(error)));
  }

  actualizarUsuario(cveUsuario:number, usuario: Usuario) {
    return this.http.patch<Usuario>(`${environment.API_URL}/usuario/${cveUsuario}`, usuario,{headers: {"requireToken" : "true"}})
      .pipe(catchError((error) => this.handlerError(error)));
  }

  eliminarrUsuario(cveUsuario: number) {
    return this.http.delete<Usuario>(`${environment.API_URL}/usuario/${cveUsuario}`,{headers: {"requireToken" : "true"}})
    .pipe(catchError((error) => this.handlerError(error)));
  }

  handlerError(error:any){
    var message = "Ocurrio un error";
    if(error.error){
      if(error.error.message) message = error.error.message;
    }

    this.snackBar.open(message,'',{
      duration:300,
      verticalPosition:'top',
      horizontalPosition:'end'
    });

    return throwError(()=> new Error(message));
  }
}
