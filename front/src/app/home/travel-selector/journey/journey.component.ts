import {Component, Input, OnInit} from '@angular/core';
import {Journey} from "../../../interfaces/journey";

@Component({
  selector: 'app-journey',
  templateUrl: './journey.component.html',
  styleUrls: ['./journey.component.scss']
})
export class JourneyComponent implements OnInit {

  @Input('journey') journey!: Journey;

  departureStation!: string;
  arrivalStation!: string;

  expand = false;


  constructor() {

  }

  ngOnInit(): void {
    this.departureStation = this.journey.sections[0].from
    this.arrivalStation = this.journey.sections[this.journey.sections.length - 1].to
  }

}
