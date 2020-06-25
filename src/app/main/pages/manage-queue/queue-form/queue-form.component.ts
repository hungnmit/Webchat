import { Component, Inject, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Queue } from '../queue.model';
import { ManageService } from 'app/_services';

@Component({
  selector: 'queue-form-dialog',
  templateUrl: './queue-form.component.html',
  styleUrls: ['./queue-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class QueueFormDialogComponent {
  action: string;
  queue: Queue;
  queueForm: FormGroup;
  dialogTitle: string;
  stringAgentInQueue: string;
  selectedOptions: string[];

  agents = new FormControl();
  //queueList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  agentList: string[] = this._manageService.GetAgentIDs;
  /**
   * Constructor
   *
   * @param {MatDialogRef<QueueFormDialogComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    public matDialogRef: MatDialogRef<QueueFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder,
    private _manageService: ManageService,
  ) {
    // Set the defaults
    this.action = _data.action;

    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Queue';
      this.queue = _data.queue;
      this.stringAgentInQueue = _data.queue.agentInQueue;
      if (this.stringAgentInQueue !== null) {
        this.selectedOptions = this.stringAgentInQueue.split(', ');
      }
      this.queueForm = this.editQueueForm();
    }
    else {
      this.dialogTitle = 'New Queue';
      this.queue = new Queue({});
      this.queueForm = this.createQueueForm();
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Create contact form
   *
   * @returns {FormGroup}
   */
  createQueueForm(): FormGroup {
    return this._formBuilder.group({
      id: [this.queue.id],
      name: [this.queue.name],
      dateReceived: [this.queue.dateReceived],
      agentInQueue: [this.queue.agentInQueue],
    });
  }
  editQueueForm(): FormGroup {
    return this._formBuilder.group({
      id: [{value: this.queue.id, disabled:true}],
      name: [this.queue.name],
      dateReceived: [this.queue.dateReceived],
      agentInQueue: [this.queue.agentInQueue],
    });
  }

  isClose: boolean;
  comboChange(event) {
    this.isClose = false;
    if (!event) {
      this.isClose = true;
      this.queueForm.controls.agentInQueue.setValue(this.agents.value);
    }
  }
}
