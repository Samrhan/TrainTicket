import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BsModalService} from "ngx-bootstrap/modal";
import {UserService} from "../services/user.service";
import {User} from "../interfaces/user";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isCollapsed: boolean = true;
  loginForm = new FormGroup({
    mail: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  wrong_credentials = false;
  user: User | undefined;

  constructor(private userService: UserService, private modalService: BsModalService) {
    this.modalService.onHide.subscribe(() => {
      this.loginForm.markAsUntouched()
    })
    this.userService.getUser().subscribe((user) => {
      this.user = user
    })
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
    this.userService.login(this.loginForm.value.mail, this.loginForm.value.password).subscribe((user) => {
      this.user = user
      this.hideModal()
    })
  }

  disconnect() {
    this.userService.disconnect().subscribe(() => {
      this.user = undefined
    })
  }
}
