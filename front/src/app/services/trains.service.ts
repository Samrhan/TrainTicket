import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {Station} from "../interfaces/station";
import {Journey} from "../interfaces/journey";

@Injectable({
  providedIn: 'root'
})
export class TrainsService {

  formatDate(date: Date, hour: number): string{
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    return `${year}${month < 9 ? `0${month}` : month}${day < 9 ? `0${day}` : day}T${hour < 9 ? `0${hour}` : hour}0000`
  }

  constructor(private http: HttpClient) {
  }

  getStation(name: string): Observable<Station[]> {
    return this.http
      .get<Station[]>(`${environment.api}trainstation/${name}`)
  }

  getTravel(departureId: string, arrivalId: string, date: Date, hour: number): Observable<Array<Journey>> {
    date = new Date(date)
    return this.http
      .get<Array<Journey>>(`${environment.api}search/${departureId}/${arrivalId}/${this.formatDate(date,hour)}`)
  }
}
