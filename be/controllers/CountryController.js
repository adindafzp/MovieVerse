// controllers/countryController.js
const Country = require("../models/Country");

// Function to get all countries
exports.getAllCountries = async (req, res) => {
  try {
    const countries = await Country.findAll();
    res.status(200).json(countries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching countries", error: err });
  }
};

// Function to create a new country
exports.createCountry = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    const country = await Country.create({ name });
    res.status(201).json({ message: "Country created successfully", country });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating country", error: err });
  }
};

// Function to get a country by ID
exports.getCountryById = async (req, res) => {
  try {
    const country = await Country.findByPk(req.params.id);
    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }
    res.status(200).json(country);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching country", error: err });
  }
};

// Function to update a country
exports.updateCountry = async (req, res) => {
  const { name } = req.body;

  try {
    const country = await Country.findByPk(req.params.id);
    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }

    country.name = name || country.name;
    await country.save();

    res.status(200).json({ message: "Country updated successfully", country });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating country", error: err });
  }
};

// Function to delete a country
exports.deleteCountry = async (req, res) => {
  try {
    const country = await Country.findByPk(req.params.id);
    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }

    await country.destroy();
    res.status(200).json({ message: "Country deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting country", error: err });
  }
};
