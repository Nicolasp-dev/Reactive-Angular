import { MessagesServices } from "./../messages/messages.service";
import { LoadingService } from "./../loading/loading.service";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { catchError, map, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class CoursesStore {
  private _courseSubject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this._courseSubject.asObservable();

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map((courses: Course[]) =>
        courses
          .filter((course: Course) => course.category === category)
          .sort(sortCoursesBySeqNo)
      )
    );
  }

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private messagesService: MessagesServices
  ) {
    //Only occurs once the service is build
    this.loadAllCourses();
  }

  private loadAllCourses() {
    const loadCourses$ = this.http.get<Course[]>("/api/courses").pipe(
      map((response) => response["payload"]),
      catchError((err) => {
        const message = "Could not load courses";
        this.messagesService.showErrors(message);
        console.log(message, err);
        return throwError(err);
      }),
      tap((courses) => this._courseSubject.next(courses))
    );

    this.loadingService.showLoaderUntilCompleted(loadCourses$).subscribe();
  }
}
