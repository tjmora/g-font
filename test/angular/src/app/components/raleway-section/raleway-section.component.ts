import { Component, OnInit } from '@angular/core';
import g from "../../gfont";

@Component({
  selector: 'app-raleway-section',
  templateUrl: './raleway-section.component.html',
  styleUrls: ['./raleway-section.component.css']
})
export class RalewaySectionComponent implements OnInit {
  g = g;

  styleP = () => g.font("Raleway", "sans-serif", "regular").obj;

  constructor() { }

  ngOnInit(): void {
  }

}
