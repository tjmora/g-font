import { Component, OnInit } from '@angular/core';
import g from "../../gfont";

@Component({
  selector: 'app-roboto-section',
  templateUrl: './roboto-section.component.html',
  styleUrls: ['./roboto-section.component.css']
})
export class RobotoSectionComponent implements OnInit {
  g = g;

  styleP = () => g.font('Roboto', 'sans-serif').obj;

  constructor() { }

  ngOnInit(): void {
  }

}
