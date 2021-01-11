const functions = require('firebase-functions');
const app = require('express')();
const auth = require('./util/auth');

const {
    getAllPosts,
    getOnePost,
    postOnePost,
    deletePost,
    editPost
} = require('./APIs/posts')

app.get('/posts', auth, getAllPosts);
app.get('/post/:postId', auth, getOnePost);
app.post('/post', auth, postOnePost);
app.delete('/post/:postId', auth, deletePost);
app.put('/post/:postId', auth, editPost);

const {
  loginUser,
  signUpUser,
  uploadProfilePhoto,
  getUserDetail,
  updateUserDetails
} = require('./APIs/users')

app.post('/signin', loginUser);
app.post('/signup', signUpUser);
app.get('/user', auth, getUserDetail);
app.post('/user/image', auth, uploadProfilePhoto);
app.post('/user', auth, updateUserDetails);

exports.api = functions.https.onRequest(app);
