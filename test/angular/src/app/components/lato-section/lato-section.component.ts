import { Component, OnInit } from '@angular/core';
import g from "../../gfont";

@Component({
  selector: 'app-lato-section',
  templateUrl: './lato-section.component.html',
  styleUrls: ['./lato-section.component.css']
})
export class LatoSectionComponent implements OnInit {
  g = g;

  styleP = () => g.font("Lato", "sans-serif", "400", "italic").obj;

  constructor() { }

  ngOnInit(): void {
  }

}
