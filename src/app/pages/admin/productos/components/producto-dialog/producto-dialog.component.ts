import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { BaseForm } from '../../../../../shared/utilis/base-form';
import { ProductosService } from '../../service/productos.service';
import { Producto } from '../../../../../shared/models/producto.interface';
import { Categoria } from '../../../../../shared/models/categoria.interface';

enum Action {
  EDIT = 'edit',
  NEW = 'new'
}

@Component({
  selector: 'app-producto-dialog',
  templateUrl: './producto-dialog.component.html',
  styleUrls: ['./producto-dialog.component.scss'],
})
export class ProductoDialogComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject();
  titleButton = "Guardar";
  actionTODO = Action.NEW;
  producto: Producto[] = [];
  categoria: Categoria[] = [];
  
  productoForm= this.fb.group({
    cveProducto: [''], 
    descripcion: ['', [Validators.required, Validators.minLength(3)]],
    cantidad: ['', [Validators.required, Validators.min(1)]],
    precio: ['', [Validators.required, Validators.min(0)]],
    cveCategoria:['',[Validators.required]],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProductoDialogComponent>,
    private fb: FormBuilder,
    public baseForm: BaseForm,
    private productosSvc: ProductosService
  ) { }

  ngOnInit(): void {
    // Listar productos al inicio
    this.productosSvc.listarProductos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((producto: Producto[]) => {
        this.producto = producto;
        this.pathData();
      });
      this.productosSvc.listarCategorias()
      .pipe(takeUntil(this.destroy$))
      .subscribe((categoria: Categoria[]) => {
        this.categoria = categoria;
        this.pathData();
      });
  }

  pathData() {
    if (this.data.user?.cveProducto) { 
      this.productoForm.patchValue({
        cveProducto: this.data.user.cveProducto,
        descripcion: this.data.user.nombre,
        cantidad: this.data.user.cantidad,
        precio: this.data.user.precio,
        cveCategoria: this.data.user.cveCategoria,
      });

      this.titleButton = 'Actualizar';
      this.actionTODO = Action.EDIT;
    } else {
      this.titleButton = 'Guardar';
      this.actionTODO = Action.NEW;
    }
  }

  onSave() {
    if (this.productoForm.invalid) return;

    const formValue = this.productoForm.getRawValue();
    const producto: Producto = {
      descripcion: formValue.descripcion!,
      cveProducto: parseInt(formValue.cveProducto!),
      precio: parseFloat(formValue.precio!),
      cantidad: parseInt(formValue.cantidad!),
      cveCategoria: parseInt(formValue.cveCategoria!),
    };

    if (this.actionTODO === Action.NEW) {
      this.productosSvc.insertarProductos(producto)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: Producto) => {
          this.dialogRef.close(data);
        });
    } else {
      const updateUser: Producto = {
        descripcion: formValue.descripcion!,
        precio: parseFloat(formValue.precio!),
        cantidad: parseInt(formValue.cantidad!),
        cveCategoria: parseInt(formValue.cveCategoria!),
      };

      const cveProducto: number = parseInt(formValue.cveProducto!);

      this.productosSvc.actualizarProductos(cveProducto, updateUser)
        .pipe(takeUntil(this.destroy$))
        .subscribe((user) => {
          this.dialogRef.close(user);
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
}
