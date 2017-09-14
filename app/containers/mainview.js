'use strict';

import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { WebView } from 'react-native';
import { pushPage, pushWebPage } from '../actions/page';

import { PostScript } from '../config/firebaseassets';

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

            if (url.startsWith("hybrid://")) {
                var baseUrl = url.slice(9, url.length);
                dispatch(pushPage(baseUrl));
            }

            if (url.startsWith("http")) {
                dispatch(pushWebPage(url));
            }
        }
    }
}

const _createSource = (sourceUrl, sourcePages, sourceCss) => {
    var source = {}
    if (sourceUrl.startsWith("http")) {
        source = { uri: sourceUrl }
    } else {
        var html = sourcePages[sourceUrl] || '<html><head></head><body>No Data</body></html>'
        var n = html.indexOf("</head>");
        var interimHtml = [html.slice(0, n), '<style type="text/css">', sourceCss, "</style>", html.slice(n)].join('');
        var m = interimHtml.indexOf("</body>");
        var finalHtml = [interimHtml.slice(0,m), '<script>', PostScript, "</script>", interimHtml.slice(m)].join('');
        source = { html: finalHtml }
    }
    return source;
}

export default connect(mapStateToProps, mapDispatchToProps)(MainView)
