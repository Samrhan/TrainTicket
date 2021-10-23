import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {UserService} from "../../services/user.service";
import {Observable} from "rxjs";
import {Address} from "../../interfaces/address";
import {RequireMatch} from "../../validators/require-match";

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

  addresses!: Observable<Address[]>

  form = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    address: new FormControl(null, [Validators.required, RequireMatch]),
  });

  constructor(private userService: UserService) {
    this.addresses = this.form.get('address')!.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(1000),
      switchMap(input => this.userService.getAddress(input))
    )
  }

  ngOnInit(): void {
  }

  displayWith(value: any): string {
    if (value)
      return value.label;
    else return ''
  }

}
