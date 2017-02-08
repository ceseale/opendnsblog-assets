import React from 'react';
class Depth1Content extends React.Component {

    render() {
        return (
            <div style={{ color: 'white' }}>
              <strong>Depth 3</strong>
              <p>Another interesting way to further explore graph is by looking at the clusters it has. Our graph at depth 3 has some obvious clusters and its shown in the examples below that the clusters have different properties. Another feature of this graph viewing app is K means. You can create as many clusters as you like. The example below show k means with k equal to 3. By experimenting with clusters you're able to find interesting groups that you might not have noticed at first glance. It becomes especially useful in large graphs with many nodes and edges. K-means acts as a way to partition the graph into manageable partitions for further analysis.</p>

            </div>
        );
    }
}

export default Depth1Content;
