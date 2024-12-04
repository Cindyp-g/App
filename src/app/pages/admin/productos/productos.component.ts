import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { ProductosService } from './service/productos.service';
import { Producto } from '../../../shared/models/producto.interface';
import Swal from 'sweetalert2';
import { ProductoDialogComponent } from './components/producto-dialog/producto-dialog.component';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent {
  private destroy$ = new Subject();
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['nombre', 'precio','cantidad', 'estatus' ,'acciones'];


  constructor(private dialog: MatDialog,
              private productoSvc: ProductosService,
              private snackbar: MatSnackBar) {}

  ngOnInit(): void {
    this.listar();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  listar() {
    this.productoSvc.listarProductos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((productos: Producto[]) => {
        this.dataSource.data = productos;
      });
  }

  cambiarEstatus(producto: any) {
    const { cveProducto, estatus } = producto;
    if (cveProducto !== undefined) {
      const nuevoEstatus = !estatus; 
  
      this.productoSvc.cambiarEstatus(cveProducto, nuevoEstatus)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.listar(); 
          this.snackbar.open("El estatus se cambio correctamente", '', {
            duration: 3000
          });
        });
    } else {
      console.error(" No se puede cambiar el estatus.");
    }
  }

  onOpenModal(user = {}) {
    const dialogRef = this.dialog.open(ProductoDialogComponent, {
      maxWidth: '100%',
      width: '80%',
      data: { user }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.listar();
          this.snackbar.open("Los datos se guardaron correctamente", '', {
            duration: 3000
          });
        }
      });
  }

  onDelete(cveProducto: number) {
    Swal.fire({
      title: 'Advertencia',
      text: '¿Realmente deseas eliminar el registro?',
      icon: 'question',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      showCancelButton: true,
      reverseButtons: true,
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoSvc.eliminarProductos(cveProducto)
          .pipe(takeUntil(this.destroy$))
          .subscribe((producto) => {
            this.listar();
            this.snackbar.open("Los datos se eliminaron correctamente", '', {
              duration: 3000
            });
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
  


}
