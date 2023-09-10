import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { filter } from "rxjs/operators";

@Injectable()
export class MessagesServices {
  private _errorsSubject = new BehaviorSubject<string[]>([]);
  errors$: Observable<string[]> = this._errorsSubject
    .asObservable()
    .pipe(filter((messages) => messages && messages.length > 0));

  constructor() {}

  showErrors(...errors: string[]) {
    this._errorsSubject.next(errors);
  }
}
