import React from 'react';
class Depth1Content extends React.Component {

    render() {
        return (
            <div style={{ color: 'white' }}>
            <p style={{ color: 'white' }}>The last depth we'll investigate is depth 4. The graph at this point is huge. (You'll have to zoom out to see the whole network). This is great because we can start to see more interesting trends and use our toolset to learn more about them. Larger graphs allow you to view massive trends as domains at this depth can easily have over 6000 nodes. Below are some interesting trends that continue from depth 3. They show that K means did a good job at separating meaningful groups of domains in large graphs where clusters are less obvious.
            In this case, it clusters the .ru domains and hashes well enough for an analyst to take interest in the domains in the area.</p>

            <div className="rowchart">
                <div className="columnchart">
              <img style={{ width: 270, height: 270 }} src="//rawgit.com/ceseale/opendnsblog-assets/newblog/app/components/forceGraph/images/depth5km.png"></img>
                  <blockquote>Graph at depth 4 for freepps[.]top clustered using k-means with k=7</blockquote>
                </div>

                <div className="columnchart">
              <img style={{ width: 270, height: 270 }} src="//rawgit.com/ceseale/opendnsblog-assets/newblog/app/components/forceGraph/images/depth4ru.png"></img>
                  <blockquote>All the nodes at depth 4 that contain .ru</blockquote>
                </div>
            </div>

            <div className="rowchart">
              <div className="columnchart">
              <img style={{ width: 270, height: 270 }} src="//rawgit.com/ceseale/opendnsblog-assets/newblog/app/components/forceGraph/images/depth4hash.png"></img>
                <blockquote>All the nodes at depth 4 that are hashes</blockquote>
              </div>
            </div>

            </div>
        );
    }
}

export default Depth1Content;
