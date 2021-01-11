import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import axios from 'axios';
import { authMiddleWare } from '../util/auth';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

import dayjs from 'dayjs';


const styles = ((theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    toolbar: theme.mixins.toolbar,
    title: {
      marginLeft: theme.spacing(2),
      flex: 1
    },
    submitButton: {
      display: 'block',
      color: 'white',
      textAlign: 'center',
      position: 'absolute',
      top: 14,
      right: 10
    },
    floatingButton: {
      position: 'fixed',
      bottom: 0,
      right: 0
    },
    form: {
      width: '98%',
      marginLeft: 13,
      marginTop: theme.spacing(3)
    },
    root: {
      minWidth: 470
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)'
    },
    pos: {
      marginBottom: 12
    },
    uiProgess: {
      position: 'fixed',
      zIndex: '1000',
      height: '31px',
      width: '31px',
      left: '50%',
      top: '35%'
    },
    dialogeStyle: {
      maxWidth: '50%'
    },
    viewRoot: {
      margin: 0,
      padding: theme.spacing(2)
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500]
    }
    })
);

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

class article extends Component {
	constructor(props) {
		super(props);

		this.state = {
			post: '',
      uiLoading: true,
      open: false,
    };
    
    this.deletePostHandler = this.deletePostHandler.bind(this);
		this.handleEditClickOpen = this.handleEditClickOpen.bind(this);
	}

	componentWillMount = () => {
		authMiddleWare(this.props.history);
		const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		axios
			.get('/post/' + this.props.match.params.articleId)
			.then((response) => {
				this.setState({
					post: response.data,
					uiLoading: false
				});
			})
			.catch((err) => {
				console.log(err);
			});
  };

  handleChange = (event) => {
    let edit = this.state.post;
    if (event.target.name === 'title') {
      edit.title = event.target.value;
    } else {
      edit.body = event.target.value;
    }
		this.setState({
			post: edit,
		});
	};
  
  deletePostHandler(data) {
		authMiddleWare(this.props.history);
		const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
    let postId = data.post.postId;
    const options = {
      url: `/post/${postId}`,
      method: 'delete',
    };
		axios(options)
			.then(() => {
        this.props.history.push('/');
			})
			.catch((err) => {
				console.log(err);
			});
	}

	handleEditClickOpen(data) {
		this.setState({
			title: data.post.title,
			body: data.post.body,
			postId: data.post.postId,
			buttonType: 'Edit',
			open: true
		});
	}

	render() {
    const { classes } = this.props;
    const { open, post } = this.state;

    const handleSubmit = (event) => {
			authMiddleWare(this.props.history);
			event.preventDefault();
			const userPost = {
				title: this.state.post.title,
				body: this.state.post.body
			};
      const options = {
        url: `/post/${this.state.post.postId}`,
        method: 'put',
        data: userPost
      };
			const authToken = localStorage.getItem('AuthToken');
			axios.defaults.headers.common = { Authorization: `${authToken}` };
			axios(options)
				.then(() => {
          this.setState({ open: false });
          this.props.history.push('/');
				})
				.catch((error) => {
					this.setState({ open: true, errors: error.response.data });
					console.log(error);
				});
		};
    
    const handleClose = (event) => {
			this.setState({ open: false });
		};

		if (this.state.uiLoading === true) {
			return (
				<main className={classes.content}>
					<div className={classes.toolbar} />
					{this.state.uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
				</main>
			);
		} else {
			return (
				<main className={classes.content}>
          <Button size="small" color="primary" onClick={() => this.handleEditClickOpen({ post })}>
            Edit
          </Button>
          <Button size="small" color="primary" onClick={() => this.deletePostHandler({ post })}>
            Delete
          </Button>
          <Typography variant="h5" component="h2">
            {this.state.post.title}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            {dayjs(this.state.post.createdAt).fromNow()}
          </Typography>
          <Typography variant="body2" component="p">
            {`${this.state.post.body.substring(0, 65)}`}
          </Typography>

          <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
              <Toolbar>
                <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                  Edit Post
                </Typography>
                <Button
                  autoFocus
                  color="inherit"
                  onClick={handleSubmit}
                  className={classes.submitButton}
                >
                  Save
                </Button>
              </Toolbar>
            </AppBar>

            <form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="postTitle"
                    label="Post Title"
                    name="title"
                    autoComplete="postTitle"
                    value={this.state.post.title}
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="postDetails"
                    label="Post Details"
                    name="body"
                    autoComplete="postDetails"
                    multiline
                    rows={25}
                    rowsMax={25}
                    onChange={this.handleChange}
                    value={this.state.post.body}
                  />
                </Grid>
              </Grid>
            </form>
          </Dialog>
				</main>
			);
		}
	}
}

export default (withStyles(styles)(article));