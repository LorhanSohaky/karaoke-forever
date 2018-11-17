import PropTypes from 'prop-types'
import React from 'react'
import Player from '../Player'
import PlayerTextOverlay from '../PlayerTextOverlay'
import PlayerVisualizer from '../PlayerVisualizer'

window._audioCtx = new (window.AudioContext || window.webkitAudioContext)()

class PlayerController extends React.Component {
  static propTypes = {
    bgAlpha: PropTypes.number.isRequired,
    queueItem: PropTypes.object.isRequired,
    isPlaying: PropTypes.bool.isRequired,
    isAtQueueEnd: PropTypes.bool.isRequired,
    isQueueEmpty: PropTypes.bool.isRequired,
    isErrored: PropTypes.bool.isRequired,
    visualizer: PropTypes.object.isRequired,
    volume: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    // actions
    cancelStatus: PropTypes.func.isRequired,
    emitError: PropTypes.func.isRequired,
    emitLeave: PropTypes.func.isRequired,
    emitStatus: PropTypes.func.isRequired,
    mediaChange: PropTypes.func.isRequired,
    mediaRequest: PropTypes.func.isRequired,
    mediaRequestSuccess: PropTypes.func.isRequired,
    mediaRequestError: PropTypes.func.isRequired,
    requestPlayNext: PropTypes.func.isRequired,
  }

  state = {
    audioSourceNode: null,
  }

  componentDidMount () {
    this.props.emitStatus()
  }

  componentWillUnmount () {
    this.props.cancelStatus()
    this.props.emitLeave()
  }

  componentDidUpdate (prevProps) {
    const { queueItem, isPlaying } = this.props

    // cancel any pending status emits having old info
    this.props.cancelStatus()

    // playing for first time?
    if (isPlaying && queueItem.queueId === -1) {
      this.props.requestPlayNext()
    }

    if (prevProps.queueItem.queueId !== queueItem.queueId) {
      // otherwise we'll emit new item with old's progress
      return this.props.emitStatus({ position: 0 })
    }

    this.props.emitStatus()
  }

  handleMediaElement = (el, mediaInfo) => {
    this.setState({ audioSourceNode: window._audioCtx.createMediaElementSource(el) }, () => {
      // route it back to the output, otherwise, silence
      this.state.audioSourceNode.connect(window._audioCtx.destination)
    })

    // isAlphaSupported, etc.
    this.props.mediaChange(mediaInfo)
  }

  handleMediaRequestError = msg => {
    // stop loading spinner, etc.
    this.props.mediaRequestError(msg)

    // call generic error handler (stops playback, etc.)
    this.handleError(msg)
  }

  handleError = msg => {
    this.props.emitError(msg)
  }

  render () {
    const { props, state } = this

    return (
      <>
        {state.audioSourceNode && props.visualizer.isSupported && props.visualizer.isEnabled &&
          <PlayerVisualizer
            audioSourceNode={state.audioSourceNode}
            isPlaying={props.isPlaying}
            presetKey={props.visualizer.presetKey}
            queueItem={props.queueItem}
            width={props.width}
            height={props.height}
            volume={props.volume}
          />
        }
        <Player
          bgAlpha={props.bgAlpha}
          queueItem={props.queueItem}
          volume={props.volume}
          isPlaying={props.isPlaying}
          isVisible={props.queueItem.queueId !== -1 && !props.isAtQueueEnd && !props.isErrored}
          onMediaElement={this.handleMediaElement}
          onMediaRequest={props.mediaRequest}
          onMediaRequestSuccess={props.mediaRequestSuccess}
          onMediaRequestError={this.handleMediaRequestError}
          onStatus={props.emitStatus}
          onMediaEnd={props.requestPlayNext}
          onError={this.handleError}
          width={props.width}
          height={props.height}
        />
        <PlayerTextOverlay
          queueItem={props.queueItem}
          isAtQueueEnd={props.isAtQueueEnd}
          isQueueEmpty={props.isQueueEmpty}
          isErrored={props.isErrored}
          width={props.width}
          height={props.height}
        />
      </>
    )
  }
}

export default PlayerController
