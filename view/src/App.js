
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import login from './pages/login';
import home from './pages/home';
import article from './pages/article';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

const theme = createMuiTheme({
	palette: {
		primary: {
			light: '#33c9dc',
			main: '#FF5722',
			dark: '#d50000',
			contrastText: '#fff'
		}
	}
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
          <div>
            <Switch>
                <Route exact path="/" component={home}/>
                <Route exact path="/login" component={login}/>
                <Route path="/article/:articleId" component={article} />
            </Switch>
          </div>
      </Router>
    </MuiThemeProvider>
  );
}

export default App;