import React, { Component, Suspense } from "react";
import './css0.css';

const LazyPDFDocument = React.lazy(() => import("./PDFPreview"));




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
                <input className='inputItem'
                    placeholder="Enter your name"
                    type="text"
                    onChange={this.handleNameChange}
                />

                <button onClick={this.handleClick}>Generate PDF</button>
                {this.state.showPDFPreview && (
                    <Suspense fallback={<div>Loading...</div>}>
                        <LazyPDFDocument title={greeting} />
                    </Suspense>
                )}
            </div>
        );
    }
}

export default App;