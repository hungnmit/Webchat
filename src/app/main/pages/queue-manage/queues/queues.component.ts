import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { ManageQueuesService } from 'app/main/pages/queue-manage/queues/queues.service';
import { takeUntil } from 'rxjs/internal/operators';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { FileInput } from 'ngx-material-file-input';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';
import { Queue } from './queue.model';
import * as XLSX from 'xlsx';
import { PeriodicElement } from 'assets/angular-material-examples/table-basic/table-basic-example';

@Component({
    selector     : 'manage-queues',
    templateUrl  : './queues.component.html',
    styleUrls    : ['./queues.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ManageQueuesComponent implements OnInit
{
    dataSource: FilesDataSource | null;
    displayedColumns = ['id', 'image', 'name', 'category', 'action'];

    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;

    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filter: ElementRef;
    
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    fileExcel: any;
    @ViewChild('TABLE', {static: true}) table: ElementRef;
    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _manageQueuesServiceService: ManageQueuesService,
        public _matDialog: MatDialog,
        private _matSnackBar: MatSnackBar,
        private _httpClient: HttpClient,
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
        this.loadQueues();
    }
    
    /**
     * Delete Queue
     */
    deleteQueue(idAqueue : number): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._manageQueuesServiceService.deleteQueue(idAqueue);
                // Show the success message
                this._matSnackBar.open('Queue deleted', 'OK', {
                    verticalPosition: 'top',
                    horizontalPosition: 'right',
                    duration: 2000
                });
                this._manageQueuesServiceService.resolve();
                this.loadQueues();
            }
            this.confirmDialogRef = null;
        });
    }

    loadQueues(){
        this._manageQueuesServiceService.resolve();

        this.dataSource = new FilesDataSource(this._manageQueuesServiceService, this.paginator, this.sort);

        fromEvent(this.filter.nativeElement, 'keyup')
            .pipe(
                takeUntil(this._unsubscribeAll),
                //debounceTime(150),
                distinctUntilChanged()
            )
            .subscribe(() => {
                if ( !this.dataSource )
                {
                    return;
                }

                this.dataSource.filter = this.filter.nativeElement.value;
            });
    }

    dataString = null;

    selectFile(event) {
        if (event.target.files.length > 0) {
            //const file = event.target.files[0];
            //this.filesToUpload = file;
            let workBook = null;
            let jsonData = null;
            const reader = new FileReader();
            const file = event.target.files[0];
            let checkTypeFile = file.name.includes(".xlsx");
            if (checkTypeFile) {
                reader.onload = (event) => {
                    this.dataString = null;
                    const data = reader.result;
                    workBook = XLSX.read(data, { type: 'binary' });
                    jsonData = workBook.SheetNames.reduce((initial, name) => {
                        var firstSheet = workBook.SheetNames[0];
                        //Read all rows from First Sheet into an JSON array.
                        var excelRows = XLSX.utils.sheet_to_json(workBook.Sheets[firstSheet]);
                        // const sheet = workBook.Sheets[name];
                        // initial[name] = XLSX.utils.sheet_to_json(sheet);
                        return excelRows;
                    }, {});
                    //this.dataString = JSON.stringify(jsonData);
                    this.dataString = jsonData;
                }
                reader.readAsBinaryString(file);
            }
            else{
                alert("Please import file .xlsx");
            }
        }
    };

    Import(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post<Queue[]>(`${environment.API_URL}/importFileQueue`, this.dataString)
                .subscribe((response: any) => {
                    if (response.result) {
                        // Show the success message
                        this._matSnackBar.open('Import success', 'OK', {
                            verticalPosition: 'top',
                            horizontalPosition: 'right',
                            duration: 2000
                        });
                        this._manageQueuesServiceService.resolve();
                        this.loadQueues();
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

    fileName= 'QueuesSheet.xlsx';
    ExportFile() 
    {
       /* table id is passed over here */   
       //let element = document.getElementById('excel-table'); 
       //const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(this.table.nativeElement);
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
     * @param {ManageQueuesService} _manageQueuesServiceService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
        private _manageQueuesServiceService: ManageQueuesService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    )
    {
        super();

        this.filteredData = this._manageQueuesServiceService.queues;
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        const displayDataChanges = [
            this._manageQueuesServiceService.onQueuesChanged,
            this._matPaginator.page,
            this._filterChange,
            this._matSort.sortChange
        ];

        return merge(...displayDataChanges)
            .pipe(
                map(() => {
                        let data = this._manageQueuesServiceService.queues.slice();

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