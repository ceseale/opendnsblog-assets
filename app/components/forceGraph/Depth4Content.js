import React from 'react';
class Depth1Content extends React.Component {

    render() {
        return (
            <div style={{ color: 'white' }}>
            <strong>Depth 4</strong>
<p>The last depth we'll investigate is depth 4. The graph at this point is huge. This is great because we can start to see more interesting trends and use our toolset to learn more about them. Larger graphs allow you to view massive trends as domains at this length can easily have over 6000 nodes! Below are some interesting trends that continued from depth 3. They show that K means did a good job at separating meaningful groups of domains in large graphs where clusters are less obvious.
In this case, it clusters the .ru domains and hashes well enough for an analyst to take interest in the domains in the area. Have fun exploring!</p>

            </div>
        );
    }
}

export default Depth1Content;
