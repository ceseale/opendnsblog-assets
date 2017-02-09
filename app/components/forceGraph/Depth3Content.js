import React from 'react';
class Depth1Content extends React.Component {

    render() {
        return (
            <div style={{ color: 'white' }}>
              <p style={{ color: 'white' }}>Another interesting way to further explore a graph is by looking at k-means clusters it has. If you're not familiar, k-means is a popular cluster analysis algorithm that aims to partition data into k clusters. K-means acts as a way to partition large graphs into manageable partitions for further analysis. To run K-means on the graph, click the "Explore By" section above and select your k. By experimenting with clusters you're able to find interesting groups that you might not have noticed at first glance. It becomes especially useful in large graphs with many interconnected nodes and edges. Changing the "Explore By" option to "Search" allows you to search all the nodes by name. This is a great way to search for a TLD you might be interested in, for example all the .top nodes. The below images compares the cluster results to a filter for hashes and a search for .ru nodes.</p>
              <div className="rowchart">
                  <div className="columnchart">
                <img style={{ width: 270, height: 270 }} src="https://cdn.rawgit.com/ceseale/opendnsblog-assets/8381886007d9dd45b27feb17c9b02abb7b7ead18/app/components/forceGraph/images/depth3km.png"></img>
                    <blockquote>Graph at depth 3 for freepps[.]top clustered using k-means with k=3</blockquote>
                  </div>
                  
                  <div className="columnchart">
                <img style={{ width: 270, height: 270 }} src="https://cdn.rawgit.com/ceseale/opendnsblog-assets/8381886007d9dd45b27feb17c9b02abb7b7ead18/app/components/forceGraph/images/depth3ru.png"></img>
                    <blockquote>All the nodes at depth 3 that contain .ru</blockquote>
                  </div>
              </div>


              <div className="rowchart">
                  <div className="columnchart">
                <img style={{ width: 270, height: 270 }} src="https://cdn.rawgit.com/ceseale/opendnsblog-assets/8381886007d9dd45b27feb17c9b02abb7b7ead18/app/components/forceGraph/images/depth3hash.png"></img>
                    <blockquote>All the nodes at depth 3 that are hashes</blockquote>
                  </div>
              </div>

            </div>
        );
    }
}

export default Depth1Content;
