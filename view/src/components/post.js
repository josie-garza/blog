import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom'
import Typography from '@material-ui/core/Typography';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardContent from '@material-ui/core/CardContent';

import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { authMiddleWare } from '../util/auth';

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

class post extends Component {
	constructor(props) {
		super(props);

		this.state = {
			posts: '',
			title: '',
			body: '',
			postId: '',
			errors: [],
			open: false,
			uiLoading: true,
		};

		this.handleViewOpen = this.handleViewOpen.bind(this);
	}

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	componentWillMount = () => {
		authMiddleWare(this.props.history);
		const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		axios
			.get('/posts')
			.then((response) => {
				this.setState({
					posts: response.data,
					uiLoading: false
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	handleViewOpen(data) {
    this.props.history.push('/article/' + data.post.postId);
	}

	render() {

		dayjs.extend(relativeTime);
		const { classes } = this.props;
		const { open, errors } = this.state;

		const handleClickOpen = () => {
			this.setState({
				postId: '',
				title: '',
				body: '',
				open: true
			});
		};

		const handleSubmit = (event) => {
			authMiddleWare(this.props.history);
			event.preventDefault();
			const userPost = {
				title: this.state.title,
				body: this.state.body
			};
      const options = {
        url: '/post',
        method: 'post',
        data: userPost
      };
			const authToken = localStorage.getItem('AuthToken');
			axios.defaults.headers.common = { Authorization: `${authToken}` };
			axios(options)
				.then(() => {
					this.setState({ open: false });
					window.location.reload();
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
					<div className={classes.toolbar} />

					<IconButton
						className={classes.floatingButton}
						color="primary"
						aria-label="Add Post"
						onClick={handleClickOpen}
					>
						<AddCircleIcon style={{ fontSize: 60 }} />
					</IconButton>
					<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
						<AppBar className={classes.appBar}>
							<Toolbar>
								<IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
									<CloseIcon />
								</IconButton>
								<Typography variant="h6" className={classes.title}>
									Create a new Post
								</Typography>
								<Button
									autoFocus
									color="inherit"
									onClick={handleSubmit}
									className={classes.submitButton}
								>
									Submit
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
										helperText={errors.title}
										value={this.state.title}
										error={errors.title ? true : false}
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
										helperText={errors.body}
										error={errors.body ? true : false}
										onChange={this.handleChange}
										value={this.state.body}
									/>
								</Grid>
							</Grid>
						</form>
					</Dialog>

					<Grid container spacing={2}>
						{this.state.posts.map((post) => (
							<Grid item xs={12} sm={6}>
								<Card className={classes.root} variant="outlined" onClick={() => this.handleViewOpen({ post })}>
									<CardContent>
										<Typography variant="h5" component="h2">
											{post.title}
										</Typography>
										<Typography className={classes.pos} color="textSecondary">
											{dayjs(post.createdAt).fromNow()}
										</Typography>
										<Typography variant="body2" component="p">
											{`${post.body.substring(0, 65)}`}
										</Typography>
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				</main>
			);
		}
	}
}

export default (withStyles(styles)(withRouter(post)));