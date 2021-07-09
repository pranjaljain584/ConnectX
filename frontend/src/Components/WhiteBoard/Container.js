import React from 'react';
import Board from './Board';
import '../../assets/css/container.css';

class Container extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      color: '#000000',
      eraser :'#FFFFFF',
      size: '5',
    };
  }

  changeColor(params) {
    this.setState({
      color: params.target.value,
    });
  }

  changeSize(params) {
    this.setState({
      size: params.target.value,
    });
  }

  setEraser(){
    this.setState({
      color:'#FFFFFF',
      size:'10'
    })
  }

  render() {
    return (
      <div className='container'>
        <div class='tools-section'>
          <div className='color-picker-container'>
            Select Color : &nbsp;
            <input
              type='color'
              style={{ marginTop: '5px' }}
              value={this.state.color}
              onChange={this.changeColor.bind(this)}
            />
            <div
              style={{ marginTop: '5px', marginLeft:'10px' , display: 'inline', cursor: 'pointer' , backgroundColor:'black' ,color:'white' }}
              onClick={this.setEraser.bind(this)}
            >
              Eraser
              </div>
          </div>

          <div className='brushsize-container'>
            Select Brush Size : &nbsp;
            <select
              value={this.state.size}
              onChange={this.changeSize.bind(this)}
            >
              <option> 5 </option>
              <option> 10 </option>
              <option> 15 </option>
              <option> 20 </option>
              <option> 25 </option>
              <option> 30 </option>
            </select>
          </div>
        </div>

        <div class='board-container'>
          <Board color={this.state.color} size={this.state.size}></Board>
        </div>
      </div>
    );
  }
}

export default Container;
