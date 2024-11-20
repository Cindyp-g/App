import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { BaseForm } from '../../../../../shared/utilis/base-form';
import { CategoriasService } from '../../service/categorias.service';
import { Categoria } from '../../../../../shared/models/categoria.interface';

enum Action {
  EDIT = 'edit',
  NEW = 'new'
}

@Component({
  selector: 'app-categoria-dialog',
  templateUrl: './categoria-dialog.component.html',
  styleUrls: ['./categoria-dialog.component.scss']
})
export class CategoriaDialogComponent {
  private destroy$ = new Subject();
  titleButton = "Guardar";
  actionTODO = Action.NEW;
  categoria: Categoria[] = [];
  categoriaForm = this.fb.group({
    cveCategoria: [''], 
    descripcion: ['', [Validators.required, Validators.minLength(3)]],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CategoriaDialogComponent>,
    private fb: FormBuilder,
    public baseForm: BaseForm,
    private categoriasSvc: CategoriasService
  ) { }

  ngOnInit(): void {
    // Listar categorías al inicio
    this.categoriasSvc.listarCategorias().pipe(takeUntil(this.destroy$)).subscribe((categorias: Categoria[]) => {
      this.categoria = categorias; 
      this.pathData(); 
    });
  }

 
  pathData() {
    if (this.data.user?.cveCategoria) { 
      this.categoriaForm.patchValue({
        cveCategoria: this.data.user.cveCategoria,
        descripcion: this.data.user.descripcion
      });

      this.titleButton = 'Actualizar';
      this.actionTODO = Action.EDIT;
    } else {
      this.titleButton = 'Guardar';
      this.actionTODO = Action.NEW;
    }
  }


  onSave() {
    if (this.categoriaForm.invalid) return;

    const formValue = this.categoriaForm.getRawValue();
    const categoria: Categoria = {
      descripcion: formValue.descripcion!
    };

    if (this.actionTODO === Action.NEW) {
      categoria.activo = true;

      this.categoriasSvc.insertarCategorias(categoria)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: Categoria) => {
          this.dialogRef.close(data);
        });
      }else{
  
        var cveCategoria: number = parseInt(formValue.cveCategoria!);
  
        this.categoriasSvc.actualizarCategorias(cveCategoria, categoria)
          .pipe(takeUntil(this.destroy$))
          .subscribe((user)=>{
            this.dialogRef.close(user);
          });
      }
    }


  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
}
