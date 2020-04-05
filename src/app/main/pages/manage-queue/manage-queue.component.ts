import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment.prod';
import { AuthenticationService } from 'app/_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-queue',
  templateUrl: './manage-queue.component.html',
  styleUrls: ['./manage-queue.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations,
  providers:[DatePipe]
})
export class ManageQueueComponent implements OnInit {
  settings = {
    mode: 'inline',
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
        editable:false,
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
        editable:false,
        addable: false,
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
    ){
  }
  source:any = [];
  ngOnInit(): void {
    // redirect to chat if logged is not admin
    if (!this.authenticationService.isAdmin) {
      this.router.navigate(['/apps/chat']);
    }
      this.http.get<ListQueues[]>(environment.urlQueue).subscribe(
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
  }
   //event delete button
   onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.http.delete<ListQueues[]>(environment.urlQueue + event.data.id).subscribe(result => {
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
  onCreateConfirm(event):void {
    if (window.confirm('Are you sure you want to add new queue?')) {
      // if(this.source.included(event.newData.id))
      // {
      //   this.renderValue = 'error';
      //   event.confirm.reject();
      // }
      this.http.post<ListQueues[]>(environment.urlQueue,event.newData).subscribe(result => {
        //this.settings = Object.assign({}, this.settings);
        event.confirm.resolve(event.newData);
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
  //event edit button
  onSaveConfirm(event):void {
    if (window.confirm('Are you sure you want to update?')) {
      this.http.put<ListQueues[]>(environment.urlQueue + event.data.id, event.newData).subscribe(result => {
        event.confirm.resolve(event.newData);
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
}
export interface ListQueues {
  id: string;
  name: string;
  dateReceived: Date;
};