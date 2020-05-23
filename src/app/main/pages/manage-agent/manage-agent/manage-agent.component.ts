import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../../environments/environment.prod';
import { AuthenticationService } from 'app/_services';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AgentFormDialogComponent } from './agent-form/agent-form.component';
import { FormGroup } from '@angular/forms';
import { Agent } from './agent.model';

@Component({
  selector: 'app-manage-agent',
  templateUrl: './manage-agent.component.html',
  styleUrls: ['./manage-agent.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  providers: [DatePipe]
})
export class ManageAgentComponent implements OnInit {
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
        width: '13%',
      },
      password: {
        title: 'Password',
        type: 'string',
        width: '13%',
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
        width: '22%',
      },
      online: {
        title: 'Status',
        type: 'string',
        valuePrepareFunction: (online) => {
          if (online) {
            return 'Online'
          }
          return 'Offline'
        },
        width: '12%',
      },
      talking: {
        title: 'Talking',
        type: 'string',
        width: '12%',
      },
      agentInQueue: {
        title: 'Agent In Queue',
        type: 'string',
      },
    },
  };
  //Get data from table agent

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

    this.LoadAgents();
  }
  LoadAgents(): void {
    this.http.get<Agent[]>(`${environment.API_URL}/agent`).subscribe(
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

  newAgent(): void {
    this.dialogRef = this._matDialog.open(AgentFormDialogComponent, {
      panelClass: 'agent-form-dialog',
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
        this.CreateAgent(response.value)
      });
  }

  //event create button
  CreateAgent(Agent): void {
    this.http.post<Agent[]>(`${environment.API_URL}/agent`, Agent).subscribe(result => {
      //this.settings = Object.assign({}, this.settings);
      this.LoadAgents();
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
    this.dialogRef = this._matDialog.open(AgentFormDialogComponent, {
      panelClass: 'agent-form-dialog',
      data: {
        action: 'edit',
        agent: formData
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
            if (typeof agentInQueue === "string") {
              formTemp['agentInQueue'] = agentInQueue.split(", ");
            }
            this.UpdateAgent(formTemp);
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
  UpdateAgent(Agent): void {
    this.http.put<Agent[]>(`${environment.API_URL}/agent/` + Agent.id, Agent).subscribe(result => {
      this.LoadAgents();
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
      this.http.delete<ListAgents[]>(`${environment.API_URL}/agent/` + event.data.id).subscribe(result => {
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

  //event create button
  // onCreateConfirm(event): void {
  //   if (window.confirm('Are you sure you want to add new agent?')) {
  //     // if(this.source.included(event.newData.id))
  //     // {
  //     //   this.renderValue = 'error';
  //     //   event.confirm.reject();
  //     // }
  //     this.http.post<ListAgents[]>(environment.urlAgent, event.newData).subscribe(result => {
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
  //     this.http.put<ListAgents[]>(environment.urlAgent + event.data.id, event.newData).subscribe(result => {
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

export interface ListAgents {
  id: string;
  password: string;
  dateReceived: string;
};

