import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChatMessage} from "./entity/chat-message";
import {formatDate} from "@angular/common";
import {RxStompService} from "./websocket/rx-stomp.service";
import {Subscription} from "rxjs";
import {Message} from "@stomp/stompjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'chat-frontend';

  user: string = "";
  isUsernameSet: boolean = false;
  receivedMessages: ChatMessage[] = [];
  message: string = "";
  private topicSubscription!: Subscription;

  constructor(private rxStompService: RxStompService) {
  }

  ngOnInit() {
    this.topicSubscription = this.rxStompService
      .watch('/topic/chat')
      .subscribe((message: Message) => {
        this.receivedMessages.push(JSON.parse(message.body));
      });
  }

  ngOnDestroy() {
    this.topicSubscription.unsubscribe();
  }

  protected readonly formatDate = formatDate;
}
