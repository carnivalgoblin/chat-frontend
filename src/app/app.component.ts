import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChatMessage} from "./entity/chat-message";
import {RxStompService} from "./websocket/rx-stomp.service";
import {Subscription} from "rxjs";
import {Message} from "@stomp/stompjs";
import {MessageType} from "./enumeration/message-type";

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

  sendMessage() {
    let msg: ChatMessage = {
      user: this.user,
      content: this.message,
      type: MessageType.MESSAGE,
      date: new Date()
    }

    this.rxStompService.publish({ destination: '/app/chat.sendMessage', body: JSON.stringify(msg) });
    this.message = "";
  }

  start() {
    this.isUsernameSet = true
  }

  formatDate(date: Date): string {
    let formattedDate = new Date(date)

    const hour   = ("0" + formattedDate.getHours()).slice(-2);
    const minute = ("0" + formattedDate.getMinutes()).slice(-2);
    return hour + ":" + minute;
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
}
