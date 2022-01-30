// React
import React, { useContext, useEffect, useReducer } from "react";
import Image from "next/image";
import Layout from "../../components/Layout";
import axios from "axios";
import { Store } from "../../utils/Store";
import { useRouter } from "next/router";
import { getError } from "../../utils/error";
import toast, { Toaster } from "react-hot-toast";

// Loading
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Paypal
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import dynamic from "next/dynamic";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false, errorPay: action.payload };
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false, errorPay: "" };
    default:
      state;
  }
}

function Order({ params }) {
  const orderId = params.id;
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, order, successPay }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      order: {},
      error: "",
    }
  );

  const {
    shippingAddress,
    orderItems,
    itemsPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  useEffect(() => {
    if (!userInfo) {
      return router.push("/login");
    }
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get("/api/keys/paypal", {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      loadPaypalScript();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, successPay]);

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      const toastId = toast.loading("Procesing payment");
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "PAY_SUCCESS", payload: data });
        toast.success("Payment successul!", {
          id: toastId,
        });
      } catch (err) {
        dispatch({ type: "PAY_FAIL", payload: getError(err) });
        toast.error(
          { err },
          {
            id: toastId,
          }
        );
      }
    });
  }

  function onError(err) {
    toast.error({ err });
  }

  return (
    <Layout>
      <Toaster
        toastOptions={{
          className: "text-xs",
        }}
      />

      {loading ? (
        <div className="max-w-4xl pt-10 w-full h-full mx-auto">
          <Skeleton count={5} />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto py-14 mb-10 ">
          <div className="flex flex-col xl:flex-row justify-start items-start space-y-10 xl:space-y-0 xl:space-x-8">
            {/* Image */}
            <div className="w-full ">
              <div className="w-full hidden xl:block">
                <Image
                  layout="responsive"
                  width="100%"
                  height="200"
                  className="object-cover"
                  src="https://images.unsplash.com/photo-1601985705806-5b9a71f6004f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                  alt="wardrobe "
                />
              </div>
              <div className="w-full hidden md:block xl:hidden">
                <Image
                  layout="responsive"
                  height="40%"
                  width="100%"
                  className="object-cover"
                  src="https://images.unsplash.com/photo-1477554193778-9562c28588c0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                  alt="wardrobe "
                />
              </div>

              <div className="full md:hidden">
                <Image
                  layout="responsive"
                  height="60%"
                  width="100%"
                  className="object-cover"
                  src="https://images.unsplash.com/photo-1521334884684-d80222895322?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                  alt="wardrobe "
                />
              </div>
            </div>

            {/* Right */}
            <div className="flex justify-center flex-col items-start w-full  xl:w-full ">
              <h3 className="w-full text-left font-bold text-2xl text-gray-800">
                Order Summary
              </h3>
              {!isPaid ? (
                <div className="flex text-xs text-gray-800">
                  <p>Ready to pay using </p>{" "}
                  <span className="ml-1.5 font-semibold text-indigo-600 ">
                    {shippingAddress.payment}{" "}
                  </span>
                </div>
              ) : (
                <div className="flex text-xs text-gray-800">
                  <p>Paid using </p>{" "}
                  <span className="mx-1.5 font-semibold text-indigo-600 ">
                    {shippingAddress.payment}{" "}
                  </span>{" "}
                  <p>at </p>{" "}
                  <span className="ml-1.5 font-semibold text-indigo-600 ">
                    {paidAt}{" "}
                  </span>
                </div>
              )}
              <div className="flex justify-center items-center w-full mt-8  flex-col space-y-4 ">
                {orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex md:flex-row justify-start items-start md:items-center w-full"
                  >
                    <div className="md:w-24 w-36">
                      <Image
                        layout="responsive"
                        width="100%"
                        height="100%"
                        className="rounded-md md:block"
                        src={item.image1}
                        alt={item.name}
                      />
                    </div>
                    <div className="flex justify-start md:justify-between items-start md:items-center flex-col md:flex-row w-full px-4 ">
                      <div className="flex flex-col md:flex-shrink-0 justify-start items-start">
                        <h3 className="text-left font-bold text-xl text-gray-800">
                          {item.name}
                        </h3>
                        <div className="flex flex-row justify-start space-x-4 md:space-x-6 items-start mt-1 ">
                          <p className="text-sm leading-none text-gray-600">
                            Size: <span className="text-gray-800"> Small</span>
                          </p>
                          <p className="text-sm leading-none text-gray-600">
                            Quantity:{" "}
                            <span className="text-gray-800">
                              {" "}
                              {item.quantity}{" "}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex mt-4 md:mt-0 md:justify-end items-center w-full ">
                        <p className="text-sm font-semibold text-gray-800">
                          ${item.price}.00
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col justify-start items-start mt-8 xl:mt-10 space-y-10 w-full">
                <div className="flex justify-start items-start flex-col md:flex-row  w-full md:w-auto space-y-8 md:space-y-0 md:space-x-14 xl:space-x-8  lg:w-full">
                  <div className="flex jusitfy-start items-start flex-col space-y-2">
                    <p className="font-semibold leading-4 text-gray-800">
                      Billing Address
                    </p>
                    <p className="text-sm leading-5 text-gray-600">
                      {shippingAddress.country}, {shippingAddress.state}
                    </p>
                  </div>
                  <div className="flex jusitfy-start items-start flex-col space-y-2">
                    <p className="text-base font-semibold leading-4  text-gray-800">
                      Shipping Address
                    </p>
                    <p className="text-sm leading-5 text-gray-600">
                      {shippingAddress.city}, {shippingAddress.address}
                    </p>
                  </div>
                  <div className="flex jusitfy-start items-start flex-col space-y-2">
                    <p className="text-base font-semibold leading-4  text-gray-800">
                      Shipping Method
                    </p>
                    <p className="text-sm leading-5 text-gray-600">
                      OCA, Correo Argentino,
                    </p>
                  </div>
                </div>
                <div className="flex flex-col space-y-4 w-full">
                  <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                    <div className="flex justify-between  w-full">
                      <p className="text-base leading-4 text-gray-800">
                        Subtotal
                      </p>
                      <p className="text-base leading-4 text-gray-600">
                        ${itemsPrice}.00
                      </p>
                    </div>
                    <div className="flex justify-between  w-full">
                      <p className="text-base leading-4 text-gray-800">
                        Shipping
                      </p>
                      <p className="text-base leading-4 text-gray-600">
                        $10.00
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <p className="text-base font-semibold leading-4 text-gray-800">
                      Total
                    </p>
                    <p className="text-base font-semibold leading-4 text-gray-600">
                      ${totalPrice + 10}.00
                    </p>
                  </div>
                  {!isPaid ? (
                    <div>
                      {isPending ? (
                        <div className="max-w-4xl pt-10 w-full h-full mx-auto">
                          <Skeleton count={2} />
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                          ></PayPalButtons>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col text-center items-center">
                      <div className="bg-indigo-500 p-3 w-full mt-3 text-white rounded-md">
                        The order has been payed
                      </div>
                      <p className="text-xs mt-2">
                        Your order will be sent as soon as posible
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  return { props: { params } };
}

export default dynamic(() => Promise.resolve(Order), { ssr: false });