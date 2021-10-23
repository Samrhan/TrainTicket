import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {GlobalHeaderComponent} from './home/global-header/global-header.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TravelSelectorComponent} from './home/travel-selector/travel-selector.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatInputModule} from "@angular/material/input";
import {HttpClientModule} from "@angular/common/http";
import {HomeComponent} from './home/home.component';
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatMomentDateModule} from "@angular/material-moment-adapter";
import {MAT_DATE_LOCALE} from "@angular/material/core";
import {JourneyComponent} from './home/travel-selector/journey/journey.component';
import {MomentModule} from "ngx-moment";
import {MatListModule} from "@angular/material/list";
import {MatExpansionModule} from "@angular/material/expansion";
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {BookComponent} from './home/book/book.component';
import {MatStepperModule} from "@angular/material/stepper";

@NgModule({
  declarations: [
    AppComponent,
    GlobalHeaderComponent,
    TravelSelectorComponent,
    HomeComponent,
    JourneyComponent,
    BookComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    HttpClientModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatProgressBarModule,
    MatMomentDateModule,
    MatDatepickerModule,
    MomentModule,
    MatListModule,
    MatExpansionModule,
    FontAwesomeModule,
    MatStepperModule,
  ],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'fr-FR'}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
