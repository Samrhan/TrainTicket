import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {UserService} from "../../services/user.service";
import {Observable} from "rxjs";
import {Address} from "../../interfaces/address";
import {RequireObject} from "../../validators/require-object";
import {StoreService} from "../../services/store.service";
import {User} from "../../interfaces/user";

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

  addresses!: Observable<Address[]>
  user!: User;
  form = new FormGroup({
    mail: new FormControl('', Validators.required),
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    address: new FormControl(null, [Validators.required, RequireObject]),
  });

  constructor(private userService: UserService, private storeService: StoreService) {
    this.addresses = this.form.get('address')!.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(1000),
      switchMap(input => this.userService.getAddress(input))
    )
    this.userService.getUser().subscribe((user) => {
      this.user = user
      this.form.get('mail')?.setValue(this.user.mail)
      this.form.get('firstname')?.setValue(this.user.firstname)
      this.form.get('lastname')?.setValue(this.user.lastname)
      this.form.get('address')?.setValue({label: this.user.address})
    })
  }

  ngOnInit(): void {
  }

  displayWith(value: any): string {
    if (value)
      return value.label;
    else return ''
  }

}
