import {Injectable} from '@angular/core';
import {User} from "../interfaces/user";
import {Journey} from "../interfaces/journey";

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor() {
  }

  private _user!: User;

  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this._user = value;
  }

  private _bookedJourney!: Journey

  get bookedJourney(): Journey {
    return this._bookedJourney;
  }

  set bookedJourney(value: Journey) {
    this._bookedJourney = value;
  }
}
