import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../../services';
import {FormControl, FormGroup} from '@angular/forms';
import {OnExecuteData, ReCaptchaV3Service} from 'ng-recaptcha';
import FingerprintJS from '@fingerprintjs/fingerprintjs'

@Component({
  selector: 'app-faucet',
  templateUrl: './faucet.component.html',
  styleUrls: ['./faucet.component.scss']
})
export class FaucetComponent implements OnInit {
  formdata: FormGroup;
  error: any;
  success: any;

  constructor(private dataService: DataService, private recaptchaV3Service: ReCaptchaV3Service) {
  }

  ngOnInit() {
    this.formdata = new FormGroup({
      address: new FormControl(),
    });
  }

  async getFaucet() {
    await this.recaptchaV3Service
      .execute('login')
      .subscribe(async (recaptcha) => {
        const fp = await FingerprintJS.load();
        const result = await fp.get();

        this.dataService.getFaucet(this.formdata.value.address, recaptcha, result.visitorId).subscribe(
          (data) => {
            this.error = null;
            this.success = 'Your arcs sent.';
          },
          (err) => {
            this.success = null;

            if (err.status === 422 && err.error.errors[0].param === 'limit') {
              this.error = 'Requests limit is 1 request per day.';
            }
            else if (err.status === 422) {
              this.error = 'Enter correct arcs address.';
            } else {
              this.error = 'Something was wrong.';
            }
          });
      });
  }
}
