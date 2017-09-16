'use strict';

import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';

import { WebView } from 'react-native';
import { pushPage, pushWebPage } from '../actions/page';

import { PostScript } from '../config/jsassets';

class MainView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <WebView
                style={{flex: 1}}
                source={this.props.source}
                onMessage={e => {this.props.onMessage(e);}}
            />
        );
    }
}

function mapStateToProps(state) {
    var source = _createSource(state.pagesapp.sourceUrl, state.pagestore.sourcePages, state.pagestore.sourceCss);
    return { 
        source: source
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onMessage: (event) => {
            var url = event.nativeEvent.data + '';

            if (_isHybridLink(url)) {
                var baseUrl = _getBaseUrlKey(url);
                dispatch(pushPage(baseUrl));
            }

            if (_isHttpLink(url)) {
                dispatch(pushWebPage(url));
            }
        }
    }
}


const _getBaseUrlKey = (url) => {
    return url.slice(9, url.length);
}


const _createHttpUrlSource = (sourceUrl) => {
    return { uri: sourceUrl }
}

const _isHybridLink = (sourceUrl) => {
    if (sourceUrl.startsWith("hybrid://")) {
        return true;
    }
    return false;
}

const _isHttpLink = (sourceUrl) => {
    if (sourceUrl.startsWith("http")) {
        return true;
    }
    return false;
}


const _createHybridSource = (pageHtml, css) => {

    var html = _getInitialHybridHtml(pageHtml); 
    var interimHtml = _addCssToHeadHtml(html, css);
    var finalHtml = _addPostScriptToBodyHtml(interimHtml, PostScript);
    return { html: finalHtml }
}


const _getInitialHybridHtml = (pageHtml) => {
    return pageHtml || '<html><head></head><body>No Data</body></html>'
}


const _addCssToHeadHtml = (pageHtml, css) => {
    let n = pageHtml.indexOf("</head>");
    return [pageHtml.slice(0, n), '<style type="text/css">', css, "</style>", pageHtml.slice(n)].join('');
}


const _addPostScriptToBodyHtml = (pageHtml, postscript) => {
    let m = pageHtml.indexOf("</body>");
    return [pageHtml.slice(0,m), '<script>', PostScript, "</script>", pageHtml.slice(m)].join('');
}


const _createSource = (sourceUrl, sourcePages, sourceCss) => {
    if (_isHttpLink(sourceUrl)) {
        return _createHttpUrlSource(sourceUrl);
    }

    return _createHybridSource(sourcePages[sourceUrl], sourceCss);

}


export default connect(mapStateToProps, mapDispatchToProps)(MainView)
