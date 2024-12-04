import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { Producto } from '../../../../shared/models/producto.interface';
import { Categoria } from '../../../../shared/models/categoria.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(private snackBar: MatSnackBar, private http: HttpClient) {}

  // Listar productos
  listarProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${environment.API_URL}/producto`, { headers: { "requireToken": "true" } })
      .pipe(catchError((error) => this.handlerError(error)));
  }

  // Cambiar estatus de un producto
  cambiarEstatus(cveProducto: number, estatus: boolean): Observable<any> {
    return this.http.patch<any>(`${environment.API_URL}/producto/${cveProducto}/${ estatus }`, { headers: { "requireToken": "true" } })
      .pipe(catchError((error) => this.handlerError(error)));
  }

  // Insertar producto
  insertarProductos(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(`${environment.API_URL}/producto`, producto, { headers: { "requireToken": "true" } })
      .pipe(catchError((error) => this.handlerError(error)));
  }

  // Actualizar producto
  actualizarProductos(cveProducto: number, producto: Producto): Observable<Producto> {
    return this.http.patch<Producto>(`${environment.API_URL}/producto/${cveProducto}`, producto, { headers: { "requireToken": "true" } })
      .pipe(catchError((error) => this.handlerError(error)));
  }

  // Eliminar producto
  eliminarProductos(cveProducto: number){
    return this.http.delete<Producto>(`${environment.API_URL}/producto/${cveProducto}`, { headers: { "requireToken": "true" } })
      .pipe(catchError((error) => this.handlerError(error)));
  }

  // Listar categorías
  listarCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${environment.API_URL}/categoria`, { headers: { "requireToken": "true" } })
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
