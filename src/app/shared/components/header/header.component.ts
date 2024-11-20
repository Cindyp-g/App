import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../pages/auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent  implements OnInit, OnDestroy{


  @Output( ) toggleSidenav = new EventEmitter<void>();


  isLogged= false;
  data: any={};
  private destroy$ = new Subject<any>();

  constructor(private authSvc: AuthService) {
    this.obtenerInformacion();
  }

  ngOnInit(): void {
    
    
  }

  obtenerInformacion() {
    //TODO: Obtener la variable para indicar si tienen una session 
    this.authSvc.isLogged$.pipe(takeUntil(this.destroy$)).subscribe( (isLogged) => {
      this.isLogged = isLogged;
      console.log("islogged:", isLogged);
    });

    //TODO: Obtener la informacion del usuario en session 

    this.authSvc.tokenData$.pipe(takeUntil(this.destroy$)).subscribe( (data) => {
      this.data = data;
      console.log("data:", data);
    });
  }

  onToggleSidenav(){
    this.toggleSidenav.emit();
  }

  onLogout() {
    this.authSvc.logout();
  }

  ngOnDestroy(): void {
    
  }

}
