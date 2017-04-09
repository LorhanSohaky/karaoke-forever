import React, { PropTypes } from 'react'
import Header from 'components/Header'
import classes from './LibraryHeader.css'

class LibraryHeader extends React.Component {
  static propTypes = {
    searchTerm: PropTypes.string.isRequired,
    // actions
    searchLibrary: PropTypes.func.isRequired,
    searchReset: PropTypes.func.isRequired,
  }

  state = {
    value: this.props.searchTerm,
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value })
    this.props.searchLibrary(event.target.value)
  }

  clearSearch = () => {
    this.setState({ value: '' })
    this.props.searchReset()
  }

  render () {
    return (
      <Header>
        <div className={classes.container}>
          <input type='search'
            className={classes.search}
            placeholder='search library'
            value={this.state.value}
            onChange={this.handleChange}
          />
          {this.props.searchTerm &&
            <div onClick={this.clearSearch} className={classes.clear}>
              <i className='material-icons'>clear</i>
            </div>
          }
        </div>
      </Header>
    )
  }
}

export default LibraryHeader
