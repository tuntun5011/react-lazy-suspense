import React, { Component, Suspense } from "react";
import './app2.css';
import ErrorBoundary from "./ErrorBoundary";

/**
 * 对于按需加载的组件  延迟加载
 * */

// const LazyPDFDocument = React.lazy(() => import("./PDFPreview"));
const LazyPDFDocument = React.lazy(() => {return new Promise((resolve,reject) => reject())});



class App extends Component {
    state = {
        name: "",
        showPDFPreview: false
    };

    handleClick = () => this.setState({ showPDFPreview: true });

    handleNameChange = event => this.setState({ name: event.target.value });

    render() {
        const greeting = `Hello ${this.state.name}`;

        return (
            <div className="App inputBox">
                <ErrorBoundary>
                    <input className='inputItem'
                        placeholder="Enter your name"
                        type="text"
                        onChange={this.handleNameChange}
                    />

                    <button onClick={this.handleClick}>Generate PDF</button>
                    {this.state.showPDFPreview && (
                        <Suspense fallback={<div className='loading'>Loading...</div>}>
                            <LazyPDFDocument title={greeting} />
                        </Suspense>
                    )}
                </ErrorBoundary>

            </div>
        );
    }
}

export default App;