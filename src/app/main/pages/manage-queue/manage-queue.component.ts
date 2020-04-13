import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment.prod';
import { AuthenticationService } from 'app/_services';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Queue } from './queue.model';
import { QueueFormDialogComponent } from './queue-form/queue-form.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-manage-queue',
  templateUrl: './manage-queue.component.html',
  styleUrls: ['./manage-queue.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  providers: [DatePipe]
})
export class ManageQueueComponent implements OnInit {
  dialogRef: any;
  /**
     * Constructor
     *
     * @param {MatDialog} _matDialog
     */

  settings = {
    mode: 'inline',
    actions: {
      columnTitle: 'Actions',
      add: false,
      edit: false,
      delete: true,
      custom: [
        { name: 'editrecord', title: '<i><mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">edit</mat-icon></i>' }
      ],
      position: 'left'
    },
    add: {
      addButtonContent: '<i><mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">add_circle_outline</mat-icon></i>',
      createButtonContent: '<i><mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">check_circle_outline</mat-icon></i>',
      cancelButtonContent: '<i><mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">close_circle_outline</mat-icon></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i><mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">edit</mat-icon></i>',
      saveButtonContent: '<i><mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">check_circle</mat-icon></i>',
      cancelButtonContent: '<i><mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">close_circle_outline</mat-icon></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i><mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">delete</mat-icon></i>',
      confirmDelete: true,
    },
    columns: {
      id: {
        title: 'ID',
        type: 'string',
        editable: false,
      },
      name: {
        title: 'Name',
        type: 'string',
      },
      dateReceived: {
        title: 'Date Received',
        type: 'Date',
        valuePrepareFunction: (dateReceived) => {
          var raw = new Date(dateReceived);
          var formatted = this.datePipe.transform(raw, 'dd MMM yyyy HH:mm:ss');
          return formatted;
        },
        defaultValue: new Date().toLocaleString(),
        editable: false,
        addable: false,
      },
      agentInQueue: {
        title: 'Agent In Queue',
        type: 'string',
      },
    },
  };
  //Get data from table queue

  renderValue: string;

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
    private authenticationService: AuthenticationService,
    private router: Router,
    private _matDialog: MatDialog
  ) {
  }
  source: any = [];
  ngOnInit(): void {
    // redirect to chat if logged is not admin
    if (!this.authenticationService.isAdmin) {
      this.router.navigate(['/apps/chat']);
    }
    this.LoadQueues();
  }
  LoadQueues(): void {
    this.http.get<Queue[]>(`${environment.API_URL}/queue`).subscribe(
      data => {
        this.source = data['result'];
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log("Client-side error occured.");
        } else {
          console.log("Server-side error occured.");
        }
      });
  };
  newQueue(): void {
    this.dialogRef = this._matDialog.open(QueueFormDialogComponent, {
      panelClass: 'queue-form-dialog',
      data: {
        action: 'new'
      }
    });

    this.dialogRef.afterClosed()
      .subscribe((response: FormGroup) => {
        if (!response) {
          return;
        }
        //console.log("Dialog output:", response.value);
        this.CreateQueue(response.value)
      });
  }
  //event create button
  CreateQueue(Queue): void {
    this.http.post<Queue[]>(`${environment.API_URL}/queue`, Queue).subscribe(result => {
      this.LoadQueues();
    }, (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
        console.log("Client-side error occured.");
      } else {
        console.log("Server-side error occured.");
      }
    });
  };
  onCustomAction(event) {
    switch (event.action) {
      case 'editrecord':
        this.editRecord(event.data);
    }
  }
  public editRecord(formData: any) {
    this.dialogRef = this._matDialog.open(QueueFormDialogComponent, {
      panelClass: 'queue-form-dialog',
      data: {
        action: 'edit',
        queue: formData
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (!response) {
          return;
        }
        const actionType: string = response[0];
        const formData: FormGroup = response[1];
        switch (actionType) {
          /**
           * Save
           */
          case 'save':
            let formTemp: FormGroup = null;
            formTemp = formData.getRawValue();
            var agentInQueue = formTemp['agentInQueue'];
            if(typeof agentInQueue === "string")
            {
              formTemp['agentInQueue'] = agentInQueue.split(", ");
            }
            this.UpdateQueue(formTemp);
            //console.log("Dialog output:", response.value);

            break;
          /**
           * Close
           */
          case 'close':

            return;

            break;
        }
      });
  }
  //event edit button
  UpdateQueue(Queue): void {
    this.http.put<Queue[]>(`${environment.API_URL}/queue/` + Queue.id, Queue).subscribe(result => {
      this.LoadQueues();
    }, (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
        console.log("Client-side error occured.");
      } else {
        console.log("Server-side error occured.");
      }
    });
  };
  //event delete button
  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.http.delete<ListQueues[]>(`${environment.API_URL}/queue/` + event.data.id).subscribe(result => {
        event.confirm.resolve(event.data);
      }, (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log("Client-side error occured.");
        } else {
          console.log("Server-side error occured.");
        }
      });
    } else {
      event.confirm.reject();
    }
  };

  // //event create button
  // onCreateConfirm(event): void {
  //   if (window.confirm('Are you sure you want to add new queue?')) {
  //     // if(this.source.included(event.newData.id))
  //     // {
  //     //   this.renderValue = 'error';
  //     //   event.confirm.reject();
  //     // }
  //     this.http.post<ListQueues[]>(environment.urlQueue, event.newData).subscribe(result => {
  //       //this.settings = Object.assign({}, this.settings);
  //       event.confirm.resolve(event.newData);
  //     }, (err: HttpErrorResponse) => {
  //       if (err.error instanceof Error) {
  //         console.log("Client-side error occured.");
  //       } else {
  //         console.log("Server-side error occured.");
  //       }
  //     });
  //   } else {
  //     event.confirm.reject();
  //   }
  // };
  // //event edit button
  // onSaveConfirm(event): void {
  //   if (window.confirm('Are you sure you want to update?')) {
  //     this.http.put<ListQueues[]>(environment.urlQueue + event.data.id, event.newData).subscribe(result => {
  //       event.confirm.resolve(event.newData);
  //     }, (err: HttpErrorResponse) => {
  //       if (err.error instanceof Error) {
  //         console.log("Client-side error occured.");
  //       } else {
  //         console.log("Server-side error occured.");
  //       }
  //     });
  //   } else {
  //     event.confirm.reject();
  //   }
  // };
}
export interface ListQueues {
  id: string;
  name: string;
  dateReceived: Date;
};