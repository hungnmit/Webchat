import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { ManageAgentsService } from 'app/main/pages/agent-manage/agents/agents.service';
import { takeUntil } from 'rxjs/internal/operators';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { FileInput } from 'ngx-material-file-input';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';
import { Agent } from './agent.model';
import * as XLSX from 'xlsx';
import { PeriodicElement } from 'assets/angular-material-examples/table-basic/table-basic-example';

@Component({
    selector: 'manage-agents',
    templateUrl: './agents.component.html',
    styleUrls: ['./agents.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ManageAgentsComponent implements OnInit {

    constructor(
        private _manageAgentsServiceService: ManageAgentsService,
        public _matDialog: MatDialog,
        private _matSnackBar: MatSnackBar,
        private _httpClient: HttpClient,
        private changeDetectorRefs: ChangeDetectorRef
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    dataSource: FilesDataSource | null;
    displayedColumns = ['id', /*'image',*/ 'name', 'category', 'quantity', 'active', 'remove'];

    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    @ViewChild('filter', { static: true })
    filter: ElementRef;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    @ViewChild('TABLE', { static: true }) table: ElementRef;
    // Private
    private _unsubscribeAll: Subject<any>;

    dataString = null;

    fileName = 'AgentsSheet.xlsx';

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.loadAgents();
    }
    // tslint:disable-next-line: typedef
    loadAgents() {

        fromEvent(this.filter.nativeElement, 'keyup')
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(150),
                distinctUntilChanged()
            )
            .subscribe(() => {
                if (!this.dataSource) {
                    return;
                }

                this.dataSource.filter = this.filter.nativeElement.value;
            });
        this._manageAgentsServiceService.resolve();
        this.dataSource = new FilesDataSource(this._manageAgentsServiceService, this.paginator, this.sort);
    }
    /**
     * Delete Agent
     */
    deleteAgent(idAagent: number): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(async result => {
            if (result) {
                await this._manageAgentsServiceService.deleteAgent(idAagent);
                // Show the success message
                // this._manageAgentsServiceService.resolve();
                this.loadAgents();
                this._matSnackBar.open('Agent deleted', 'OK', {
                    verticalPosition: 'top',
                    horizontalPosition: 'right',
                    duration: 2000
                });
            }
            this.confirmDialogRef = null;
        });
    }

    // tslint:disable-next-line: typedef
    selectFile(event) {
        if (event.target.files.length > 0) {
            // const file = event.target.files[0];
            // this.filesToUpload = file;
            let workBook = null;
            let jsonData = null;
            const reader = new FileReader();
            const file = event.target.files[0];
            const checkTypeFile = file.name.includes('.xlsx');
            if (checkTypeFile) {
                // tslint:disable-next-line: no-shadowed-variable
                reader.onload = (event) => {
                    this.dataString = null;
                    const data = reader.result;
                    workBook = XLSX.read(data, { type: 'binary' });
                    jsonData = workBook.SheetNames.reduce((initial, name) => {
                        const firstSheet = workBook.SheetNames[0];
                        // Read all rows from First Sheet into an JSON array.
                        const excelRows = XLSX.utils.sheet_to_json(workBook.Sheets[firstSheet]);
                        // const sheet = workBook.Sheets[name];
                        // initial[name] = XLSX.utils.sheet_to_json(sheet);
                        return excelRows;
                    }, {});
                    // this.dataString = JSON.stringify(jsonData);
                    this.dataString = jsonData;
                };
                reader.readAsBinaryString(file);
            }
            else{
                alert('Please import file .xlsx');
            }
        }
    }
    Import(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post<Agent[]>(`${environment.API_URL}/importFileAgent`, this.dataString)
                .subscribe((response: any) => {
                    if (response.result) {
                        // Show the success message
                        this._matSnackBar.open('Import success', 'OK', {
                            verticalPosition: 'top',
                            horizontalPosition: 'right',
                            duration: 2000
                        });
                        this._manageAgentsServiceService.resolve();
                        this.loadAgents();
                        resolve(response);
                    }
                    else {
                        this._matSnackBar.open('Import failed', 'OK', {
                            verticalPosition: 'top',
                            horizontalPosition: 'right',
                            duration: 2000
                        });
                    }
                }, reject);
        });
    }
    // tslint:disable-next-line: typedef
    ExportFile() 
    {
       /* table id is passed over here */   
       // let element = document.getElementById('excel-table'); 
       // const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(this.table.nativeElement);
       const ws = XLSX.utils.json_to_sheet(this.dataSource.filteredData);
       /* generate workbook and add the worksheet */
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

       /* save to file */
       XLSX.writeFile(wb, this.fileName);	
    }
}

export class FilesDataSource extends DataSource<any>
{
    private _filterChange = new BehaviorSubject('');
    private _filteredDataChange = new BehaviorSubject('');

    /**
     * Constructor
     *
     * @param {ManageAgentsService} _manageAgentsServiceService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
        private _manageAgentsServiceService: ManageAgentsService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    )
    {
        super();

        this.filteredData = this._manageAgentsServiceService.agents;
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        const displayDataChanges = [
            this._manageAgentsServiceService.onAgentsChanged,
            this._matPaginator.page,
            this._filterChange,
            this._matSort.sortChange
        ];

        return merge(...displayDataChanges)
            .pipe(
                map(() => {
                        let data = this._manageAgentsServiceService.agents.slice();

                        data = this.filterData(data);

                        this.filteredData = [...data];

                        data = this.sortData(data);

                        // Grab the page's slice of data.
                        const startIndex = this._matPaginator.pageIndex * this._matPaginator.pageSize;
                        return data.splice(startIndex, this._matPaginator.pageSize);
                    }
                ));
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    // Filtered data
    get filteredData(): any
    {
        return this._filteredDataChange.value;
    }

    set filteredData(value: any)
    {
        this._filteredDataChange.next(value);
    }

    // Filter
    get filter(): string
    {
        return this._filterChange.value;
    }

    set filter(filter: string)
    {
        this._filterChange.next(filter);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Filter data
     *
     * @param data
     * @returns {any}
     */
    filterData(data): any
    {
        if ( !this.filter )
        {
            return data;
        }
        return FuseUtils.filterArrayByString(data, this.filter);
    }

    /**
     * Sort data
     *
     * @param data
     * @returns {any[]}
     */
    sortData(data): any[]
    {
        if ( !this._matSort.active || this._matSort.direction === '' )
        {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch ( this._matSort.active )
            {
                case 'id':
                    [propertyA, propertyB] = [a.id, b.id];
                    break;
                case 'name':
                    [propertyA, propertyB] = [a.name, b.name];
                    break;
                case 'categories':
                    [propertyA, propertyB] = [a.categories[0], b.categories[0]];
                    break;
                case 'price':
                    [propertyA, propertyB] = [a.priceTaxIncl, b.priceTaxIncl];
                    break;
                case 'quantity':
                    [propertyA, propertyB] = [a.quantity, b.quantity];
                    break;
                case 'active':
                    [propertyA, propertyB] = [a.active, b.active];
                    break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._matSort.direction === 'asc' ? 1 : -1);
        });
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
