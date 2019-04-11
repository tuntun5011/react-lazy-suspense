import React, { Component } from "react";
import PDFPreview from "./PDFPreview";

import './app2.css';

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
                {this.state.showPDFPreview && <PDFPreview title={greeting} />}
            </div>
        );
    }
}


export default App;