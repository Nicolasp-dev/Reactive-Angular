import { Component, OnInit } from "@angular/core";
import { LoadingService } from "./loading/loading.service";
import { MessagesServices } from "./messages/messages.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [LoadingService, MessagesServices],
})
export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  logout() {}
}
