import React    from 'react'
import ReactDOM from 'react-dom'
import { hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { AppContainer } from 'react-hot-loader'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { blue600, blue500, lightBlue300, grey800, grey600 } from 'material-ui/styles/colors'

import configureStore from './store/configureStore'
import createRoutes from './routes'
import Root from './containers/Root'

const { persistor, store } = configureStore()
const history = syncHistoryWithStore(hashHistory, store)
const routes = createRoutes(React, history, store)

// Hack React Hot Reloading
if(module.hot)
  module.hot.accept()

let root = document.createElement('div')
root.id = 'root'
document.body.appendChild(root)

function renderApp(RootComponent) {
  ReactDOM.render(
    <AppContainer key={Math.random()}>
      <MuiThemeProvider>
        <RootComponent persistor={persistor} store={store}>
          {routes}
        </RootComponent>
      </MuiThemeProvider>
    </AppContainer>,
    document.getElementById('root')
  )
}

renderApp(Root)

if(module.hot)
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('./containers/Root', () => renderApp(require('./containers/Root')))
