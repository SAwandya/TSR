const jwt = require('jsonwebtoken');
const { access } = require('fs');

exports.generateToken = (user) => {
    return jwt.sign(
      { _id: user._id, name: user.name, email: user.email, accessToken: user.accessToken },
      process.env.GOOGLE_CLIENT_SECRET,
      {
        expiresIn: "7d",
      }
    );
};

exports.generateRefreshToken = (user) => {
    return jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        accessToken: user.accessToken,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );
};

exports.refreshToken = async (refreshToken) => {
    try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );
        return this.generateToken({
          _id: decoded.id,
          name: user.name,
          email: user.email,
          accessToken: user.accessToken,
        });
    } catch (error) {
        console.error('Error refreshing token:', error);
        return null;
    }
};
