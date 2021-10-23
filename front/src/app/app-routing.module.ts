import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BookComponent} from "./home/book/book.component";
import {TravelSelectorComponent} from "./home/travel-selector/travel-selector.component";

const routes: Routes = [
  {path: '', component: TravelSelectorComponent},
  {path: 'book', component: BookComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
