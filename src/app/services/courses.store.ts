import { MessagesServices } from "./../messages/messages.service";
import { LoadingService } from "./../loading/loading.service";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class CoursesStore {
  private _courseSubject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this._courseSubject.asObservable();

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private messagesService: MessagesServices
  ) {
    //Only occurs once the service is build
    this.loadAllCourses();
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map((courses: Course[]) =>
        courses
          .filter((course: Course) => course.category === category)
          .sort(sortCoursesBySeqNo)
      )
    );
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    // Memory Changes
    const courses = this._courseSubject.getValue();
    const index = courses.findIndex((course) => course.id === courseId);
    const newCourse: Course = { ...courses[index], ...changes };
    const newCourses: Course[] = courses.slice(0);

    newCourses[index] = newCourse;
    this._courseSubject.next(newCourses);

    // Backend Changes
    return this.http.put(`/api/courses/${courseId}`, changes).pipe(
      catchError((err) => {
        const message = "Could not save course";
        this.messagesService.showErrors(message);
        console.log(message, err);
        return throwError(err);
      }),
      shareReplay()
    );
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
