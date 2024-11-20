import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseForm } from '../../../shared/utilis/base-form';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
  })
  export class LoginComponent  implements OnInit, OnDestroy{
  
    hide = true;
    private destroy$ = new Subject<any>();
    loginForm = this.fb.group({
      username: ['',[Validators.required, Validators.minLength(3)]],
      password: ['',[Validators.required, Validators.minLength(3)]]
    });
  
    constructor(private fb:FormBuilder,public baseForm: BaseForm, private authSvc: AuthService, private snackbar: MatSnackBar) {}
  
    ngOnDestroy(): void {
      this.destroy$.next({});
      this.destroy$.complete();
    }
  
    onLogin(){
      //verificar que el formulario este correcto
      if (this.loginForm.invalid) return;
  
      //obtener la informacion del formulario y almacenarka en una variable "form"
      const form = this.loginForm.value;
  
      //ejecutar el servicio para obtener los datos
      this.authSvc.login(form).pipe(takeUntil(this.destroy$)).subscribe((data: any)=>{
        if (data){
          this.snackbar.open('Sesion Iniciada','',{
            duration:300,
            verticalPosition:'top',
            horizontalPosition:'end'
          })
        }
      });
    }
  
    ngOnInit(): void {
      
    } 
  
  }
