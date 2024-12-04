import { Producto } from "./producto.interface";

export interface ProductosVenta{

    producto: Producto;
    cantidad: number;
    precio: number;
    importe: number;

}