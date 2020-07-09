import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { Agent } from 'app/main/pages/agent-manage/agent/agent.model';
import { ManageAgentService } from 'app/main/pages/agent-manage/agent/agent.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatDialog } from '@angular/material/dialog';
import { ContactsService } from '../contacts/contacts.service';

@Component({
    selector: 'e-commerce-product',
    templateUrl: './agent.component.html',
    styleUrls: ['./agent.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ManageAgentComponent implements OnInit, OnDestroy {
    agent: Agent;
    pageType: string;
    productForm: FormGroup;
    queues = new FormControl();
    toggleInArray = FuseUtils.toggleInArray;

    dialogRef: any;
    hasSelectedContacts: boolean;
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
     * @param {ContactsService} _contactsService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _ecommerceProductService: ManageAgentService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,

        private _contactsService: ContactsService,
        private _fuseSidebarService: FuseSidebarService,
        private _matDialog: MatDialog
    ) {
        // Set the default
        this.agent = new Agent();

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
        this._ecommerceProductService.onAgentChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(product => {

                if (product) {
                    this.agent = new Agent(product);
                    this.pageType = 'edit';
                }
                else {
                    this.pageType = 'new';
                    this.agent = new Agent();
                }

                this.productForm = this.createProductForm();
            });

        this._contactsService.onSelectedContactsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedContacts => {
                this.hasSelectedContacts = selectedContacts.length > 0;
            });

        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                //this._contactsService.onSearchTextChanged.next(searchText);
                this._contactsService.getDataSearch(searchText);
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
            id: [this.agent.id],
            password: [this.agent.password],
            dateReceived: [this.agent.dateReceived],
            agentInQueue: [this.agent.agentInQueue],
            online: [this.agent.online],
            talking: [this.agent.talking]

            // name            : [this.agent.name],
            // handle          : [this.agent.handle],
            // description     : [this.agent.description],
            // categories      : [this.agent.categories],
            // tags            : [this.agent.tags],
            // images          : [this.agent.images],
            // priceTaxExcl    : [this.agent.priceTaxExcl],
            // priceTaxIncl    : [this.agent.priceTaxIncl],
            // taxRate         : [this.agent.taxRate],
            // comparedPrice   : [this.agent.comparedPrice],
            // quantity        : [this.agent.quantity],
            // sku             : [this.agent.sku],
            // width           : [this.agent.width],
            // height          : [this.agent.height],
            // depth           : [this.agent.depth],
            // weight          : [this.agent.weight],
            // extraShippingFee: [this.agent.extraShippingFee],
            // active          : [this.agent.active]
        });
    }

    /**
     * Save product
     */
    saveAgent(): void {
        const data = this.productForm.getRawValue();
        //data.handle = FuseUtils.handleize(data.name);

        this._ecommerceProductService.saveAgent(data)
            .then(() => {

                // Trigger the subscription with new data
                this._ecommerceProductService.onAgentChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Agent saved', 'OK', {
                    verticalPosition: 'top',
                    horizontalPosition: 'right',
                    duration: 2000
                });
            });
    }

    /**
     * Add product
     */
    addAgent(): void {
        const data = this.productForm.getRawValue();
        //data.handle = FuseUtils.handleize(data.name);

        this._ecommerceProductService.addAgent(data)
            .then(() => {

                // Trigger the subscription with new data
                this._ecommerceProductService.onAgentChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Agent added', 'OK', {
                    verticalPosition: 'top',
                    horizontalPosition: 'right',
                    duration: 2000
                });

                // Change the location with new one
                this._location.go('/pages/agents/' + this.agent.id + '/' + '');
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
