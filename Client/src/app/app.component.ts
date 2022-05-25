import { Component, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private _hubConnection: HubConnection;
  nick = '';
  message = '';
  messages: string[] = [];

  public sendMessage(): void {
    this._hubConnection
      .invoke(Messages.NewMessage, { name: this.nick, content: this.message })
      .catch(err => console.error(err));
  }

  ngOnInit() {
    this.nick = window.prompt('Your name:', 'John');

    this._hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.API_URL}/chat`)
      .build();

    this._hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch(err => console.error('Error while establishing connection :('));

      this._hubConnection.on(Messages.MessageRecieved, (message: Message) => {
        const text = `${message.name}: ${message.content}`;
        this.messages.push(text);
      });

    }
}

interface Message {
  name: string,
  content: string
}

enum Messages {
  MessageRecieved = 'MessageRecieved',
  NewMessage = 'NewMessage'
}
