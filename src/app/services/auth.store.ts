import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { User } from "../model/user";
import { map, shareReplay, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class AuthStore {
  private userSubject = new BehaviorSubject<User>(null);
  user$: Observable<User> = this.userSubject.asObservable();

  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  constructor(private http: HttpClient) {
    this.isLoggedIn$ = this.user$.pipe(map((user) => !!user));
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map((loggedIn) => !loggedIn));
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>("/api/login", { email, password }).pipe(
      tap((user) => this.userSubject.next(user)),
      shareReplay()
    );
  }

  logout() {
    this.userSubject.next(null);
  }
}
