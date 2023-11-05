const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

// @desc - get all contacts
// @route - GET /api/contacts
// @access - private
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find(
    { user_id: req.user.id },
    { user_id: 0, __v: 0 }
  );
  res.status(200).json(contacts);
});

// @desc - create new contacts
// @route - POST /api/contacts
// @access - private
const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id,
  });
  const responseContact = await Contact.findOne(
    { _id: contact._id },
    { __v: 0, user_id: 0 }
  );
  if (!responseContact) {
    res.status(500);
    throw new Error("Server error");
  }
  res.status(201).json(responseContact);
});

// @desc - get contact
// @route - GET /api/contacts/:id
// @access - private
const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findOne(
    { _id: req.params.id },
    { user_id: 0, __v: 0 }
  );
  if (!contact) {
    res.status(404);
    throw new Error("Contact not Found");
  }
  res.status(200).json(contact);
});

// @desc - update contact
// @route - PUT /api/contacts/:id
// @access - private
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not Found");
  }

  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to update this contact");
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  const responseContact = await Contact.findOne(
    { _id: updatedContact._id },
    { __v: 0, user_id: 0 }
  );
  res.status(200).json(responseContact);
});

// @desc - delete contact
// @route - DELETE /api/contacts/:id
// @access - private
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not Found");
  }

  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to delete this contact");
  }

  const responseContact = await Contact.findOne({_id:req.params.id},{user_id:0,__v:0})
  await Contact.deleteOne({ _id: req.params.id });
  res.status(200).json(responseContact);
});

module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};
