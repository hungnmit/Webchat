import { Component, Inject, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Agent } from '../agent.model';
import { ManageService } from 'app/_services';

@Component({
  selector: 'agent-form-dialog',
  templateUrl: './agent-form.component.html',
  styleUrls: ['./agent-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AgentFormDialogComponent {
  action: string;
  agent: Agent;
  agentForm: FormGroup;
  dialogTitle: string;
  avatarDefault: string = 'assets/images/avatars/profile.jpg';
  stringAgentInQueue: string;
  selectedOptions: string[];

  queues = new FormControl();
  //queueList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  queueList: string[] = this._manageService.GetQueueIDs;
  /**
   * Constructor
   *
   * @param {MatDialogRef<AgentFormDialogComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    public matDialogRef: MatDialogRef<AgentFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder,
    private _manageService: ManageService,
  ) {
    // Set the defaults
    this.action = _data.action;

    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Agent';
      this.agent = _data.agent;
      this.stringAgentInQueue = _data.agent.agentInQueue;
      if (this.stringAgentInQueue !== null) {
        this.selectedOptions = this.stringAgentInQueue.split(', ');
      }
      this.agentForm = this.editAgentForm();
    }
    else {
      this.dialogTitle = 'New Agent';
      this.agent = new Agent({});
      this.agentForm = this.createAgentForm();
    }

    //this.agentForm = this.createAgentForm();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Create contact form
   *
   * @returns {FormGroup}
   */
  createAgentForm(): FormGroup {
    return this._formBuilder.group({
      id: [this.agent.id],
      password: [this.agent.password],
      dateReceived: [this.agent.dateReceived],
      //online: [this.agent.online],
      talking: [this.agent.talking],
      agentInQueue: [this.agent.agentInQueue],
    });
  }

  editAgentForm(): FormGroup {
    return this._formBuilder.group({
        id: [{value: this.agent.id, disabled:true}],
        password: [this.agent.password],
        dateReceived: [this.agent.dateReceived],
        //online: [this.agent.online],
        talking: [this.agent.talking],
        agentInQueue: [this.agent.agentInQueue],
    });
  }

  isClose: boolean;
  comboChange(event) {
    this.isClose = false;
    if (!event) {
      this.isClose = true;
      //console.log('dropdown is closed');
      this.agentForm.controls.agentInQueue.setValue(this.queues.value); //= this.toppings.value && this.toppings.value.toString();
      //console.log(this.agent.agentInQueue)
    }

  }
}
