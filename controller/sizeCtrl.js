const Size = require("../models/SizeModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

//create
const createSize = asyncHandler(async (req, res) => {
    try {
        const newColor = await Size.create(req.body);
        res.json(newColor);
    } catch (error) {
        throw new Error(error);
    }
});

//update Color
const updateColor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updatedColor = await Color.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(updatedColor);
    } catch (error) {
        throw new Error(error);
    }
});

//delete Color
const deleteColor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deleteColor = await Color.findByIdAndDelete(id);
        res.json(deleteColor);
    } catch (error) {
        throw new Error(error);
    }
});

//get Color
const getColor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const getColor = await Color.findById(id);
        res.json(getColor);
    } catch (error) {
        throw new Error(error);
    }
});

//get Color
const getAllColor = asyncHandler(async (req, res) => {
    try {
        const getAllColor = await Color.find();
        res.json(getAllColor);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createColor,
    getColor,
    updateColor,
    deleteColor,
    getAllColor,
};
