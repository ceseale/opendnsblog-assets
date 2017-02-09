import React from 'react';
class Depth1Content extends React.Component {

    render() {
        return (
            <div style={{ color: 'white' }}>
              <p style={{ color: 'white' }}>Now, our graph is getting more interesting and has exposed some associated samples from Cisco ThreatGrid. ThreatGrid provides behavioral indicators on files hosted by malicious domains. ThreatGrid detonates files in a sandboxed environment and associated a SHA256 hash with the file along with information about the files malicious behavior. At depth, some of the domain's neighbors are associated samples. We've also exposed another malicious subdomain, android.freepps[.]top. You can check them out below or filter them up above.</p>


<div className="rowchart">
  <div className="columnchart">
  <img style={{ width: 270, height: 270 }} src="https://cdn.rawgit.com/ceseale/opendnsblog-assets/8381886007d9dd45b27feb17c9b02abb7b7ead18/app/components/forceGraph/images/subdomainsdepth2.png"></img>
<blockquote>Subdomains at depth 2 for freepps[.]top</blockquote>
  </div>

  <div className="columnchart">
  <img style={{ width: 270, height: 270 }} src="https://cdn.rawgit.com/ceseale/opendnsblog-assets/8381886007d9dd45b27feb17c9b02abb7b7ead18/app/components/forceGraph/images/hashesdepth2.png"></img>
<blockquote>Hashs at depth 2 for freepps[.]top</blockquote>
  </div>
</div>


            </div>
        );
    }
}

export default Depth1Content;
