const express = require('express');
const router = express.Router();

router.post('/',roomController.createRoom);
router.get('/:code', roomController.getByRoomCode);
router.post('/:code/question', roomController.createQuestion);
router.get('/:code/question', roomController.getQuestions);

module.exports = router;