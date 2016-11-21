import React, { Component, PropTypes } from 'react'
import Slider from 'rc-slider'
import './VolumeSlider.scss'

export default class VolumeSlider extends Component {
  static propTypes = {
    volume: PropTypes.number.isRequired,
    offset: PropTypes.number,
    onVolumeChange: PropTypes.func.isRequired,
    className: PropTypes.string.isRequired,
  }

  state = {
    vol: this.props.volume,
    isDragging: false,
  }

  handleChange = this.handleChange.bind(this)
  handleAfterChange = this.handleAfterChange.bind(this)

  handleChange(vol) {
    this.setState({
      vol,
      isDragging: true,
    })
    this.props.onVolumeChange(vol)
    this.ignoreStatus = 0
  }

  handleAfterChange(vol) {
    this.setState({
      vol,
      isDragging: false,
    })
    this.props.onVolumeChange(vol)
    this.ignoreStatus = 2
  }

  componentDidUpdate(prevProps) {
    if (this.ignoreStatus && prevProps.volume !== this.props.volume) {
      this.ignoreStatus--
    }
  }

  render() {
    return (
      <Slider
        min={0}
        max={1}
        step={0.01}
        value={this.state.isDragging || this.ignoreStatus ? this.state.vol : this.props.volume}
        onChange={this.handleChange}
        onAfterChange={this.handleAfterChange}
        handle={<CustomGrabber />}
        className={this.props.className}
      />
    )
  }
}

// volume slider handle/grabber
class CustomGrabber extends Component {
  static propTypes = {
    value: React.PropTypes.any,
    offset: React.PropTypes.number,
  }

  baseStyle = {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    marginTop: '6px',
    fontSize: '44px',
    opacity: .7,
    color: '#333'
  }

  render() {
    const style = Object.assign({ left: `${this.props.offset}%` }, this.baseStyle)
    const vol = this.props.value

    let icon
    if (vol === 0) icon = "volume_off"
    else if (vol < .4) icon = "volume_mute"
    else if (vol < .7) icon = "volume_down"
    else icon = "volume_up"

    return (
      <div style={style}>
        <i className='material-icons'>{icon}</i>
      </div>
    )
  }
}