import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { AlertComponent } from "./shared/alert/alert.component";
import { AlertErrorComponent } from "./shared/alert/alert-error.component";
import { SortByDirective, SortDirective } from "./shared/sort";
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from "./shared/date";
import { AngularTreeTableModule } from "angular-tree-table";
// import { TreeTableModule } from 'primeng/treetable';

@NgModule({
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    FontAwesomeModule,
    TranslateModule,
    // AngularTreeTableModule
    // TreeTableModule
  ],
  declarations: [
    // AlertComponent,
    // AlertErrorComponent,
    // PaginationComponent,
    // SortDirective,
    // SortByDirective,
    // DurationPipe,
    // FormatMediumDatePipe,
    // FormatMediumDatetimePipe,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    FontAwesomeModule,
    TranslateModule,
    // AlertComponent,
    // AlertErrorComponent,
    // // PaginationComponent,
    // SortDirective,
    // SortByDirective,
    // DurationPipe,
    // FormatMediumDatePipe,
    // FormatMediumDatetimePipe
  ]
})

export class SharedModule { }
