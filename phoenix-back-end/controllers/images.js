const cloudinary = require('cloudinary');
const HttpStatus = require('http-status-codes');
const User = require('../models/user');

cloudinary.config({
    cloud_name: 'doztrdady',
    api_key: '783399861946491',
    api_secret: 'DR_G-vVqD74gQjbnLUQpFNd1MT0'
});

module.exports = {
    UploadImage(req, res) {
        //console.log(req.body);
        cloudinary.uploader.upload(req.body.image, async result => {
            
            console.log(result);

            //want to update models/user.js
            await User.update(
              {
                //get the document by its id
                _id: req.user._id
              },
              {
                //push image into the array
                $push: {
                  images: {
                    //from result(object) we get the public_id and
                    //we add it to the array, also the version
                    imgId: result.public_id,
                    imgVersion: result.version
                  }
                }
              }
            )
            .then(() =>
                res
                  .status(HttpStatus.OK)
                  .json({ message: 'Image uploaded successfully' })
            )
            .catch(err =>
                res
                  .status(HttpStatus.INTERNAL_SERVER_ERROR)
                  .json({ message: 'Error uploading image' })
            );
        });
    },

    //set the profile picture
    async SetDefaultImage(req, res) {
      //we want the imgId and version
      const { imgId, imgVersion } = req.params;
  
      await User.update(
        {
          //find the user by id
          _id: req.user._id
        },
        {
          picId: imgId,
          picVersion: imgVersion
        }
      )
        .then(() =>
          res.status(HttpStatus.OK).json({ message: 'Default image set' })
        )
        .catch(err =>
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Error occured at setting the default img' })
        );
    }
}