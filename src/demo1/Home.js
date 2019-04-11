import React, {Component} from 'react';
import { Link } from 'react-router-dom';

import './app1.css'

class Home extends Component{
    render(){
        return(
            <div className='wrapper'>
            <Link to='/Page1'>
                <div className='btn'>load Page1</div>
            </Link>
                <Link to='/Page2'>
                    <div className='btn'>load Page2</div>
                </Link>
            </div>
        );
    }
}

export default Home;