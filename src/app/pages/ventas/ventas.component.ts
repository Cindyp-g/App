import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, filter, Observable, startWith, Subject, switchMap, takeUntil } from 'rxjs';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseForm } from '../../shared/utilis/base-form';
import { VentasService } from '../ventas/ventas/service/ventas.service';
import { Producto } from '../../shared/models/producto.interface';
import { ProductosVenta } from '../../shared/models/productos.venta.interface';
import { Venta } from '../../shared/models/venta.interface';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();
  dataSource = new MatTableDataSource<any>();
  listadoProductos: ProductosVenta[] = [];
  displayedColumns: string[] = ['nombre', 'cantidad', 'precio', 'importe', 'acciones'];
  options: string[] = ['Pepsi', 'Jabón', 'Coca-Cola'];
  filteredOptions: string[] = [];
  productos$!: Observable<any>
  subtotal = 0;
  total = 0;

  ventaForm = this.fb.group({
    producto: [{}, [Validators.required]],
    cantidad: ['', [Validators.required, Validators.min(2)]],
  });
  producto: any;
  onOpenModal: any;
  listar: any;

  constructor(private ventasSVC: VentasService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public baseForm: BaseForm,
    private snackbar: MatSnackBar
  ) {

    this.filteredOptions = this.options.slice();
  }

  ngOnInit(): void {
    this.productos$ = this.ventaForm.get('producto')!.valueChanges.pipe(
      startWith(''),
      distinctUntilChanged(),
      debounceTime(400),
      filter((name) => ! !name),
      switchMap(name => this.ventasSVC.autocompleteProductos(name!))
    )
  }
  displayFn(producto: Producto) {
    return producto && producto.descripcion ? producto.descripcion : '';
  }

  agregarProducto() {
    var { producto, cantidad } = this.ventaForm.value;

    if (typeof producto != 'object') {
      this.snackBar.open("El producto seleccionado no existe", '', {
        duration: 3000
      });
      return;
    }

    var p: Producto = producto!;
    var c = parseInt(cantidad!);
    if (c > p.cantidad) {
      this.snackBar.open(`La cantidad debe ser igual o menos a ${p.cantidad}`, '', {
        duration: 3000
      });
    }

    var productoVenta: ProductosVenta = {
      producto: p,
      cantidad: c,
      precio: p.precio,
      importe: c * p.precio
    };
    // verifica si existe el producto en el listado
    var bandera = false;

    for (let pv of this.listadoProductos) {
      if (pv.producto.cveProducto === productoVenta.producto.cveProducto) {
        bandera = true;
        break;
      }

    }

    if (bandera) {
      this.ventaForm.get('producto')!.setValue(null);
      this.ventaForm.get('cantidad')!.setValue('');
      this.snackBar.open(`El producto ya existe en el listado`, '', {
        duration: 3000
      });
    }

    this.listadoProductos.push(productoVenta);
    this.dataSource.data = this.listadoProductos;

    this.ventaForm.get('producto')!.setValue(null);
    this.ventaForm.get('cantidad')!.setValue('');

    this.subtotal = 0;
    this.total = 0;
    for (let pv of this.listadoProductos) {
      this.subtotal += pv.importe;
      this.total += pv.importe;
    }
  }
  realizarVenta(){
    if (this.listadoProductos.length<=0){
      this.snackBar.open(`El pedido fue relizado con exito`, '', {
        duration: 3000
      });
      return;
    }
    var detalles=[];
    for (let pv of this.listadoProductos){
      detalles.push({
        cantidad: pv.cantidad,
        precioProducto: pv.precio,
        cveProducto: pv.producto.cveProducto!
      })
    }
    
    var venta: Venta ={
      totalventa: this.total,
      cveUsuario: 1,
      productoVenta: detalles,
    };

    this.ventasSVC.generarVenta(venta).pipe(takeUntil(this.destroy$)).subscribe ( (data) =>
    {
      this.snackBar.open(`Venta realizada correctamente`)
      duration: 3000
    });
    //limpiar los objetos 
    this.limpiarFormulario();
  }

  limpiarFormulario(){
    this.listadoProductos = [];
    this.dataSource.data = this.listadoProductos
    this.subtotal = 0;
    this.total = 0;
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
        this.ventasSVC.eliminarProductos(cveProducto)
          .pipe(takeUntil(this.destroy$))
          .subscribe((Venta) => {
            this.listar();
            this.snackbar.open("Los datos se eliminaron correctamente", '', {
              duration: 3000
            });
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

