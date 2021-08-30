const { Thought, User } = require('../models');

const thoughtController = {
    // find all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
            .select('-__V')
            .sort({ _id: -1 })
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    // find thought by id
    getThoughtById({ params }, res) {

    },

    // add thought to User
    addThought({ params, body }, res) {
        Thought.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: params.pizzaId },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with that id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    // PUT to update a thought by its _id
    updateThought({ params }, res) {

    },

    // DELETE to remove a thought by its _id
    removeThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId })
            .then(deletedThought => {
                if (!deletedThought) {
                    return res.status(404).json({ message: 'No thought with that id!' });
                }
                return User.findByIdAndUpdate(
                    { _id: params.userId },
                    { $pull: { comments: params.commentId } },
                    { new: true }
                );
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user with that id!' });
                    return;
                }
            })
            .catch(err => res.json(err));
    },

    // Reactions
    // add reaction to thought
    addReaction({ params, body }, res) {
        Comment.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    // remove reaction trough thought 
    removeReaction({ params }, res) {
        Comment.findOneAndUpdate(
          { _id: params.thoughtId },
          { $pull: { replies: { replyId: params.rectionId } } },
          { new: true }
        )
          .then(dbUserData => res.json(dbUserData))
          .catch(err => res.json(err));
      }
}

module.exports = thoughtController;