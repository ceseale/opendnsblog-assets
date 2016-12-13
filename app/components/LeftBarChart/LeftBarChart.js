/* global d3 */
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import style from './LeftBarChart.scss';


class LeftBarChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        let node = ReactDOM.findDOMNode(this);
        let svg = d3.select(node).select('svg');

        svg = svg.append('g')
            .attr('transform', 'translate(210,15)');

        let dy = this.props.height / this.props.data.length;
        let scale = d3.scale.linear()
                .domain([0, Math.max.apply(null, this.props.data.map(d => { return Math.log(d.value); }))])
                .range([1, this.props.width]);

        let gs = svg.selectAll('g')
                .data(this.props.data.sort((a, b) => {
                    if (a.value < b.value) {
                        return 1;
                    } else if (a.value > b.value) {
                        return -1;
                    } else {
                        return 0;
                    }
                }))
                .enter()
                .append('g')
                .attr('class', 'databars');

        gs.append('rect')
                .attr('x', () => { return 0; })
                .attr('y', (d, i) => { return dy * i; })
                .attr('width', (d) => { return scale(Math.log(d.value)); })
                .attr('height', dy - 1.7)
                .attr('fill', '#049FD9')
                .on('click', (d, i) => {
                    if (this.props.onClick) {
                        if (i === this.lastClick) {
                            this.props.onClick(null, d);
                            this.lastClick = null;
                            svg.selectAll('rect').style('fill', '049FD9');
                        } else {
                            this.props.onClick(i, d);
                            this.lastClick = i;
                            svg.selectAll('rect').style('fill', (da, ind) => {
                                if (i === ind) {
                                    return '97E3FF';
                                } else {
                                    return '049FD9';
                                }
                            });
                        }
                    }
                });

        gs.append('text')
                .attr('x', () => { return 0; })
                .attr('y', (d, i) => { return dy * i; })
                .attr('dx', () => { return -10; })
                .attr('dy', () => { return 17; })
                .attr('text-anchor', 'end')
                .text((d) => {
                    return d.name;
                });
                
    }

    componentWillUpdate() {
        let node = ReactDOM.findDOMNode(this);

        d3.select(node).select('g').remove();
    }

    componentDidUpdate() {
        this.componentDidMount();
    }

    render() {
        return (
            <div className={style.barchart}>
                <svg width={this.props.width + 200} height={this.props.height + 10}>
                </svg>                    
            </div>
        );
    }
}


// define propTypes
LeftBarChart.propTypes = {
    data: PropTypes.array,
    width: PropTypes.number,
    height: PropTypes.number,
    transX: PropTypes.number,
    style: PropTypes.object,
    onClick: PropTypes.func
};

export default LeftBarChart;
