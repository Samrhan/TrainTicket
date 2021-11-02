import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BsModalService} from "ngx-bootstrap/modal";
import {UserService} from "../services/user.service";
import {User} from "../interfaces/user";
import {StoreService} from "../services/store.service";
import {RequireObject} from "../validators/require-object";
import {Observable} from "rxjs";
import {Address} from "../interfaces/address";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  addresses!: Observable<Address[]>
  isCollapsed: boolean = true;
  loginForm = new FormGroup({
    mail: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  registerForm = new FormGroup({
    mail: new FormControl('', Validators.required),
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    address: new FormControl('', [Validators.required, RequireObject]),
    password: new FormControl('', Validators.required)
  });
  wrongCredentials = false;
  alreadyExist = false;
  user: User | undefined;

  constructor(private userService: UserService, private modalService: BsModalService, public storeService: StoreService) {
    this.modalService.onHide.subscribe(() => {
      this.loginForm.markAsUntouched()
    })
    this.userService.getUser().subscribe((user) => {
      this.user = user
    }, error => {
    })
    this.registerForm.get('mail')!.valueChanges.subscribe(() => {
      if (this.alreadyExist)
        this.alreadyExist = false;
    })
    this.addresses = this.registerForm.get('address')!.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(1000),
      switchMap(input => this.userService.getAddress(input))
    )
  }

  ngOnInit(): void {
  }

  showModal(content: TemplateRef<any>): void {
    this.modalService.show(content);
  }

  hideModal() {
    this.modalService.hide()
  }

  login() {
    this.userService.login(this.loginForm.value).subscribe((user) => {
      this.user = user
      this.storeService.user = user;
      this.hideModal()
    })
  }

  register() {
    this.registerForm.value.address = this.registerForm.value.address.label
    this.userService.register(this.registerForm.value).subscribe(() => {
      this.hideModal()
    }, () => {
      this.alreadyExist = true;
      this.registerForm.get("mail")?.setErrors(Validators.required)
    })
  }

  disconnect() {
    this.userService.disconnect().subscribe(() => {
      this.user = undefined
    })
  }

  displayWith(value: any): string {
    if (value)
      return value.label;
    else return ''
  }
}
