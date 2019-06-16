import React,{PureComponent}  from 'react';
import {Document, Page } from "react-pdf/dist/entry.webpack";

import './index.scss';


class PDFViewer extends PureComponent {
    state = {
        numPages: null,
        scale: 1
    };

    onLoadSuccess(pdf){
        this.setState({ numPages: pdf.numPages });

    }

    onPageLoadSuccess(page){
        let scale = this.document.offsetWidth / page.getViewport(1.0).width;
        scale = scale > 1 ? 1 : scale;
        this.setState({scale});
    }

    onPagError(error) {
        console.error(error);
    }


    render() {
        const { file } = this.props;
        if(!file){
            return;
        }
        const { numPages, scale } = this.state;
        let pages = [];

            for (let i = 0; i< numPages; i++){
                pages.push(<Page
                    key={i}
                    pageIndex={i}
                    onLoadSuccess={this.onPageLoadSuccess.bind(this)}
                    onRenderError={this.onPagError.bind(this)}
                    onLoadError={this.onPagError.bind(this)}
                    className="pdf-page"
                    scale={scale}
                />);
            }
        return (
            <Document
                file={file}
                inputRef={(ref) => { this.document = ref; }}
                onLoadSuccess={this.onLoadSuccess.bind(this)}
                className="pdf-document">
                {pages}
            </Document>
        );
    }
};

export default PDFViewer;
