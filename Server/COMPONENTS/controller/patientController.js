const router = require('express').Router();
const mongoose = require('mongoose');
const Patient = require('../model/patientModel');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Next queue number, e.g. Q-001, Q-002
const nextQueueNo = async () => {
    const last = await Patient.findOne().sort({ queueNo: -1 });
    const next = last ? Number(last.queueNo.slice(2)) + 1 : 1;
    return `Q-${String(next).padStart(3, '0')}`;
};

// Get all patients
router.get('/', async (request, response) => {
    try {
        const patients = await Patient.find().sort({ level: 1, arrivedAt: 1 });
        response.status(200).json(patients);
    } catch (error) {
        response.status(500).json({
            message: "Unable to get patients",
            error: error.message
        });
    }
});

// Get one patient
router.get('/:id', async (request, response) => {
    try {
        if (!isValidId(request.params.id)) {
            return response.status(404).json({ message: "Patient not found", success: false });
        }
        const patient = await Patient.findById(request.params.id);
        if (!patient) {
            return response.status(404).json({ message: "Patient not found", success: false });
        }
        response.status(200).json(patient);
    } catch (error) {
        response.status(500).json({
            message: "Unable to get patient",
            error: error.message
        });
    }
});

// Create a new patient
router.post('/create', async (request, response) => {
    try {
        const { name, age, sex, complaint, level } = request.body || {};

        const newPatient = new Patient({
            queueNo: await nextQueueNo(),
            name: name,
            age: age,
            sex: sex,
            complaint: complaint,
            level: level
        });

        await newPatient.save();
        response.status(201).json({
            message: "Patient created successfully",
            success: true,
            patient: newPatient
        });
    } catch (error) {
        const status = error.name === 'ValidationError' ? 400 : 500;
        response.status(status).json({
            message: "Unable to create patient",
            error: error.message
        });
    }
});

// Update a patient (only the fields that were sent)
router.put('/update/:id', async (request, response) => {
    try {
        if (!isValidId(request.params.id)) {
            return response.status(404).json({ message: "Patient not found", success: false });
        }
        const patient = await Patient.findById(request.params.id);
        if (!patient) {
            return response.status(404).json({ message: "Patient not found", success: false });
        }

        const fields = ['name', 'age', 'sex', 'complaint', 'level', 'status'];
        fields.forEach((field) => {
            if (request.body?.[field] !== undefined) {
                patient[field] = request.body[field];
            }
        });

        await patient.save();
        response.status(200).json({
            message: "Patient updated successfully",
            success: true,
            patient: patient
        });
    } catch (error) {
        const status = error.name === 'ValidationError' ? 400 : 500;
        response.status(status).json({
            message: "Unable to update patient",
            error: error.message
        });
    }
});

// Delete a patient
router.delete('/:id', async (request, response) => {
    try {
        if (!isValidId(request.params.id)) {
            return response.status(404).json({ message: "Patient not found", success: false });
        }
        const patient = await Patient.findByIdAndDelete(request.params.id);
        if (!patient) {
            return response.status(404).json({ message: "Patient not found", success: false });
        }
        response.status(200).json({
            message: "Patient deleted successfully",
            success: true
        });
    } catch (error) {
        response.status(500).json({
            message: "Unable to delete patient",
            error: error.message
        });
    }
});

module.exports = router;
