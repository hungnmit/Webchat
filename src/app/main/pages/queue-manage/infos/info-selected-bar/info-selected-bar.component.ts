import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { InfosService } from '../infos.service';


@Component({
    selector   : 'selected-bar',
    templateUrl: './info-selected-bar.component.html',
    styleUrls  : ['./info-selected-bar.component.scss']
})
export class InfosSelectedBarComponent implements OnInit, OnDestroy
{
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    hasSelectedInfos: boolean;
    isIndeterminate: boolean;
    selectedInfos: string[];

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
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._infosService.onSelectedInfosChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedInfos => {
                this.selectedInfos = selectedInfos;
                setTimeout(() => {
                    this.hasSelectedInfos = selectedInfos.length > 0;
                    this.isIndeterminate = (selectedInfos.length !== this._infosService.infos.length && selectedInfos.length > 0);
                }, 0);
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Select all
     */
    selectAll(): void
    {
        this._infosService.selectInfos();
    }

    /**
     * Deselect all
     */
    deselectAll(): void
    {
        this._infosService.deselectInfos();
    }

    /**
     * Delete selected infos
     */
    deleteSelectedInfos(): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected infos?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                    this._infosService.deleteSelectedInfos();
                }
                this.confirmDialogRef = null;
            });
    }
}
