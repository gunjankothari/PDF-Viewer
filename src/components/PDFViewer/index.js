import React,{PureComponent}  from 'react';
import {Document, Page } from "react-pdf/dist/entry.webpack";

import './index.scss';


export default class PDFViewer extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
            numPages: null,
        };
    }

    onLoadSuccess(pdf){
        this.setState({ numPages: pdf.numPages });
    }

    onPagError(error) {
        console.error(error);
    }


    render() {
        const { file } = this.props;
        if(!file){
            return;
        }
        const { numPages } = this.state;
        let pages = [];

            for (let i = 0; i< numPages; i++){
                pages.push(<Page
                    key={i}
                    pageIndex={i}
                    onRenderError={this.onPagError.bind(this)}
                    onLoadError={this.onPagError.bind(this)}
                    className="pdf-page"
                />);
            }
        return (
            <Document
                file={file}
                onLoadSuccess={this.onLoadSuccess.bind(this)}
                className="pdf-document">
                {pages}
            </Document>
        );
    }
};
