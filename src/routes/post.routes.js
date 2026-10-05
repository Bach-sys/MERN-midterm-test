const router = require('express').Router();
const authenticate = require('../middlewares/auth');
const { createPost, updatePost } = require('../controllers/post.controller');

router.post('/', authenticate, createPost);
router.put('/:id', authenticate, updatePost);
router.patch('/:id', authenticate, updatePost);

module.exports = router;
