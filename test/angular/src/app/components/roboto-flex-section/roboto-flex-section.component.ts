import { Component, OnInit } from '@angular/core';
import g from "../../gfont";

@Component({
  selector: 'app-roboto-flex-section',
  templateUrl: './roboto-flex-section.component.html',
  styleUrls: ['./roboto-flex-section.component.css']
})
export class RobotoFlexSectionComponent implements OnInit {
  g = g;

  styleP = () => g.font("Roboto Flex", "sans-serif", "400", "opsz:22.2").obj;

  constructor() { }

  ngOnInit(): void {
  }

}
