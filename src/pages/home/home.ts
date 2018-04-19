import { Component, NgZone, ViewChild } from '@angular/core';
import { NavController, Content } from 'ionic-angular';
import { TextToSpeech } from '@ionic-native/text-to-speech';
declare var window;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  messages: any[] = [];
  text : string = "";
  @ViewChild(Content) content: Content;


  constructor(public navCtrl: NavController, private ngZone : NgZone, private tts : TextToSpeech) {
    this.messages.push({
      text: 'Hi, how can I help you?',
      sender: 'api'
    });

        
  }

  sendVoice = () => {
    window["ApiAIPlugin"].requestVoice({      

    }, (res) => {
      this.tts.speak({
        text:res.result.fulfillment.speech,
        locale: 'en-CA',
        rate: 1
      });
      this.content.scrollToBottom(200);

      this.ngZone.run(() => {
        this.messages.push({
          text: res.result.fulfillment.speech,
          sender: 'api'
        });
        this.content.scrollToBottom(200);
      });

    }, (err) => {
      alert(err);
    })
  }

  sendText = () => {
    const message  = this.text;
    this.messages.push({
      text: message,
      sender: 'user'
    });

    this.text = '';
    this.content.scrollToBottom(200);

    window["ApiAIPlugin"].requestText({
      query: message
    }, (res) => {
      //as the apiai is outside scope so ngzone allows to run it 
      // into the current scope
      this.ngZone.run(() => {
        this.messages.push({
          text: res.result.fulfillment.speech,
          sender: 'api'
        });
        this.content.scrollToBottom(200);
      });      
    }, (err) => {
      alert(JSON.stringify(err));
    });
  }

}
