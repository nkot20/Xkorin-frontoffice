import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {ExamService} from "../../../../core/exam/exam.service";
import {Observable} from "rxjs";
import {Exam} from "../../../../core/exam/exam.types";

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss'],
    standalone: true,
    imports: [RouterOutlet]
})
export class ExamComponent {


    constructor() {
    }


}
