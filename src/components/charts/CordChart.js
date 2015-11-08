let d3 = require('d3');
let queue = require('./Queue');
let Colors = require('./../../constants/Colors');

require('./cordChart.less');


export default class CordChart {
    constructor(element) {
        this.element = element;
    }

    render(model) {
        var matrix = [
            [11975, 5871, 8916, 2868],
            [1951, 10048, 2060, 6171],
            [8010, 16145, 8090, 8045],
            [1013, 990, 940, 6907]
        ];

        var chord = d3.layout.chord()
            .padding(.05)
            .sortSubgroups(d3.descending)
            .matrix(matrix);

        var width = 960,
            height = 500,
            innerRadius = Math.min(width, height) * .41,
            outerRadius = innerRadius * 1.1;

        var svg = d3.select(this.element).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        let group = svg.append("g").selectAll("path")
            .data(chord.groups)
            .enter().append("g")
            .attr("class", "group")
            .on("mouseover", fade(.1))
            .on("mouseout", fade(1));

        group.append("path")
            .style("fill", function (d) {
                return Colors.getColor(d.index);
            })
            .style("stroke", function (d) {
                return Colors.getColor(d.index);
            })
            .attr("id", function(d) { return "group" + d.index; })
            .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius));

        group.append("title").text(function(d, i) {
            return'DUPA';
        });

        group.append("svg:text")
            .attr("x", 6)
            .attr("dy", 15)
            //.filter(function(d) { return d.value > 110; })
            .append("svg:textPath")
            .attr("xlink:href", function(d) { return "#group" + d.index; })
            .text(function(d) { return 'asasasas'; });

        //
        //
        //var ticks = svg.append("g").selectAll("g")
        //    .data(chord.groups)
        //    .enter().append("g").selectAll("g")
        //    .data(groupTicks)
        //    .enter().append("g")
        //    .attr("transform", function (d) {
        //        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
        //            + "translate(" + outerRadius + ",0)";
        //    });
        //
        //ticks.append("line")
        //    .attr("x1", 1)
        //    .attr("y1", 0)
        //    .attr("x2", 5)
        //    .attr("y2", 0)
        //    .style("stroke", "#000");
        //
        //ticks.append("text")
        //    .attr("x", 8)
        //    .attr("dy", ".35em")
        //    .attr("transform", function (d) {
        //        return d.angle > Math.PI ? "rotate(180)translate(-16)" : null;
        //    })
        //    .style("text-anchor", function (d) {
        //        return d.angle > Math.PI ? "end" : null;
        //    })
        //    .text(function (d) {
        //        return d.label;
        //    });

        svg.append("g")
            .attr("class", "chord")
            .selectAll("path")
            .data(chord.chords)
            .enter().append("path")
            .attr("d", d3.svg.chord().radius(innerRadius))
            .style("fill", function (d) {
                return Colors.getColor(d.target.index);
            })
            .style("opacity", 1);

// Returns an array of tick angles and labels, given a group.
        function groupTicks(d) {
            var k = (d.endAngle - d.startAngle) / d.value;
            return d3.range(0, d.value, 1000).map(function (v, i) {
                return {
                    angle: v * k + d.startAngle,
                    label: i % 5 ? null : v / 1000 + "k"
                };
            });
        }

// Returns an event handler for fading a given chord group.
        function fade(opacity) {
            return function (g, i) {
                svg.selectAll(".chord path")
                    .filter(function (d) {
                        return d.source.index != i && d.target.index != i;
                    })
                    .transition()
                    .style("opacity", opacity);
            };
        }

    }
}