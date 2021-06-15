const Event = require("../../models/event");
const User = require("../../models/user");

const { transformEvent } = require("./merge");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      events.map((event) => {
        return transformEvent(event);
      });
      return events;
    } catch (error) {
      throw err;
    }
  },
  createEvent: async (args,req) => {
    if(!req.isAuth){
        throw new Error('Unautheticated');
    }
    let createdEvent;
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: req.userId,
    });

    

    try {
      const result = await event.save();
      createdEvent = transformEvent(result);
      const creator = await User.findById(req.userId);
      if (!creator) {
        throw new Error("User not found");
      }
      creator.createdEvents.push(event);

      await creator.save();
      return createdEvent;
    } catch (err) {
      console.log("err", err);
      throw err;
    }
  },
};
