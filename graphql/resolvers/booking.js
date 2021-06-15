const Event = require("../../models/event");
const Booking = require("../../models/booking");

const { tarnsformBooking, transformEvent } = require("./merge");

module.exports = {
  //returning all booking data form DB
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unautheticated");
    }
    try {
      const bookings = await Booking.find({ user: req.userId });
      return bookings.map((booking) => {
        return tarnsformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },

  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unautheticated");
    }
    const fetchEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: req.userId,
      event: fetchEvent,
    });
    const result = await booking.save();

    return tarnsformBooking(result);
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unautheticated");
    }

    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
};
