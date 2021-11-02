import {Injectable} from '@angular/core';
import {StoreService} from "../store.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class NotStoredJourneyPreventService {

  constructor(private storeService: StoreService, public router: Router) {
  }

  canActivate(): boolean {
    if (!this.storeService.bookedJourney) {
      this.router.navigateByUrl('/')
      return false
    } else return true
  }
}
