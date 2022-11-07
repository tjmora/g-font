import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RobotoSectionComponent } from './components/roboto-section/roboto-section.component';
import { LatoSectionComponent } from './components/lato-section/lato-section.component';
import { LoraSectionComponent } from './components/lora-section/lora-section.component';
import { RobotoFlexSectionComponent } from './components/roboto-flex-section/roboto-flex-section.component';
import { PlayfairDisplaySectionComponent } from './components/playfair-display-section/playfair-display-section.component';
import { RalewaySectionComponent } from './components/raleway-section/raleway-section.component';
import { SectionSwitcherComponent } from './components/section-switcher/section-switcher.component';

@NgModule({
  declarations: [
    AppComponent,
    RobotoSectionComponent,
    LatoSectionComponent,
    LoraSectionComponent,
    RobotoFlexSectionComponent,
    PlayfairDisplaySectionComponent,
    RalewaySectionComponent,
    SectionSwitcherComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
