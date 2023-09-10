import { MessagesServices } from "./../messages/messages.service";
import { AfterViewInit, Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import * as moment from "moment";
import { Course } from "../model/course";
import { CoursesService } from "./../services/courses.service";
import { LoadingService } from "../loading/loading.service";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Component({
  selector: "course-dialog",
  templateUrl: "./course-dialog.component.html",
  styleUrls: ["./course-dialog.component.css"],
  providers: [LoadingService, MessagesServices],
})
export class CourseDialogComponent implements AfterViewInit {
  form: FormGroup;
  course: Course;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    private coursesService: CoursesService,
    private loadingService: LoadingService,
    private messagesServices: MessagesServices,
    // External data injection into Dialog -> "Course data"
    @Inject(MAT_DIALOG_DATA) course: Course
  ) {
    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required],
    });
  }

  ngAfterViewInit() {}

  save() {
    const changes = this.form.value;
    const saveCourse$ = this.coursesService
      .saveCourse(this.course.id, changes)
      .pipe(
        catchError((err) => {
          const message = "Could not save course";
          this.messagesServices.showErrors(message);
          console.log(message, err);
          return throwError(err);
        })
      );

    this.loadingService
      .showLoaderUntilCompleted(saveCourse$)
      .subscribe((response) => {
        this.dialogRef.close(response);
      });
  }

  close() {
    this.dialogRef.close();
  }
}
