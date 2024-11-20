import { NgModule } from "@angular/core";
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import { ReactiveFormsModule } from "@angular/forms";
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatMenuModule} from '@angular/material/menu';
import {MatListModule} from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';


const myModules: any= [
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatMenuModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSelectModule
]

@NgModule({
    imports: [...myModules],
    exports: [...myModules]
})

export class MaterialModule {

}