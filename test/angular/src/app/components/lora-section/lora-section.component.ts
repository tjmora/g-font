import { Component, OnInit } from '@angular/core';
import g from "../../gfont";

@Component({
  selector: 'app-lora-section',
  templateUrl: './lora-section.component.html',
  styleUrls: ['./lora-section.component.css']
})
export class LoraSectionComponent implements OnInit {
  g = g;

  styleP = () => g.font('Lora', 'serif', '400', 'italic').obj;

  constructor() { }

  ngOnInit(): void {
  }

}
