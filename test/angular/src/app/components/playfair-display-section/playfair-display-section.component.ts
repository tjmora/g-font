import { Component, OnInit } from '@angular/core';
import g from "../../gfont";

@Component({
  selector: 'app-playfair-display-section',
  templateUrl: './playfair-display-section.component.html',
  styleUrls: ['./playfair-display-section.component.css']
})
export class PlayfairDisplaySectionComponent implements OnInit {
  g = g;

  styleP = () => g.font("Playfair Display", "serif", "400", "italic").obj;

  constructor() { }

  ngOnInit(): void {
  }

}
