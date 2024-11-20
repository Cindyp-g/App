import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UsuariosService } from './services/usuarios.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioDialogComponent } from '../../admin/usuarios/components/usuario-dialog/usuario-dialog.component';
import { Usuario } from '../../../shared/models/usuario.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios', 
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit, OnDestroy, AfterViewInit {

  private destroy$ = new Subject();
  dataSources = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayColums: String[] = ['nombre', 'apellidos', 'username', 'rol', 'acciones'];
usuario: any;
  
  constructor(
              private usuariosSvc: UsuariosService,
              private dialog: MatDialog,
              private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.listar();
  }

  ngAfterViewInit(): void {
    this.dataSources.paginator = this.paginator;
  }

  listar() {
    this.usuariosSvc.listarUsuarios()
      .pipe(takeUntil(this.destroy$))
      .subscribe((usuarios: Usuario[]) => {
        console.log("lista", usuarios);
        this.dataSources.data = usuarios;
      })
  }
  onOpenModal(user = {}){
    const dialogRef = this.dialog.open(UsuarioDialogComponent,{
      maxWidth: '100%',
      width:'80%',
      data:{
        user
      }
    });

    dialogRef.afterClosed()
    .pipe(takeUntil(this.destroy$))
    .subscribe(resut=> {
      if (resut){
        this.listar();

        this.snackbar.open("Los datos se gauadaron correctamente",'',{
          duration: 3000
        });
      }
    })
  }
  onDelete(cveUsuario: number){
    Swal.fire({
      title:'Advertencia',
      text: '¿Realmente deseas eliminar el registro?',
      icon:'question',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      showCancelButton: true,
      reverseButtons: true,
      customClass:{
        confirmButton:'btn btn-success',
        cancelButton: 'btn btn-danger'
      }
    }).then((result)=> {
      if(result.isConfirmed){
        //TODO: Eliminar
        this.usuariosSvc.eliminarrUsuario(cveUsuario).pipe(takeUntil(this.destroy$)).subscribe((usuario)=>{
          this.listar();
          this.snackbar.open("Los datos se eliminaron correctamente",'',{
            duration:3000
          })
        })

      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();

  }
}
