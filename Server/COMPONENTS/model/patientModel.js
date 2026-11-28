const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    queueNo: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        min: 0,
        max: 120
    },
    sex: {
        type: String,
        required: true,
        enum: ['F', 'M']
    },
    complaint: {
        type: String,
        required: true,
        trim: true
    },
    level: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    status: {
        type: String,
        enum: ['Waiting', 'In assessment', 'Referred'],
        default: 'Waiting'
    },
    arrivedAt: {
        type: Date,
        default: Date.now
    }
}, {
    // Send "id" instead of "_id" so the client can keep using patient.id
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: (doc, ret) => {
            delete ret._id;
            return ret;
        }
    }
});

module.exports = mongoose.model('Patient', PatientSchema);
