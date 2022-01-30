/* eslint-disable @next/next/link-passhref */
import React, { useEffect, useContext, useReducer } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { getError } from "../utils/error";
import { Store } from "../utils/Store";
import Layout from "../components/Layout";
import dynamic from 'next/dynamic'

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, orders: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

function Profile() {
  const { state } = useContext(Store);
  const router = useRouter();
  const { userInfo } = state;

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: "",
  });

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }

    console.log(userInfo.token);

    const fetchOrders = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/history`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchOrders();
  }, [router, userInfo]);

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
          <div className="flex flex-col xl:flex-row justify-start items-start xl:space-y-0 xl:space-x-8">
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
                Your orders history
              </h3>

              <div className="flex text-xs text-gray-800">
                <p>Total orders: </p>{" "}
                <span className="text-indigo-600 font-semibold ml-1">
                  {orders.length}
                </span>
              </div>

              <div className="flex justify-center items-center w-full mt-8 flex-col ">
                {orders.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-center py-3.5 border-b items-center w-full"
                  >
                    <div className="md:w-24 w-36 grid grid-cols-2 grid-rows-2 gap-1 bg-gray-50">
                      {item.orderItems.map((img) => (
                        <Image
                          layout="responsive"
                          width="100%"
                          height="100%"
                          key={img.name}
                          className="rounded-md  md:block"
                          src={img.image1}
                          alt={img.name}
                        />
                      ))}
                    </div>
                    <div className="flex h-full items-start flex-col w-full px-4 ">
                      <div className="flex flex-col md:flex-shrink-0 justify-start items-start">
                        <Link href={`/order/${item._id}`} >
                          <h3 className="text-left cursor-pointer font-bold text-sm text-gray-800">
                            Order #{item._id.slice(0, 10)}
                          </h3>
                        </Link>
                        <div className="flex text-xs flex-col justify-start items-start mt-1 ">
                          <p className=" leading-none text-gray-600">
                            Buyed items:
                            <span className="text-indigo-600 font-semibold ml-1">
                              {item.orderItems.length}
                            </span>
                          </p>
                          <p className=" leading-none mt-1 text-gray-600">
                            Order date:
                            <span className="ml-1">
                              {item.createdAt.slice(0, 10)}
                            </span>
                          </p>
                          <p className=" leading-none mt-2 text-gray-600">
                            Buyed items:
                            <span className="text-indigo-600 font-semibold ml-1">
                              ${item.totalPrice}.00
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Profile), { ssr: false });