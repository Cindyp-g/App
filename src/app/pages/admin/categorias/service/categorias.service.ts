import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { Categoria } from '../../../../shared/models/categoria.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  constructor(private snackBar: MatSnackBar, private http: HttpClient) {}

  listarCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/categoria`, { headers: { "requireToken": "true" } })
      .pipe(catchError((error) => this.handlerError(error)));
  }

  cambiarEstatus(cveCategoria: number, estatus: boolean): Observable<any> {
    return this.http.patch<any>(`${environment.API_URL}/categoria/${cveCategoria}/${ estatus }`, { headers: { "requireToken": "true" } })
      .pipe(catchError((error) => this.handlerError(error)));
  }

  insertarCategorias(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(`${environment.API_URL}/categoria`, categoria, { headers: { "requireToken": "true" } })
      .pipe(catchError((error) => this.handlerError(error)));
  }

  actualizarCategorias(cveCategoria: number, categoria: Categoria): Observable<Categoria> {
    return this.http.patch<Categoria>(`${environment.API_URL}/categoria/${cveCategoria}`, categoria, { headers: { "requireToken": "true" } })
      .pipe(catchError((error) => this.handlerError(error)));
  }

  eliminarCategorias(cveCategoria: number){
    return this.http.delete<Categoria>(`${environment.API_URL}/categoria/${cveCategoria}`, { headers: { "requireToken": "true" } })
      .pipe(catchError((error) => this.handlerError(error)));
  }

  private handlerError(error: any) {
    let message = "Ocurrió un error";
    if (error.error?.message) message = error.error.message;

    this.snackBar.open(message, '', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'end'
    });

    return throwError(() => new Error(message));
  }
}