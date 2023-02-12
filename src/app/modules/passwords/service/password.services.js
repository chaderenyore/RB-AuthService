const axios = require("axios");
const loginRepository = require ('../../auth/repository/login.repository');
const { generateTokenAndStore } = require ('../../../../_helpers/generateOtp');
const KEYS = require("../../../../_config/keys");
const { redisGetAsync } = require("../../../../_helpers/promisifyRedis");

const {
  comparePassword,
  hashPassword,
} = require("../../../../_helpers/passwordHash");
const { TYPE } = require("../../../../_constants/record.type");
// const KEYS = require("../../../../_config/keys");

class PasswordService {
  constructor() {
    this.loginRepository = loginRepository;
  }

  async requestPaswordReset(platform, data) {
    try {
      //search for user from login model
      const user = await this.loginRepository.findOne({
        $or: [
          { phone_number: data.channel_value },
          { email: data.channel_value },
        ],
      });
      if (!user) {
        return {
          error: true,
          message: `This ${data.channel} does not exist`,
          data: null,
        };
      } else {
        // store in redis
        const token = String(
          generateTokenAndStore(`${platform}${data.channel_value}`)
        );
        // send mail
        const Data = {
          first_name: user.first_name,
          email: user.email,
          token: token,
        };
        await axios.post (
          `${KEYS.NOTIFICATION_URI}/notifications/v1/user/request-password-reset`,
          Data
        );
        return {
          error: false,
          message: `A mail has been sent to ${user.email}`,
          data: {
            channel: data.channel,
            channel_value: data.channel_value,
          },
        };
      }
    } catch (err) {
      console.log(err);
      return {
        error: true,
        message: "Unable to request reset at the moment",
        data: err,
      };
    }
  }

  async validatePasswordToken(platform, data) {
    try {
      //  get user and store id for password reset
      const user = await this.loginRepository.findOne({
        $or: [
          { phone_number: data.channel_value },
          { email: data.channel_value },
        ],
      });
      if (!user) {
        return {
          error: true,
          message: "Unknown Phone Number Or Email",
          data: null,
        };
      }
      let userId = user.user_id;
      // generate a random string
      const securityKey = String(generateTokenAndStore(userId));
      const token = await redisGetAsync(`${platform}${data.channel_value}`);
      console.log("REDIS TOKEN ========= : ", token)
      if (!token) {
        return {
          error: true,
          message: "OTP does not exist or has expired",
          data: null,
        };
      } else if (token !== data.token) {
        return {
          error: true,
          message: "Invalid OTP or Platform mis-match",
          data: null,
        };
      } else {
        return {
          error: false,
          message: "OTP is Valid",
          data: {
            Key: userId,
          },
        };
      }
    } catch (err) {
      console.log(err);
      return {
        error: true,
        message: "Unable to Validate Token",
        data: err,
      };
    }
  }

  async resetPassword(data) {
    try {
      // Get security key
      const key = await redisGetAsync(data.key);
      console.log("KEY: ", key);
      if (!key) {
        return {
          error: true,
          message: "Unauthorized",
          data: null,
        };
      } else {
        const user = await this.loginRepository.findOne({
          user_id: String(data.key),
        });
        if (!user) {
          return {
            error: true,
            message: `This ${data.channel} does not exist`,
            data: null,
          };
        } else {
          const newPassword = hashPassword(String(data.new_password));
          console.log(user);
          // update login record details
          await this.loginRepository.update(
            { user_id: String(data.key) },
            { password: newPassword }
          );
          // Send password reset successful mail
          // send mail
          const Data = {
            first_name: user.username,
            email: user.email,
          };
          await axios.post (
            `${KEYS.NOTIFICATION_URI}/notifications/v1/user/password-reset-successful`,
            Data
          );
      // publish to queue TODO::::::======
          return {
            error: false,
            message: "Password reset successfully",
          };
        }
      }
    } catch (err) {
      console.log(err);
      return {
        error: true,
        message: "Unable To Reset Password at The Moment",
        data: err,
      };
    }
  }

  async changePassword(id, data) {
    try {
      console.log("AUTH_ID :", id);
      if (data.old_password === data.new_password) {
        return {
          error: false,
          message: "No action. Old password and new password are the same",
          data: null,
        };
      }
      //   check if old password is correct
      const user = await this.loginRepository.findOne ({user_id: id});
      const passwordMatch = await comparePassword (
        user.password,
        data.old_password
      );
      if (!passwordMatch) {
        return {
          error: true,
          message: "Old password is invalid",
        };
      }
      const newPassword = hashPassword(data.new_password);
      //   update login record
      const updatedRecord = await this.loginRepository.update (
        {user_id: id},
        {password: newPassword}
      );
      return {
        error: false,
        message: "Password changed successfully",
        data: null,
      };
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = PasswordService;
