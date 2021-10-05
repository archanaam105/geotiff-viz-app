import { Component, OnInit } from '@angular/core';
import { MapService } from 'src/app/map/map.service';
import { EditVizService } from './edit-viz.service';
declare var d3: any;

@Component({
  selector: 'app-edit-viz',
  templateUrl: './edit-viz.component.html',
  styleUrls: ['./edit-viz.component.css']
})
export class EditVizComponent implements OnInit {

  colorScale: any;

  constructor(private mapService: MapService, private editVizService: EditVizService) { }

  ngOnInit(): void {
    this.mapService.colorScale.subscribe(scale => {
      this.colorScale = scale;
      // console.log(scale);
      let svg = d3.select('svg');
      svg.append("g")
        .attr("class", "legendLinear")
        .attr("transform", "translate(20,20)");
      var legendLinear = d3.legendColor()
        .shapeWidth(50)
        .orient('horizontal')
        .scale(this.colorScale)
        .title('Elevation (m)');
      svg.select(".legendLinear")
        .call(legendLinear);

    })

  }

  changeOpacity(event:any){
    this.editVizService.opacity.next(event.target.value);
  }

  changeColor(event:any){
      if(event.target.checked){
        this.editVizService.scaleColor.next(event.target.value);
      }else{
        this.editVizService.scaleColor.next("");
      }
  }

}
