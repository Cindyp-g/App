export interface Venta{
    totalventa: number;
    cveUsuario:number;
    productoVenta: DetalleVenta[];


}

export interface DetalleVenta{
    cantidad: number;
    precioProducto:number;
    cveProducto: number;
 
}