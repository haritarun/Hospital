const User = require('../models/user');

const getUserDetails = async (req, res) => {
  const { email } = req.query; 

  if (!email) {
      return res.status(400).json({ error: 'Email parameter is required' });
  }

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
  } catch (error) {
      console.error(error); 
      res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports =  getUserDetails;