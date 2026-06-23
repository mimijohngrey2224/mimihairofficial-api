const {v4: uuidv4} = require("uuid")
const Cart = require("../models/cart")
const Order = require("../models/order"); // ✅ ADD THIS

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY

exports.initiatepayment = async(req, res)=>{
    const {user} = req
    const {amount, currency} = req.body

    try {
        const cart = await Cart.findOne({user: user.id}).populate("products.product")
        if (!cart || cart.products.length === 0) {
            res.json("Your cart is empty")
        }

        // const orderId = uuid()
        const orderId = uuidv4()

        const paymentData = {
            tx_ref: orderId,
            amount, 
            currency,
            // redirect_url: "http://localhost:5173/thankyou",
            redirect_url: `http://localhost:5173/thankyou?tx_ref=${orderId}`,
            customer: {
            email: user.email,
            name: `${user.firstName} ${user.lastName}`
        },
         customization: {
            title: "Mimihairofficial Purchase",
            description: "Payment for items in cart"   
        }
        
        }

        const flwRes = await fetch("https://api.flutterwave.com/v3/payments", {
            method: "POST",
            headers: {
                 Authorization: `Bearer ${FLW_SECRET_KEY}`,
            "Content-Type": "application/json"
            },
            body: JSON.stringify(paymentData)
           
        })

        const data = await flwRes.json()
        if (data.status === "success") {
            res.json({link: data.data.link, orderId})
        }else{
            res.json("Payment Initiation Failed")
        }
        
    } catch (error) {
        res.json("server error")
        console.log(error);
        
    }
};

// exports.verifyPayment = async (req, res) =>{
//     const { transaction_id, orderId } = req.body;
//     const user = req.user.id;

//     try {
//         const response = await fetch(
//             `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
//             {
//                 method: "GET",
//                 headers: {
//                     Authorization: `Bearer ${FLW_SECRET_KEY}`, 
//                 },
//             }
//         );

//         const data = await response.json();
//         if (data.status === "success") {
//             const cart = await Cart.findOne({ user: req.user.id }).populate(
//                 "products.product"
//             );

//             const order = new Order({
//                 lastName: data.data.meta.lastName,
//                 phone: data.data.meta.phone,
//                 address: data.data.meta.address,
//                 products: cart.products,
//                 amount: data.data.amount,
//                 status: "completed",
//                 transactionId: transaction_id,
//             });

//             await order.save();
//             await Cart.findOneAndDelete({ user: req.user.id });

//             res.json({ msg: "Payment Successful", order });
//         }else {
//             res.json({ msg: "Payment verification failed" });
//         }
//     } catch (error) {
//         console.error(error.message);
//     }
// };





exports.verifyPayment = async (req, res) => {
  const { transaction_id } = req.body;

  try {
    const response = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${FLW_SECRET_KEY}`,
        },
      }
    );

    const data = await response.json();

    // if (data.status === "success") {
    //   const cart = await Cart.findOne({ user: req.user.id }).populate(
    //     "products.product"
    //   );

            if (
        data.status === "success" &&
        data.data.status === "successful"
        ) {
        const cart = await Cart.findOne({ user: req.user.id }).populate(
            "products.product"
        );

      if (!cart) {
        return res.json({ msg: "Cart not found" });
      }

      const order = new Order({
        user: req.user.id,
        lastName: data.data?.meta?.lastName || "",
        phone: data.data?.meta?.phone || "",
        address: data.data?.meta?.address || "",
        products: cart.products,
        amount: data.data.amount,
        status: "completed",
        transactionId: transaction_id,
        
        // ✅ ADD THIS
        date: new Date(),
      });

      await order.save();

      // ✅ Clear cart ONLY after success
      await Cart.findOneAndDelete({ user: req.user.id });

      return res.json({ msg: "Payment Successful", order });
    } else {
      return res.json({ msg: "Payment verification failed" });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "Server error" });
  }
};
