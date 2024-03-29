import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Address} from "../interfaces/address";
import {User} from "../interfaces/user";
import {StoreService} from "./store.service";
import {LoginForm} from "../interfaces/login-form";
import {RegisterForm} from "../interfaces/register-form";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private storeService: StoreService) {
  }

  getAddress(name: string): Observable<Address[]> {
    return this.http
      .get<Address[]>(`${environment.api}address/${name}`)
  }

  login(loginForm: LoginForm): Observable<User> {
    return this.http
      .post<User>(`${environment.api}login`,
        loginForm,
        {withCredentials: true})
  }

  register(registerForm: RegisterForm): Observable<User> {
    return this.http
      .post<User>(`${environment.api}register`,
        registerForm,
        {withCredentials: true})
  }

  disconnect(): Observable<object> {
    return this.http.post(
      `${environment.api}disconnect`, {},
      {withCredentials: true}
    )
  }

  getUser(): Observable<User> {
    if (!this.storeService.user)
      return this.http.get<User>(
        `${environment.api}me`,
        {withCredentials: true}
      )
    else return new Observable<User>(observer => {
      observer.next(this.storeService.user)
      observer.complete()
    })
  }
}
