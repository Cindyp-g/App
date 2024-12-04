import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Producto } from '../../../../shared/models/producto.interface';
import { environment } from '../../../../../environments/environment.development';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Venta } from '../../../../shared/models/venta.interface';

@Injectable({
  providedIn: 'root'
})
export class VentasService {


  constructor(private snackBar: MatSnackBar, private http: HttpClient) {}

  autocompleteProductos(cadena: string) {
    return this.http.get<Producto[]>(`${environment.API_URL}/producto`, { headers: { "requireToken": "true" } })
    .pipe(catchError((error) => this.handlerError(error)));

  }

  generarVenta(venta: any) {
    return this.http.post<Venta>(`${environment.API_URL}/venta`, venta, { headers: { "requireToken": "true" } })
      .pipe(catchError((error) => this.handlerError(error)));

  }

  eliminarProductos(cveProducto: number) {
    return this.http.delete<Producto>(`${environment.API_URL}/producto/${cveProducto}`, { headers: { "requireToken": "true" } })
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
