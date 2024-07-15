import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatSort, MatSortModule, Sort} from "@angular/material/sort";
import {Pagination} from "../../../../core/pagination/Pagination";
import {map, merge, Observable, Subject, switchMap, takeUntil} from "rxjs";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {CompanyService} from "../../../../core/company/company.service";
import {ReactiveFormsModule, UntypedFormControl} from "@angular/forms";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink, RouterOutlet} from "@angular/router";
import {MatTableModule} from "@angular/material/table";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";

@Component({
    selector: 'app-companies',
    templateUrl: './companies.component.html',
    styleUrls: ['./companies.component.scss'],
    imports: [
        RouterOutlet
    ],
    standalone: true
})
export class CompaniesComponent {

}
