import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-histogram-modal',
  templateUrl: './histogram-modal.component.html',
  styleUrls: ['./histogram-modal.component.css']
})
export class HistogramModalComponent implements OnInit {
  svg: any = d3.select("svg");
  margin = 200;


  constructor() { }

  ngOnInit(): void {

    d3.csv("../../assets/test/xyz.csv").then((data)=> {
      console.log(data)
    })
    this.loadHistogram();
  }


  loadHistogram() {
    const width = this.svg.attr("width") - this.margin;
    const height = this.svg.attr("height") - this.margin;
    const xScale = d3.scaleBand().range([0,width]).padding(0.4);
    const yScale = d3.scaleLinear().range ([height, 0]);
    const g = this.svg.append("g")
    .attr("transform", "translate(" + 100 + "," + 100 + ")")
    d3.csv("xyz.csv").then((data)=> {
      console.log(data)
    })


  }

}
