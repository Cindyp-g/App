import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { CategoriasService } from './service/categorias.service';
import Swal from 'sweetalert2';
import { CategoriaDialogComponent } from './components/categoria-dialog/categoria-dialog.component';
import { Categoria } from '../../../shared/models/categoria.interface';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent implements OnInit, AfterViewInit, OnDestroy {

  private destroy$ = new Subject();
  dataSource = new MatTableDataSource<Categoria>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['nombre', 'estatus', 'acciones'];

  constructor(private dialog: MatDialog,
              private categoriaSvc: CategoriasService,
              private snackbar: MatSnackBar) {}

  ngOnInit(): void {
    this.listar();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  listar() {
    this.categoriaSvc.listarCategorias()
      .pipe(takeUntil(this.destroy$))
      .subscribe((categorias: Categoria[]) => {
        this.dataSource.data = categorias;
      });
  }

  cambiarEstatus(categoria: any) {
    const { cveCategoria, activo } = categoria;
    if (cveCategoria !== undefined) {
      const nuevoEstatus = !activo; 
  
      this.categoriaSvc.cambiarEstatus(cveCategoria, nuevoEstatus)
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
    const dialogRef = this.dialog.open(CategoriaDialogComponent, {
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

  onDelete(cveCategoria: number) {
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
        console.log(cveCategoria)
        this.categoriaSvc.eliminarCategorias(cveCategoria)
          .pipe(takeUntil(this.destroy$))
          .subscribe((categoria) => {
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
