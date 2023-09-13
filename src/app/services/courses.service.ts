import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { Course } from "../model/course";
import { Lesson } from "../model/lesson";

@Injectable({ providedIn: "root" })
export class CoursesService {
  constructor(private _http: HttpClient) {}

  loadAllCourses(): Observable<Course[]> {
    return this._http.get<Course[]>("/api/courses").pipe(
      map((response) => response["payload"]),
      shareReplay()
    );
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    return this._http
      .put(`/api/courses/${courseId}`, changes)
      .pipe(shareReplay());
  }

  searchLesson(search: string): Observable<Lesson[]> {
    return this._http
      .get<Lesson[]>("/api/lessons", {
        params: { filter: search, pageSize: "100" },
      })
      .pipe(
        map((res) => res["payload"]),
        shareReplay()
      );
  }
}
