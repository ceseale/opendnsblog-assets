/* global d3 */
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';
import { DPLButton } from '@opendns/dpl-buttons';

class Upload extends React.Component {

    onDrop(acceptedFiles) {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = (event) => {
          const data = JSON.parse(event.target.result);
          this.props.apprunner(true, data);
      };

      reader.readAsText(file);
    }

    render() {
        const centeringStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };

        return (
            <div style={Object.assign(centeringStyle, { color: 'white' })}>
              <Dropzone onDrop={this.onDrop.bind(this)}>
                <div style={Object.assign(centeringStyle, { color: 'white', height: '100%' })}>Try dropping a json here, click to select a file to upload, or use demo data.</div>
              </Dropzone>
              <DPLButton onClick={this.props.removeSelf.bind(this)}>USE DEMO</DPLButton>
            </div>
        );
    }
}

// define propTypes
Upload.propTypes = {
    apprunner: PropTypes.func,
    removeSelf: PropTypes.func
};

export default Upload;
