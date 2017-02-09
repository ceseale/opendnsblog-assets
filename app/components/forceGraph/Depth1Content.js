import React from 'react';
class Depth1Content extends React.Component {

    render() {
        return (
            <div style={{ color: 'white' }}>
              <p style={{ color: 'white' }}>Let's start by exploring the graph at depth 1. The depth of a graph describes its size in relation to the starting node, in this case freepps[.]top. Graphs, even at small depths, act as an intuitive way to visualize relationships in our network. In this case, freepps[.]top has 14 direct neighbors, made up of domains, IPs, and emails. What's interesting here is one of our domain's neighbors is a subdomain, mail.freepps[.]top. Malicious domains create subdomains that help them spread and is a technique used by this domain as you'll notice more as we increase the depth. Below you can see some of the different filters highlighted. You can highlight nodes by clicking one of the filters above.</p>
              <div className="rowchart">
                <div className="columnchart">
                <img style={{ width: 270, height: 270 }} src="//rawgit.com/ceseale/opendnsblog-assets/newblog/app/components/forceGraph/images/blockeddomainsdepth1.png"></img>
                <blockquote>Blocked domains at depth 1 for freepps[.]top</blockquote>
                </div>

                <div className="columnchart">
                <img style={{ width: 270, height: 270 }} src="//rawgit.com/ceseale/opendnsblog-assets/newblog/app/components/forceGraph/images/ipsdomaindepth1.png"></img>
                <blockquote>Ips at depth 1 for freepps[.]top</blockquote>
                </div>
              </div>

              <div className="rowchart">
                <div className="columnchart">
                <img style={{ width: 270, height: 270 }} src="//rawgit.com/ceseale/opendnsblog-assets/newblog/app/components/forceGraph/images/emaild1.png"></img>
                <blockquote>Emails at depth 1 for freepps[.]top</blockquote>
                </div>
              </div>
            </div>
        );
    }
}

export default Depth1Content;
