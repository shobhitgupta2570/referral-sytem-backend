import { User } from '../models/user.model.js';
import { Earning } from '../models/earning.model.js';
import { Notification } from '../models/notification.model.js';
import { io } from '../app.js';

const handleEarnings = async (referredUserId, purchaseAmount) => {
  if (purchaseAmount <= 1000) return;

  const referredUser = await User.findById(referredUserId);
  if (!referredUser) throw new Error('Referred user not found');

  const parentUser = await User.findById(referredUser.parentId);

  if (!parentUser) {
    console.log('No parent user found. Purchase made without a referral.');
    return;
  }

  const directEarning = purchaseAmount * 0.05;
  const updatedParentUser = await User.findByIdAndUpdate(
    parentUser._id,
    { $inc: { totalEarnings: directEarning } },
    { new: true }
  );

  const directEarningRecord = new Earning({
    userId: parentUser._id,
    amount: directEarning,
    level: 1
  });
  await directEarningRecord.save();

  const notification = new Notification({
    userId: parentUser._id,
    message: `You earned Rs. ${directEarning.toFixed(2)} from a referral!`,
  });
  await notification.save();

  console.log(`Emitting updateEarnings for user ${parentUser.email}`);
  io.to(parentUser.email).emit('updateEarnings', {
    totalEarnings: updatedParentUser.totalEarnings,
    message: `You earned Rs. ${directEarning.toFixed(2)} from a referral!`
  });

  io.to(parentUser.email).emit('newNotification', notification);

  if (parentUser.parentId) {
    const grandParentUser = await User.findById(parentUser.parentId);
    if (grandParentUser) {
      const indirectEarning = purchaseAmount * 0.01;
      const updatedGrandParentUser = await User.findByIdAndUpdate(
        grandParentUser._id,
        { $inc: { totalEarnings: indirectEarning } },
        { new: true }
      );

      const indirectEarningRecord = new Earning({
        userId: grandParentUser._id,
        amount: indirectEarning,
        level: 2
      });
      await indirectEarningRecord.save();

      const notification = new Notification({
        userId: grandParentUser._id,
        message: `You earned Rs. ${indirectEarning.toFixed(2)} from an indirect referral!`,
      });
      await notification.save();

      console.log(`Emitting updateEarnings for user ${grandParentUser.email}`);
      io.to(grandParentUser.email).emit('updateEarnings', {
        totalEarnings: updatedGrandParentUser.totalEarnings,
        message: `You earned Rs. ${indirectEarning.toFixed(2)} from an indirect referral!`
      });

      io.to(grandParentUser.email).emit('newNotification', notification);
    }
  }
};

export { handleEarnings };







// import { User } from '../models/user.model.js';
// import { Earning } from '../models/earning.model.js';
// import { Notification } from '../models/notification.model.js';
// import { io } from '../app.js';

// const handleEarnings = async (referredUserId, purchaseAmount) => {
//   if (purchaseAmount <= 1000) return;

//   const referredUser = await User.findById(referredUserId);
//   if (!referredUser) throw new Error('Referred user not found');

//   const parentUser = await User.findById(referredUser.parentId);

//   if (!parentUser) {
//     console.log('No parent user found. Purchase made without a referral.');
//     return;
//   }

//   const directEarning = purchaseAmount * 0.05;
//   const updatedParentUser = await User.findByIdAndUpdate(
//     parentUser._id,
//     { $inc: { totalEarnings: directEarning } },
//     { new: true }
//   );

//   const directEarningRecord = new Earning({
//     userId: parentUser._id,
//     amount: directEarning,
//     level: 1
//   });
//   await directEarningRecord.save();

//   const notification = new Notification({
//     userId: parentUser._id,
//     message: `You earned Rs. ${directEarning.toFixed(2)} from a referral!`,
//   });
//   await notification.save();

//   console.log(`Emitting updateEarnings for user ${parentUser.email}`);
//   io.to(parentUser.email).emit('updateEarnings', {
//     totalEarnings: updatedParentUser.totalEarnings,
//     message: `You earned Rs. ${directEarning.toFixed(2)} from a referral!`
//   });

//   if (parentUser.parentId) {
//     const grandParentUser = await User.findById(parentUser.parentId);
//     if (grandParentUser) {
//       const indirectEarning = purchaseAmount * 0.01;
//       const updatedGrandParentUser = await User.findByIdAndUpdate(
//         grandParentUser._id,
//         { $inc: { totalEarnings: indirectEarning } },
//         { new: true }
//       );

//       const indirectEarningRecord = new Earning({
//         userId: grandParentUser._id,
//         amount: indirectEarning,
//         level: 2
//       });
//       await indirectEarningRecord.save();

//       const notification = new Notification({
//         userId: grandParentUser._id,
//         message: `You earned Rs. ${indirectEarning.toFixed(2)} from an indirect referral!`,
//       });
//       await notification.save();

//       console.log(`Emitting updateEarnings for user ${grandParentUser.email}`);
//       io.to(grandParentUser.email).emit('updateEarnings', {
//         totalEarnings: updatedGrandParentUser.totalEarnings,
//         message: `You earned Rs. ${indirectEarning.toFixed(2)} from an indirect referral!`
//       });
//     }
//   }
// };

// export { handleEarnings };








// import { User } from '../models/user.model.js';
// import { Earning } from '../models/earning.model.js';
// import { io } from '../app.js';

// const handleEarnings = async (referredUserId, purchaseAmount) => {
//   if (purchaseAmount <= 1000) return;

//   const referredUser = await User.findById(referredUserId);
//   if (!referredUser) throw new Error('Referred user not found');

//   const parentUser = await User.findById(referredUser.parentId);

//   if (!parentUser) {
//     console.log('No parent user found. Purchase made without a referral.');
//     return;
//   }

//   const directEarning = purchaseAmount * 0.05;
//   const updatedParentUser = await User.findByIdAndUpdate(
//     parentUser._id,
//     { $inc: { totalEarnings: directEarning } },
//     { new: true }
//   );

//   const directEarningRecord = new Earning({
//     userId: parentUser._id,
//     amount: directEarning,
//     level: 1
//   });
//   await directEarningRecord.save();

//   console.log(`Emitting updateEarnings for user ${parentUser.email}`);
//   io.to(parentUser.email).emit('updateEarnings', {
//     totalEarnings: updatedParentUser.totalEarnings,
//     message: `You earned Rs. ${directEarning.toFixed(2)} from a referral!`
//   });

//   if (parentUser.parentId) {
//     const grandParentUser = await User.findById(parentUser.parentId);
//     if (grandParentUser) {
//       const indirectEarning = purchaseAmount * 0.01;
//       const updatedGrandParentUser = await User.findByIdAndUpdate(
//         grandParentUser._id,
//         { $inc: { totalEarnings: indirectEarning } },
//         { new: true }
//       );

//       const indirectEarningRecord = new Earning({
//         userId: grandParentUser._id,
//         amount: indirectEarning,
//         level: 2
//       });
//       await indirectEarningRecord.save();

//       console.log(`Emitting updateEarnings for user ${grandParentUser.email}`);
//       io.to(grandParentUser.email).emit('updateEarnings', {
//         totalEarnings: updatedGrandParentUser.totalEarnings,
//         message: `You earned Rs. ${indirectEarning.toFixed(2)} from an indirect referral!`
//       });
//     }
//   }
// };

// export { handleEarnings };



// import { User } from '../models/user.model.js';
// import { Earning } from '../models/earning.model.js';
// import { io } from '../app.js';

// const handleEarnings = async (referredUserId, purchaseAmount) => {
//   if (purchaseAmount <= 1000) return;

//   const referredUser = await User.findById(referredUserId);
//   if (!referredUser) throw new Error('Referred user not found');

//   const parentUser = await User.findById(referredUser.parentId);

//   if (!parentUser) {
//     console.log('No parent user found. Purchase made without a referral.');
//     return;
//   }

//   const directEarning = purchaseAmount * 0.05;
//   const updatedParentUser = await User.findByIdAndUpdate(
//     parentUser._id,
//     { $inc: { totalEarnings: directEarning } },
//     { new: true }
//   );

//   const directEarningRecord = new Earning({
//     userId: parentUser._id,
//     amount: directEarning,
//     level: 1
//   });
//   await directEarningRecord.save();

//   console.log(`Emitting updateEarnings for user ${parentUser._id}`);
//   io.to(parentUser._id.toString()).emit('updateEarnings', {
//     totalEarnings: updatedParentUser.totalEarnings,
//     message: `You earned Rs. ${directEarning.toFixed(2)} from a referral!`
//   });

//   if (parentUser.parentId) {
//     const grandParentUser = await User.findById(parentUser.parentId);
//     if (grandParentUser) {
//       const indirectEarning = purchaseAmount * 0.01;
//       const updatedGrandParentUser = await User.findByIdAndUpdate(
//         grandParentUser._id,
//         { $inc: { totalEarnings: indirectEarning } },
//         { new: true }
//       );

//       const indirectEarningRecord = new Earning({
//         userId: grandParentUser._id,
//         amount: indirectEarning,
//         level: 2
//       });
//       await indirectEarningRecord.save();

//       console.log(`Emitting updateEarnings for user ${grandParentUser._id}`);
//       io.to(grandParentUser._id.toString()).emit('updateEarnings', {
//         totalEarnings: updatedGrandParentUser.totalEarnings,
//         message: `You earned Rs. ${indirectEarning.toFixed(2)} from an indirect referral!`
//       });
//     }
//   }
// };

// export { handleEarnings };


// import { User } from '../models/user.model.js';
// import { Earning } from '../models/earning.model.js';
// import { io } from '../app.js';

// const handleEarnings = async (referredUserId, purchaseAmount) => {
//   if (typeof purchaseAmount !== 'number' || purchaseAmount <= 1000) return;

//   try {
//     const referredUser = await User.findById(referredUserId);
//     if (!referredUser) throw new Error('Referred user not found');

//     const parentUser = await User.findById(referredUser.parentId);
//     if (!parentUser) {
//       console.log('No parent user found. Purchase made without a referral.');
//       return;
//     }

//     const directEarning = purchaseAmount * 0.05;
//     const updatedParentUser = await User.findByIdAndUpdate(
//       parentUser._id,
//       { $inc: { totalEarnings: directEarning } },
//       { new: true }
//     );

//     await new Earning({
//       userId: parentUser._id,
//       amount: directEarning,
//       level: 1
//     }).save();

//     if (io.sockets.adapter.rooms.get(parentUser._id.toString())) {
//       io.to(parentUser._id.toString()).emit('updateEarnings', {
//         totalEarnings: updatedParentUser.totalEarnings,
//         message: `You earned Rs. ${directEarning.toFixed(2)} from a referral!`
//       });
//     }

//     if (parentUser.parentId) {
//       const grandParentUser = await User.findById(parentUser.parentId);
//       if (grandParentUser) {
//         const indirectEarning = purchaseAmount * 0.01;
//         const updatedGrandParentUser = await User.findByIdAndUpdate(
//           grandParentUser._id,
//           { $inc: { totalEarnings: indirectEarning } },
//           { new: true }
//         );

//         await new Earning({
//           userId: grandParentUser._id,
//           amount: indirectEarning,
//           level: 2
//         }).save();

//         if (io.sockets.adapter.rooms.get(grandParentUser._id.toString())) {
//           io.to(grandParentUser._id.toString()).emit('updateEarnings', {
//             totalEarnings: updatedGrandParentUser.totalEarnings,
//             message: `You earned Rs. ${indirectEarning.toFixed(2)} from an indirect referral!`
//           });
//         }
//       }
//     }
//   } catch (error) {
//     console.error(`Error in handleEarnings:`, error);
//   }
// };

// export { handleEarnings };

