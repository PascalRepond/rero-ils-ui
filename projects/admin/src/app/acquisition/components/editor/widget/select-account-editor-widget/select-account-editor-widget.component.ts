/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
 * Copyright (C) 2021 UCLouvain
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import { getCurrencySymbol } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { ApiService } from '@rero/ng-core';
import { AcqAccountApiService } from 'projects/admin/src/app/acquisition/api/acq-account-api.service';
import { AcqAccount } from 'projects/admin/src/app/acquisition/classes/account';
import { OrganisationService } from 'projects/admin/src/app/service/organisation.service';

@Component({
  selector: 'admin-select-account-editor-widget',
  templateUrl: './select-account-editor-widget.component.html',
  styleUrls: ['../../../../acquisition.scss', './select-account-editor-widget.component.scss']
})
export class SelectAccountEditorWidgetComponent extends FieldType implements OnInit {

  // COMPONENT ATTRIBUTES =======================================================
  /** accounts list */
  accountList: Array<AcqAccount> = [];
  /** the selected account */
  selectedAccount: AcqAccount = null;

  // GETTER & SETTER ============================================================
  /** Get the current organisation */
  get organisation(): any {
    return this._organisationService.organisation;
  }

  /** Get the currency symbol for the organisation */
  get currencySymbol(): any {
    return getCurrencySymbol(this.organisation.default_currency, 'wide');
  }

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param _accountApiService - AcqAccountApiService
   * @param _organisationService - OrganisationService
   * @param _apiService - ApiService
   */
  constructor(
    private _accountApiService: AcqAccountApiService,
    private _organisationService: OrganisationService,
    private _apiService: ApiService
  ) {
    super();
  }

  /** OnInit hook */
  ngOnInit(): void {
    this._accountApiService.getAccounts().subscribe((accounts: AcqAccount[]) => {
      accounts = this._accountApiService.orderAccountsAsTree(accounts);
      this.accountList = accounts;

      if (this.formControl.value) {
        const currentPid = this.formControl.value.substring(this.formControl.value.lastIndexOf('/') + 1);
        const currentAccount = this.accountList.find((account: AcqAccount) => account.pid === currentPid);
        if (currentAccount !== undefined) {
          this.selectedAccount = currentAccount;
        }
      }
    });
  }

  // COMPONENT FUNCTIONS ======================================================
  /**
   * Store the selected option, when an option is clicked in the list
   * @param account - The selected account.
   */
  selectAccount(account: AcqAccount): void {
    const accountRef = this._apiService.getRefEndpoint('acq_accounts', account.pid);
    this.selectedAccount = account;
    this.formControl.patchValue(accountRef);
  }
}