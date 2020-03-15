import React from 'react';
import Item from './Item'

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="App">
                <div className="Navbar">
                </div>
                <div className="Sidebar">
                </div>
                <div className="Main">
                    Hello there from App.jsx
                    <Item id={1}/>
                </div>
            </div>
        );
    }
}
