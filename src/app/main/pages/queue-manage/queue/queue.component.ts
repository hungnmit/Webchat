import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { Queue } from 'app/main/pages/queue-manage/queue/queue.model';
import { ManageQueueService } from 'app/main/pages/queue-manage/queue/queue.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatDialog } from '@angular/material/dialog';
import { InfosService } from '../infos/infos.service';

@Component({
    selector: 'e-commerce-product',
    templateUrl: './queue.component.html',
    styleUrls: ['./queue.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ManageQueueComponent implements OnInit, OnDestroy {
    queue: Queue;
    pageType: string;
    productForm: FormGroup;
    queues = new FormControl();
    toggleInArray = FuseUtils.toggleInArray;

    dialogRef: any;
    hasSelectedInfos: boolean;
    searchInput: FormControl;
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {EcommerceProductService} _ecommerceProductService
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     * 
     * @param {InfosService} _infosService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _ecommerceProductService: ManageQueueService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,

        private _infosService: InfosService,
        private _fuseSidebarService: FuseSidebarService,
        private _matDialog: MatDialog
    ) {
        // Set the default
        this.queue = new Queue();

        // Set the private defaults
        this._unsubscribeAll = new Subject();

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
    ngOnInit(): void {
        // Subscribe to update product on changes
        this._ecommerceProductService.onQueueChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(product => {

                if (product) {
                    this.queue = new Queue(product);
                    this.pageType = 'edit';
                }
                else {
                    this.pageType = 'new';
                    this.queue = new Queue();
                }

                this.productForm = this.createProductForm();
            });

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
                //this._infosService.onSearchTextChanged.next(searchText);
                this._infosService.getDataSearch(searchText);
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
     * Create product form
     *
     * @returns {FormGroup}
     */
    createProductForm(): FormGroup {
        return this._formBuilder.group({
            id: [this.queue.id],
            name: [this.queue.name],
            dateReceived: [this.queue.dateReceived],
            agentInQueue: [this.queue.agentInQueue],
        });
    }

    /**
     * Save product
     */
    saveQueue(): void {
        const data = this.productForm.getRawValue();
        //data.handle = FuseUtils.handleize(data.name);

        this._ecommerceProductService.saveQueue(data)
            .then(() => {

                // Trigger the subscription with new data
                this._ecommerceProductService.onQueueChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Queue saved', 'OK', {
                    verticalPosition: 'top',
                    horizontalPosition: 'right',
                    duration: 2000
                });
            });
    }

    /**
     * Add product
     */
    addQueue(): void {
        const data = this.productForm.getRawValue();
        //data.handle = FuseUtils.handleize(data.name);

        this._ecommerceProductService.addQueue(data)
            .then(() => {

                // Trigger the subscription with new data
                this._ecommerceProductService.onQueueChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Queue added', 'OK', {
                    verticalPosition: 'top',
                    horizontalPosition: 'right',
                    duration: 2000
                });

                // Change the location with new one
                this._location.go('/pages/queues/' + this.queue.id + '/' + '');
            });
    }

    /**
     * Update queue
     */
    updateQueue(): void {
        //this._scrumboardService.updateCard(this.card);
    }

    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
}
