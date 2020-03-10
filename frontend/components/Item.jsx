import React from 'react';
import { connect } from 'react-redux';

class Item extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (! this.props.item) return null;

        return (
            <div className={"Item " + this.props.classNames}>
                 <div className="ItemHeader">
                     <span>{this.props.item.header.id}</span>
                     <span>{this.props.item.header.type}</span>
                     <span>{this.props.item.header.name}</span>
                 </div>
            </div>
        );







    } // render()

} // class Item


function mapStateToProps(state) {      // state is the redux global state object
    return {item: state.allItems[1]};
}

export default connect(mapStateToProps)(Item);
