import { Component, model } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RegistrationService } from '../service/registration.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-set-role',
  imports: [],
  templateUrl: './set-role.component.html',
  styleUrl: './set-role.component.css'
})
export class SetRoleComponent {

  constructor(public activeModal: NgbActiveModal ,
    private _Reg : RegistrationService ,
    private router : Router
  ) { }


selectRole(role: string): void {
  const payload = { role };
  this._Reg.setRole(payload).subscribe({
    next: (res) => {
      console.log('Role set successfully:', res);
      this.router.navigate(['/layout/home']);
      this.activeModal.close(true);
    },
    error: (err) => {
      console.error('Error setting role:', err);
    }
  });
}


}
