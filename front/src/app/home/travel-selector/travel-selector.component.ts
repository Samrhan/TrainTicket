import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {TrainsService} from "../../services/trains.service";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {Station} from "../../interfaces/station";
import {RequireMatch} from "../../validators/require-match";
import {DepartureHour} from "../../interfaces/departure-hour";
import {Journey} from "../../interfaces/journey";
import {faArrowsAltH} from "@fortawesome/free-solid-svg-icons";


@Component({
  selector: 'app-travel-selector',
  templateUrl: './travel-selector.component.html',
  styleUrls: ['./travel-selector.component.scss']
})
export class TravelSelectorComponent implements OnInit {

  departureStations!: Array<Station>
  arrivalStations!: Array<Station>

  progressBarValue = 0;
  hoursList!: Array<DepartureHour>;

  minDate!: Date;

  journeys!: Array<Journey>
  faArrowsAltH = faArrowsAltH

  @ViewChild('progressBar') progressBar!: HTMLElement;


  form = this.formBuilder.group({
    departure: new FormControl([null], [Validators.required, RequireMatch]),
    arrival: new FormControl([null], [Validators.required, RequireMatch]),
    date: new FormControl(null, [Validators.required]),
    time: new FormControl(null, [Validators.required, RequireMatch]),
  });

  constructor(private formBuilder: FormBuilder, private trainService: TrainsService) {
    this.hoursList = []
    for (let i = 6; i < 21; i++)
      this.hoursList.push({name: `${i}H`, value: i})
    this.minDate = new Date()
    this.form.get('departure')!.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(1000),
      switchMap(name => this.trainService.getStation(name))
    ).subscribe((values) => this.departureStations = values);
    this.form.get('arrival')!.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(1000),
      switchMap(name => this.trainService.getStation(name))
    ).subscribe((values) => this.arrivalStations = values);
  }


  ngOnInit(): void {
    this.journeys = new Array<Journey>()
    this.journeys.push({
        "departure": new Date("2021-10-28T12:41:00.000Z"),
        "arrival": new Date("2021-10-28T14:35:00.000Z"),
        "sections": [
          {
            "type": "train",
            "from": "Strasbourg",
            "to": "Paris Est",
            "mode": "TGV INOUI",
            "departure": new Date("2021-10-28T12:41:00.000Z"),
            "arrival": new Date("2021-10-28T14:35:00.000Z"),
            "duration": "1h:54m"
          }
        ]
      }
    )
  }

  async searchTravel(): Promise<void> {
    // @ts-ignore
    this.progressBar.mode = 'indeterminate'
    console.log(this.form.value)
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
