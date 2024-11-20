import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import { BehaviorSubject, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token = new BehaviorSubject<String>("");
  private tokenData = new BehaviorSubject<any>({});
  private isLogged = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object) {
    this.checkToken();
  }

  get token$() {
    return this.token.asObservable();
  }

  get tokenValue() {
    return this.token.getValue();
  }

  get tokenData$() {
    return this.tokenData.asObservable();
  }

  get isLogged$() {
    return this.isLogged.asObservable();
  }
  login(loginData: any){
  return this.http.post(`${environment.API_URL}/auth`, loginData)
    .pipe(map( (data: any) => {
      if (data.token){
        this.saveLocalStroge(data.token);
        this.token.next(data.token);
        this.isLogged.next(true);
        this.checkToken();

        this.router.navigate(['/home']);
      }
      return data;

    }),
    catchError ((error) => this.handlerError(error)));
  }

  saveLocalStroge(token:string){
    localStorage.setItem("jwt_session",token);
  }

  logout(){
    if (isPlatformBrowser(this.platformId)){
      localStorage.removeItem("jwt_session");
    }

    this.token.next("");
    this.tokenData.next(null);
    this.isLogged.next(false);

    this.router.navigate(['/home']);
  }

  checkToken(){
    var token:string | null ="";
    if (isPlatformBrowser(this.platformId)){
      token = localStorage.getItem("jwt_session")
    }
    if(token){
      const isExpired = helper.isTokenExpired(token);
      if(isExpired)
        this.logout();
      else{
        this.token.next(token);
        const {iat,exp,...data}= helper.decodeToken(token);
        this.tokenData.next(data);
        this.isLogged.next(true);
      }
    }else{
      this.logout();
    }
  }

  handlerError(error:any){
    var message = "Ocurrio un error";
    if(error.error){
      if(error.error.message) message = error.error.message;
    }

    this.snackBar.open(message,'',{
      duration: 3000,
      verticalPosition:'top',
      horizontalPosition:'end'
    });

    return throwError(()=> new Error(message));
  }
}