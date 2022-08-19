const User = require("../model/userModel");
const brcypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
  // console.log(req.body);
  try {
    const { username, email, password } = req.body;

    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      // console.log("username already exist");
      return res.json({ msg: "Username already used", status: false });
    }

    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      // console.log("email already exist");
      return res.json({ msg: "Email already in use", status: false });
    }

    const hashedPassword = await brcypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    delete user.password;
    return res.json({
      status: true,
      user: {
        userID: user._id,
        username: user.username,
        avatarImage: user.avatarImage,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  //   console.log(req.body);
  try {
    const { username, password } = req.body;

    // checking for username
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ msg: "Incorrect username", status: false });
    }

    // checking for password
    const isPasswordValid = await brcypt.compare(password, user.password);
    console.log("Password status", isPasswordValid);
    if (!isPasswordValid) {
      return res.json({ msg: "Incorrect Password", status: false });
    }

    delete user.password;

    return res.json({
      status: true,
      user: {
        userID: user._id,
        username: user.username,
        avatarImage: user.avatarImage,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userID = req.params.id;
    const avatarImage = req.body.image;

    await User.findByIdAndUpdate(userID, {
      isAvatarImageSet: true,
      avatarImage,
    });

    const data = await User.findById(userID);
    // console.log("updated record.", data);
    // console.log("user data:", data);
    // return await res.json({ userData });
    return res.json({ isSet: true, image: avatarImage });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

module.exports.checkAvatar = async (req, res, next) => {
  try {
    const userID = req.params.id;
    // dbo.collection("customers").findOne({}, function(err, result)
    const check = await User.findOne({ _id: userID });
    console.log("Checking avatar image:", check.isAvatarImageSet);
    return res.json({ isAvatarImageSet: check.isAvatarImageSet });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};
