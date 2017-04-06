//our root app component
import {NgModule, Component, Directive, Output, EventEmitter} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser'
import {FormBuilder, ReactiveFormsModule, FormsModule, NgControl} from '@angular/forms';

@Directive({
  selector: '[formControlName][phone]',
  host: {
    '(ngModelChange)': 'onInputChange($event)',
    '(keydown.backspace)':'onInputChange($event.target.value, true)'
  }
})
export class PhoneMask {
  constructor(public model: NgControl) {}
  
  @Output() rawChange:EventEmitter<string> = new EventEmitter<string>();

  onInputChange(event, backspace) {
    // remove all mask characters (keep only numeric)
    var newVal = event.replace(/\D/g, '');
    var rawValue = newVal;
    // special handling of backspace necessary otherwise
    // deleting of non-numeric characters is not recognized
    // this laves room for improvment for example if you delete in the 
    // middle of the string
    if(backspace) {
      newVal = newVal.substring(0, newVal.length - 1);
    } 

    // don't show braces for empty value
    if(newVal.length == 0) {
      newVal = '';
    } 
    // don't show braces for empty groups at the end
    else if(newVal.length <= 3) {
      newVal = newVal.replace(/^(\d{0,3})/, '($1)');
    } else if(newVal.length <= 6) {
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '($1) ($2)');
    } else {
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(.*)/, '($1) ($2)-$3');
    }
    // set the new value
    this.model.valueAccessor.writeValue(newVal);      
    this.rawChange.emit(rawValue)
  }
}

@Component({
  selector: 'my-app',
  providers: [],
  template: `
  <form [formGroup]="form">
    <input type="text" phone formControlName="phone" (rawChange)="rawPhone=$event" > 
  </form>
  <div>raw: {{rawPhone}}</div>
  `,
  directives: [PhoneMask]
})
export class App {
  constructor(fb:FormBuilder) {
    this.form=fb.group({
      phone:['']
    })
  }
}

@NgModule({
  imports: [ BrowserModule, FormsModule, ReactiveFormsModule ],
  declarations: [ App, PhoneMask ],
  bootstrap: [ App ]
})
export class AppModule {}
