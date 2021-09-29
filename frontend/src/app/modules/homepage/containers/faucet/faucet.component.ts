import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../../services';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-faucet',
  templateUrl: './faucet.component.html',
  styleUrls: ['./faucet.component.scss']
})
export class FaucetComponent implements OnInit {
  formdata: FormGroup;
  error: any;
  success: any;

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.formdata = new FormGroup({
      address: new FormControl(),
    });
  }

  getFaucet($event) {
    this.dataService.getFaucet(this.formdata.value.address).subscribe(
      (data) => {
        this.error = null;
        this.success = 'Your arcs sent.';
      },
      (err) => {
        this.success = null;

        if (err.status === 422) {
          this.error = 'Enter correct arcs address.';
        }
        else {
          this.error = 'Something was wrong.';
        }
    });
  }
}
