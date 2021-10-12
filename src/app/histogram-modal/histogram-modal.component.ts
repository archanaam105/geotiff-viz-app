import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as d3 from 'd3';

@Component({
  selector: 'app-histogram-modal',
  templateUrl: './histogram-modal.component.html',
  styleUrls: ['./histogram-modal.component.css']
})
export class HistogramModalComponent implements OnInit {


  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.plotHistogram(this.data);
  }


  plotHistogram(result: any) {
    var margin = { top: 30, right: 50, bottom: 50, left: 40 },
      width = 500 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom,
      barWidth = 30;
    let svg = d3.select('svg#histogramModal').append("g").attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");
    let xValues = result.map((r: any) => r.elevation);
    let xScale = d3.scaleBand().domain(xValues).range([0, width]).padding(0.05);
    let yScale = d3.scaleLinear().domain([d3.min(result, ({ frequency }) => (frequency)) as number, d3.max(result, ({ frequency }) => (frequency)) as number]).range([height, 0]);
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)");

    svg.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(yScale))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -1-margin.left)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency")
      .style("fill","black");

    svg.selectAll("bar")
      .data(result)
      .enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", (r: any) => {
        console.log(r.elevation)
        console.log(xScale(r.elevation))
        return xScale(r.elevation) as number + ((xScale.bandwidth() - barWidth)/2);
      })
      .attr("y", (r: any) => {
        console.log(r.frequency)
        console.log(yScale(r.frequency))
        return yScale(r.frequency)
      })
      .attr("width", barWidth)
      .attr("height", (r: any) => height - yScale(r.frequency));
      
  }

}
