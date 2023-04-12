const resolvers = {
  Query: {
    posts: () => Post.find().sort({ createdAt: -1 }),
    post: (parent, { postId }) => Post.findById(postId),
  },
  Mutation: {
    addPost: async (parent, { postText, postAuthor }) => {
      const post = new Post({ postText, postAuthor, createdAt: new Date().toISOString() });
      await post.save();
      return post;
    },
    removePost: async (parent, { postId }) => {
      const post = await Post.findByIdAndRemove(postId);
      return post;
    },
    addComment: async (parent, { postId, commentText, username }) => {
      const comment = { commentText, username, createdAt: new Date().toISOString() };
      const post = await Post.findByIdAndUpdate(
        postId,
        { $push: { comments: comment } },
        { new: true }
      );
      return post;
    },
    removeComment: async (parent, { postId, commentId }) => {
      const post = await Post.findByIdAndUpdate(
        postId,
        { $pull: { comments: { _id: commentId } } },
        { new: true }
      );
      return post;
    },
  },
  Post: {
    comments: (parent) => parent.comments.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  },
};

module.exports = resolvers;
