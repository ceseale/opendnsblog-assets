import React from 'react';
class Depth1Content extends React.Component {

    render() {
        return (
            <div style={{ color: 'white' }}>
              <strong>Depth 1</strong>

              <p>Edges and nodes are created using the properties of our starting domain or depth 0. The depth of a graph describes its size in relation to the starting node. Graphs, even at small depths, act as an intuitive way to visualize these properties. In this case, freepps[.]top has 14 direct neighbors, made up of domains, IPs, and emails. What's interesting here is one of our domain's neighbors is a subdomain, mail.freepps[.]top. Malicious domains create subdomains that help them spread and is a technique used by this domain as you'll notice more as we increase the depth.</p>
            </div>
        );
    }
}

export default Depth1Content;
