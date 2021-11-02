import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {TrainsService} from "../../services/trains.service";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {Station} from "../../interfaces/station";
import {RequireObject} from "../../validators/require-object";
import {DepartureHour} from "../../interfaces/departure-hour";
import {Journey} from "../../interfaces/journey";
import {faArrowsAltH} from "@fortawesome/free-solid-svg-icons";
import {Observable} from "rxjs";


@Component({
  selector: 'app-travel-selector',
  templateUrl: './travel-selector.component.html',
  styleUrls: ['./travel-selector.component.scss']
})
export class TravelSelectorComponent implements OnInit {

  departureStations!: Observable<Array<Station>>
  arrivalStations!: Observable<Array<Station>>

  progressBarValue = 0;
  hoursList!: Array<DepartureHour>;

  minDate!: Date;

  journeys!: Array<Journey>
  faArrowsAltH = faArrowsAltH

  @ViewChild('progressBar') progressBar!: HTMLElement;


  form = this.formBuilder.group({
    departure: new FormControl([null], [Validators.required, RequireObject]),
    arrival: new FormControl([null], [Validators.required, RequireObject]),
    date: new FormControl(null, [Validators.required]),
    time: new FormControl(null, [Validators.required, RequireObject]),
  });

  constructor(private formBuilder: FormBuilder, private trainService: TrainsService) {
    this.hoursList = []
    for (let i = 6; i < 21; i++)
      this.hoursList.push({name: `${i}H`, value: i})
    this.minDate = new Date()
    this.departureStations = this.form.get('departure')!.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(1000),
      switchMap(name => this.trainService.getStation(name))
    )
    this.arrivalStations = this.form.get('arrival')!.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(1000),
      switchMap(name => this.trainService.getStation(name))
    )
  }


  ngOnInit(): void {
    this.journeys = new Array<Journey>()

  }

  async searchTravel(): Promise<void> {
    // @ts-ignore
    this.progressBar.mode = 'indeterminate'
    const departureId = this.form.value.departure.id
    const arrivalId = this.form.value.arrival.id
    if (departureId && arrivalId)
      this.trainService.getTravel(departureId, arrivalId, this.form.value.date, this.form.value.time.value).subscribe(data => {
        this.journeys = data
        // @ts-ignore
        this.progressBar.mode = 'determinate';
        this.progressBarValue = 100;
      })
  }

  displayWith(value: any): string {
    if (value)
      return value.name;
    else return ''
  }

  invert(): void {
    let departure = this.form.value.departure
    this.form.get("departure")?.setValue(this.form.value.arrival)
    this.form.get("arrival")?.setValue(departure)
  }

}
