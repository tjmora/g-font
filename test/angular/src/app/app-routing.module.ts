import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LatoSectionComponent } from './components/lato-section/lato-section.component';
import { LoraSectionComponent } from './components/lora-section/lora-section.component';
import { PlayfairDisplaySectionComponent } from './components/playfair-display-section/playfair-display-section.component';
import { RalewaySectionComponent } from './components/raleway-section/raleway-section.component';
import { RobotoFlexSectionComponent } from './components/roboto-flex-section/roboto-flex-section.component';
import { RobotoSectionComponent } from './components/roboto-section/roboto-section.component';

const routes: Routes = [
  {path: '', component: RobotoSectionComponent},
  {path: 'lato', component: LatoSectionComponent},
  {path: 'raleway', component: RalewaySectionComponent},
  {path: 'playfair-display', component: PlayfairDisplaySectionComponent},
  {path: 'lora', component: LoraSectionComponent},
  {path: 'roboto-flex', component: RobotoFlexSectionComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
