import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Address} from "../interfaces/address";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }
  getAddress(name: string): Observable<Address[]> {
    return this.http
      .get<Address[]>(`${environment.api}address/${name}`)
  }
}
