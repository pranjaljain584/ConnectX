const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const ChatRoom = require('../../models/ChatRoom');
const Reminder = require('../../models/Reminder');
const User = require('../../models/User');

router.get('/', auth, async (req, res) => {
  try {
    const events = await Reminder.find({ userId: req.user.id });

    return res.status(200).json({ events });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { Description, StartTime, EndTime, isAllDay, Subject } =
      req.body.data;
    const { userId } = req.body;

    let event = new Reminder({
      Description,
      StartTime,
      EndTime,
      Subject,
      userId,
    });

    await event.save(async function (err, result) {
      if (err) {
        console.log('Event save error: **', err);
        return;
      }

      try {
        const events = await Reminder.find({ userId: req.user.id });

        return res.status(200).json({ events });
      } catch (error) {
        console.log('Event save error:', err);
      }
    });

    // return res.status(200).send('Added');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    await Reminder.findOneAndDelete({_id:req.params.id,userId:req.user.id});
    // const events = await Reminder.find({ userId: req.user.id });
    return res.status(200).send('Deleted');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.post('/update/:id2', auth, async (req, res) => {
  try {
    const { Description, StartTime, EndTime, isAllDay, Subject } =
      req.body.data;

    await Reminder.findOneAndUpdate(
      { _id: req.params.id2, userId: req.user.id },
      {
        Description,
        StartTime,
        EndTime,
        isAllDay,
        Subject,
      }
    );

    console.log('UPDATES');
    return res.status(200).send('Updated');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
