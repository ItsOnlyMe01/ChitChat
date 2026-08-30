const asynHandler = require("express-async-handler");
const User = require("../Models/userModel");
const generateToken = require("../congfig/generateToken");

const registerUser = asynHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Fields");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const userExists = await User.findOne({ email: normalizedEmail });

  if (userExists) {
    res.status(400);
    throw new Error("User already Exists");
  }
  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    throw new Error("Failed to Create User ");
  }
});

//auth user

const authUser = asynHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter all fields");
  }

  const normalizedEmail = email.toLowerCase().trim();

  // If logging in as guest, clean up duplicate guest users first
  if (normalizedEmail === "guest@email.com") {
    try {
      const guests = await User.find({ email: { $regex: /^guest@email\.com$/i } });
      if (guests.length > 1) {
        const keepId = guests[0]._id;
        await User.deleteMany({
          email: { $regex: /^guest@email\.com$/i },
          _id: { $ne: keepId }
        });
      }
    } catch (err) {
      console.error("Error cleaning up duplicate guest accounts:", err);
    }
  }

  let user = await User.findOne({ email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") } });

  // Automatically create the guest user if it doesn't exist yet
  if (!user && normalizedEmail === "guest@email.com") {
    user = await User.create({
      name: "Guest User",
      email: "guest@email.com",
      password: "123456",
      pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    });
  }

  if (user) {
    const isGuest = normalizedEmail === "guest@email.com" && password === "123456";
    const isPasswordCorrect = isGuest || (await user.matchPassword(password));

    if (isPasswordCorrect) {
      res.json({
        _id: user._id,
        name: user.name || "Guest User",
        email: user.email,
        pic: user.pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        token: generateToken(user._id),
      });
      return;
    }
  }

  res.status(401);
  throw new Error("Invalid Email or Password");
});

// alluser

const allUser = asynHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword);
  res.send(users);
});

module.exports = { registerUser, authUser, allUser };
