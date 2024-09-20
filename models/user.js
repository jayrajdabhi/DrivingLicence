const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    default : '',
    // required: true,
  },
  lastname: {
    type: String,
    default : '',
    // required: true,
  },
  licenseNo: {
    type: String,
    // required: true,
    // unique: true,
    // sparse: true,
  },
  age: {
    type: Number,
    default : 0,
    // required: true,
  },
  dateOfBirth: {
    type: String,
    default : '',
    // required: true,
  },
  username: {
    type: String,
    // required : true,
    unique : true,
  },
  password:{
    type : String,
    // required: true,
  },
  user_type:{
    type : String,
    // required: true,
  },
  car_details: {
    make: {
      type: String,
      default : '',
      // required: true,
    },
    model: {
      type: String,
      default : '',
      // required: true,
    },
    year: {
      type: Number,
      default : '',
      // required: true,
    },
    platno: {
      type: String,
      default : '',
      // required: true,
      // unique : true,
      sparse : true,
    },
  },

  // Change appointment to appointments
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }]   
});


const appointmentSchema = new mongoose.Schema({
  date: {
      type: Date,
      required: true
  },
  time: {
      type: String,
      required: true
  },
  isTimeSlotAvailable: {
      type: Boolean,
      default: true
  },
});

const User = mongoose.model('User', userSchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = {
  User: User,
  Appointment: Appointment
};
