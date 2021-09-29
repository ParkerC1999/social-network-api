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
        Thought.findOne({ _id: params.id })
            .select('-__V')
            .sort({ _id: -1 })
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    // add thought to User
    addThought({ params, body }, res) {
        Thought.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: params.userId },
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
    updateThought(req, res) {
        Thought.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true, runValidators: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(400).json({ message: 'No thought with that id!' })
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    // DELETE to remove a thought by its _id
    removeThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then(deletedThought => {
                if (!deletedThought) {
                    return res.status(404).json({ message: 'No thought with that id!' });
                }
                return User.findByIdAndUpdate(
                    { _id: params.userId },
                    { $pull: { thoughts: params.thoughtId } },
                    { new: true }
                );
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user with that id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    // Reactions
    // add reaction to thought
    addReaction({ params, body }, res) {
        // console.log(params)
        Thought.findOneAndUpdate(
            { _id: params.id },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },

    // remove reaction trough thought 
    removeReaction({ params }, res) {
        console.log(params)
        Thought.findOneAndUpdate(
            { _id: params.id },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => res.json(err.message));
    }
}

module.exports = thoughtController;