import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { InfosService } from 'app/main/apps/infos/infos.service';

@Component({
    selector     : 'infos',
    templateUrl  : './infos.component.html',
    styleUrls    : ['./infos.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class InfosComponent implements OnInit, OnDestroy
{
    dialogRef: any;
    hasSelectedInfos: boolean;
    searchInput: FormControl;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {InfosService} _infosService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _infosService: InfosService,
        private _fuseSidebarService: FuseSidebarService,
        private _matDialog: MatDialog
    )
    {
        // Set the defaults
        this.searchInput = new FormControl('');

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
                this.hasSelectedInfos = selectedInfos.length > 0;
            });

        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this._infosService.onSearchTextChanged.next(searchText);
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
     * New info
     */
    // newContact(): void
    // {
    //     this.dialogRef = this._matDialog.open(InfosContactFormDialogComponent, {
    //         panelClass: 'info-form-dialog',
    //         data      : {
    //             action: 'new'
    //         }
    //     });

    //     this.dialogRef.afterClosed()
    //         .subscribe((response: FormGroup) => {
    //             if ( !response )
    //             {
    //                 return;
    //             }

    //             this._infosService.updateContact(response.getRawValue());
    //         });
    // }

    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void
    {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
}
