import React, { Component } from 'react'
import CircularProgress from 'material-ui/CircularProgress'

import { container } from './Loading.styl'

export default class Loading extends Component {
  render() {
    return (
      <div className={container}>
        <CircularProgress size={80} thickness={5} />
      </div>
    )
  }
}
