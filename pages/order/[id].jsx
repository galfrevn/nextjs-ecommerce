import React, { useContext, useEffect, useReducer, useState } from "react";
import dynamic from "next/dynamic";
import Layout from "../../components/Layout";
import { Store } from "../../utils/Store";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import Heading from "../../components/Heading";
import { getError } from "../../utils/error";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import { BadgeCheckIcon } from "@heroicons/react/outline";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
  });

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

  console.log(isPaid);

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
    if (!order._id || (order._id && order._id !== orderId)) {
      fetchOrder();
    }
  }, [order]);

  return (
    <Layout>
      {loading ? (
        <div className="max-w-4xl pt-10 w-full h-full mx-auto">
          <Skeleton count={5} />
        </div>
      ) : (
        <div className="2xl:container 2xl:mx-auto py-14 px-4 md:px-6 xl:px-20">
          <div className="flex flex-col xl:flex-row justify-center items-center space-y-10 xl:space-y-0 xl:space-x-8">
            <div className="w-full lg:w-9/12 xl:w-full">
              <img
                className="w-full hidden xl:block"
                src="https://i.ibb.co/RcMmXKc/Rectangle-19.png"
                alt="wardrobe "
              />
              <img
                className="w-full hidden md:block xl:hidden"
                src="https://i.ibb.co/ZhjHb0R/Rectangle-19-2.png"
                alt="wardrobe "
              />
              <img
                className="w-full md:hidden"
                src="https://i.ibb.co/sbV9CD2/Rectangle-19.png"
                alt="wardrobe "
              />
            </div>
            <div className="flex justify-center flex-col items-start w-full lg:w-9/12 xl:w-full ">
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
                  <div className="flex md:flex-row justify-start items-start md:items-center w-full">
                    <div className="w-40 md:w-32">
                      <img
                        className="rounded-md md:block"
                        src={item.image1}
                        alt={item.name}
                      />
                    </div>
                    <div className="flex justify-start md:justify-between items-start md:items-center  flex-col md:flex-row w-full p-4 md:px-8">
                      <div className="flex flex-col md:flex-shrink-0  justify-start items-start">
                        <h3 className="text-lg md:text-xl  w-full font-semibold leading-6 md:leading-5  text-gray-800">
                          {item.name}
                        </h3>
                        <div className="flex flex-row justify-start  space-x-4 md:space-x-6 items-start mt-4 ">
                          <p className="text-sm leading-none text-gray-600">
                            Size: <span className="text-gray-800"> Small</span>
                          </p>
                          <p className="text-sm leading-none text-gray-600">
                            Quantity: <span className="text-gray-800"> 01</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex mt-4 md:mt-0 md:justify-end items-center w-full ">
                        <p className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-gray-800">
                          $28.00
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col justify-start items-start mt-8 xl:mt-10 space-y-10 w-full">
                <div className="flex justify-start items-start flex-col md:flex-row  w-full md:w-auto space-y-8 md:space-y-0 md:space-x-14 xl:space-x-8  lg:w-full">
                  <div className="flex jusitfy-start items-start flex-col space-y-2">
                    <p className="text-base font-semibold leading-4  text-gray-800">
                      Billing Address
                    </p>
                    <p className="text-sm leading-5 text-gray-600">
                      180 North King Street, Northhampton MA 1060
                    </p>
                  </div>
                  <div className="flex jusitfy-start items-start flex-col space-y-2">
                    <p className="text-base font-semibold leading-4  text-gray-800">
                      Shipping Address
                    </p>
                    <p className="text-sm leading-5 text-gray-600">
                      180 North King Street, Northhampton MA 1060
                    </p>
                  </div>
                  <div className="flex jusitfy-start items-start flex-col space-y-2">
                    <p className="text-base font-semibold leading-4  text-gray-800">
                      Shipping Method
                    </p>
                    <p className="text-sm leading-5 text-gray-600">
                      DHL - Takes up to 3 working days
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
                        $56.00
                      </p>
                    </div>
                    <div className="flex justify-between  w-full">
                      <p className="text-base leading-4 text-gray-800">
                        Discount{" "}
                        <span className="bg-gray-200 p-1 text-xs font-medium leading-3  text-gray-800">
                          STUDENT
                        </span>
                      </p>
                      <p className="text-base leading-4 text-gray-600">
                        -$28.00 (50%)
                      </p>
                    </div>
                    <div className="flex justify-between  w-full">
                      <p className="text-base leading-4 text-gray-800">
                        Shipping
                      </p>
                      <p className="text-base leading-4 text-gray-600">$8.00</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <p className="text-base font-semibold leading-4 text-gray-800">
                      Total
                    </p>
                    <p className="text-base font-semibold leading-4 text-gray-600">
                      $36.00
                    </p>
                  </div>
                  <div className="flex w-full justify-center items-center pt-1 md:pt-4  xl:pt-8 space-y-6 md:space-y-8 flex-col">
                    <button className="py-5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800  w-full text-base font-medium leading-4 text-white bg-gray-800 hover:bg-black">
                      Track Your Order
                    </button>
                  </div>
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
