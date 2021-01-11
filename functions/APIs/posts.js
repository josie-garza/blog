const { db } = require('../util/admin');

exports.getAllPosts = (request, response) => {
  console.log('gettting posts...');
	db
    .collection('posts')
    .where('username', '==', request.user.username)
		.orderBy('createdAt', 'desc')
		.get()
		.then((data) => {
			let posts = [];
			data.forEach((doc) => {
				posts.push({
                    postId: doc.id,
                    title: doc.data().title,
					body: doc.data().body,
					createdAt: doc.data().createdAt,
				});
			});
			return response.json(posts);
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({ error: err.code});
		});
};

exports.getOnePost = (request, response) => {
	db
        .doc(`/posts/${request.params.postId}`)
		.get()
		.then((doc) => {
			if (!doc.exists) {
				return response.status(404).json(
                    { 
                        error: 'Post not found' 
                    });
            }
            if(doc.data().username !== request.user.username){
                return response.status(403).json({error:"UnAuthorized"})
            }
			PostData = doc.data();
			PostData.postId = doc.id;
			return response.json(PostData);
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({ error: error.code });
		});
};

exports.postOnePost = (request, response) => {
	if (request.body.body.trim() === '') {
		return response.status(400).json({ body: 'Must not be empty' });
    }
    
    if(request.body.title.trim() === '') {
        return response.status(400).json({ title: 'Must not be empty' });
    }
    
    const newPostItem = {
        title: request.body.title,
        body: request.body.body,
        username: request.user.username,
        createdAt: new Date().toISOString()
    }
    db
        .collection('posts')
        .add(newPostItem)
        .then((doc)=>{
            const responsePostItem = newPostItem;
            responsePostItem.id = doc.id;
            return response.json(responsePostItem);
        })
        .catch((err) => {
			response.status(500).json({ error: 'Something went wrong' });
			console.error(err);
		});
};

exports.deletePost = (request, response) => {
  const document = db.doc(`/posts/${request.params.postId}`);
  document
      .get()
      .then((doc) => {
          if (!doc.exists) {
              return response.status(404).json({ error: 'Post not found' })
          }
          if(doc.data().username !== request.user.username){
            return response.status(403).json({error:"UnAuthorized"})
          }
          return document.delete();
      })
      .then(() => {
          response.json({ message: 'Delete successfull' });
      })
      .catch((err) => {
          console.error(err);
          return response.status(500).json({ error: err.code });
      });
};

exports.editPost = ( request, response ) => { 
  if(request.body.postId || request.body.createdAt){
      response.status(403).json({message: 'Not allowed to edit'});
  }
  let document = db.collection('posts').doc(`${request.params.postId}`);
  document.update(request.body)
  .then(()=> {
      response.json({message: 'Updated successfully'});
  })
  .catch((err) => {
      console.error(err);
      return response.status(500).json({ 
              error: err.code 
      });
  });
};