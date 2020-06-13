import { Queue } from './../../../manage-queue/queue.model';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { InfosService } from '../infos.service';

@Component({
    selector: 'infos-info-list',
    templateUrl: './info-list.component.html',
    styleUrls: ['./info-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class InfosInfoListComponent implements OnInit, OnDestroy {
    @ViewChild('dialogContent', { static: false })
    dialogContent: TemplateRef<any>;

    infos: any;
    user: any;
    dataSource: FilesDataSource | null;
    displayedColumns = ['avatar', 'id', 'category','quantity', 'active', 'buttons'];
    selectedInfos: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    queueId: any;

    @Input() queueid;
    @Input() agentinqueue;
    AgentInQueue: string[];
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {InfosService} _infosService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _infosService: InfosService,
        public _matDialog: MatDialog
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.queueId = this.queueid;
        //alert(this.queueid + this.agentinqueue);
        if (this.agentinqueue != null || this.agentinqueue != '') {
            this.AgentInQueue = this.agentinqueue.split(", ");
        }
        if (this.agentinqueue == undefined) {
            this.AgentInQueue = ["-1"];
        }
        if (this.queueid != "") {
            this.user = this._infosService.getUserData(this.queueid);
        }
        //this._infosService.getUserData(this.queueId);

        this.dataSource = new FilesDataSource(this._infosService);

        this._infosService.onInfosChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(infos => {
                this.infos = infos;

                this.checkboxes = {};
                infos.map(info => {
                    this.checkboxes[info.id] = false;
                });
            });

        this._infosService.onSelectedInfosChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedInfos => {
                for (const id in this.checkboxes) {
                    if (!this.checkboxes.hasOwnProperty(id)) {
                        continue;
                    }

                    this.checkboxes[id] = selectedInfos.includes(id);
                }
                this.selectedInfos = selectedInfos;
            });

        this._infosService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });

        this._infosService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._infosService.deselectInfos();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Edit info
     *
     * @param info
     */
    // editInfo(info): void
    // {
    //     this.dialogRef = this._matDialog.open(InfosInfoFormDialogComponent, {
    //         panelClass: 'info-form-dialog',
    //         data      : {
    //             info: info,
    //             action : 'edit'
    //         }
    //     });

    //     this.dialogRef.afterClosed()
    //         .subscribe(response => {
    //             if ( !response )
    //             {
    //                 return;
    //             }
    //             const actionType: string = response[0];
    //             const formData: FormGroup = response[1];
    //             switch ( actionType )
    //             {
    //                 /**
    //                  * Save
    //                  */
    //                 case 'save':

    //                     this._infosService.updateInfo(formData.getRawValue());

    //                     break;
    //                 /**
    //                  * Delete
    //                  */
    //                 case 'delete':

    //                     this.deleteInfo(info);

    //                     break;
    //             }
    //         });
    // }

    /**
     * Delete Info
     */
    deleteInfo(info): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._infosService.deleteInfo(info);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param infoId
     */
    onSelectedChange(infoId): void {
        this._infosService.toggleSelectedInfo(infoId);
    }

    /**
     * Toggle star
     *
     * @param infoId
     */
    toggleStar(infoId): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to add agent for queue?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (this.user.agentInQueue.includes(infoId)) {
                    this.user.agentInQueue.splice(this.user.agentInQueue.indexOf(infoId), 1);
                }
                else {
                    this.user.agentInQueue.push(infoId);
                }
                this._infosService.updateUserData(this.user);
                this.AgentInQueue = this.user.agentInQueue;
                //this._infosService.deleteInfo(info);
            }
            this.confirmDialogRef = null;
        });
    }
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {InfosService} _infosService
     */
    constructor(
        private _infosService: InfosService
    ) {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]> {
        return this._infosService.onInfosChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void {
    }
}
