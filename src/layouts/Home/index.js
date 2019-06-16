import React,{PureComponent}  from 'react';
import './index.scss';
import FileItem from "../../components/FileItem"
import LOGO from "../../assets/images/logo.svg";
import UPLOAD from "../../assets/images/upload.svg";
import {Document, Page, pdfjs } from "react-pdf/dist/entry.webpack";

export default class HomePage extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
            fileLoaded: false,
            numPages: null,
            pageNumber: 0,
        };
    }

    uploadFile(event){
        const input = event.target;

        const reader = new FileReader();
        reader.onload = () => {
            this.file = { data: reader.result}
            // this.file = new Uint8Array(reader.result);
            // this.file = {data: reader.result};
            // console.log(this.file);
            const prom = pdfjs.getDocument({ data: new Uint8Array(reader.result)});
            console.log(prom);
            prom.then(pdf=> console.log(pdf))
            this.setState({ fileLoaded: true });
        };
        reader.readAsArrayBuffer(input.files[0]);
    }

    onLoadSuccess(pdf){
        console.log('onDocumentLoad', pdf);
        this.setState({ numPages: pdf.numPages });
    }

    onRenderSuccess(page){
        console.log(page.originalHeight);
    }
    onPageLoadSucess(page){
        console.log(page.originalHeight);
    }
    onRenderError(error){
        console.error(error);
    }
    onPageLoadError(error){
        console.error(error);
    }


    render() {
        const { fileLoaded, numPages, pageNumber } = this.state;
        return (
            <div className="main">
                <div className="sidebar">
                    <div className="logo">
                        <img src={LOGO}/>
                    </div>
                    <div className="file-wrapper">
                        <div className="label">Files</div>
                        <div className="items">
                            <FileItem></FileItem>
                            <FileItem></FileItem>
                            <FileItem></FileItem>
                        </div>
                    </div>
                    <div className="bottom">
                        <input id="file-upload" type="file" accept="application/pdf" onChange={this.uploadFile.bind(this)}/>
                        <label htmlFor="file-upload" className="file-upload-btn">
                            <img src={UPLOAD} />
                            <span>Upload Files</span>
                        </label>
                    </div>
                </div>
                <div className="container">
                    <div>Container</div>
                    { fileLoaded &&
                        <Document
                            file={{ data: this.file }}
                            onLoadSuccess={this.onLoadSuccess} >
                            <Page
                                pageIndex={pageNumber}
                                onLoadSuccess={this.onPageLoadSucess}
                                onRenderSuccess={this.onRenderSuccess}
                                onRenderError={this.onRenderError}
                                onLoadError={this.onPageLoadError}
                            />
                        </Document>
                    }
                </div>
            </div>

        );
    }
};
