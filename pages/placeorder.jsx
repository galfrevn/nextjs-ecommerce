import React, { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Layout from "../components/Layout";
import { Store } from "../utils/Store";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import Heading from "../components/Heading";
import { getError } from "../utils/error";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";

import { BadgeCheckIcon } from "@heroicons/react/outline";

function PlaceOrder() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    cart: { cartItems, shippingAddress },
  } = state;
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.price * c.quantity, 0)
  );
  const totalPrice = round2(itemsPrice);

  useEffect(() => {
    if (cartItems == 0) {
      router.push("/");
    }
  }, []);

  const placeOrderHandler = async () => {
    const toastId = toast.loading("Procesing your order");
    try {
      const { data } = await axios.post(
        "/api/orders",
        {
          orderOItems: cartItems,
          shippingAddress,
          itemsPrice,
          totalPrice
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: "CART_CLEAR" });
      Cookies.remove("cartItems");
      toast.success("Order successfully created", {
        id: toastId,
      });
      router.push(`/order/${data._id}`);
    } catch (err) {
      toast.error(getError(err), {
        id: toastId,
      });
    }
  };

  return (
    <Layout>
      <Toaster
        toastOptions={{
          className: "text-xs",
        }}
      />

      <Heading />
      <div className="mt-6 mb-24 max-w-7xl mx-auto ">
        <div className="h-full flex flex-col bg-white shadow-sm ">
          <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
            <div className="flex items-start justify-between">
              <h1 className="text-lg font-extrabold text-gray-800">
                Shopping cart
              </h1>
              <div className="ml-3 h-7 flex items-center">
                <button
                  type="button"
                  className="-m-2 p-1.5 text-green-700 bg-green-100 rounded-full hover:text-gray-500"
                >
                  <span className="sr-only">Close panel</span>
                  <BadgeCheckIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="mt-8 z-50">
              <div className="flow-root">
                <ul role="list" className="-my-6 divide-y divide-gray-200">
                  {cartItems.map((product) => (
                    <li key={product.name.toLowerCase()} className="py-6 flex">
                      <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                        <img
                          src={product.image1}
                          alt={product.name}
                          className="w-full h-full object-center object-cover"
                        />
                      </div>

                      <div className="ml-4 flex-1 flex flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>
                              <Link href={`/product/${product.slug}`}>
                                {product.name}
                              </Link>
                            </h3>
                            <p className="ml-4">
                              ${product.price * product.quantity}
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {product.description}
                          </p>
                        </div>
                        <div className="flex-1 flex items-end justify-between text-sm">
                          <p className="text-gray-500">
                            Quantity: <strong> {product.quantity}</strong>{" "}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>${cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              Shipping and taxes calculated at checkout.
            </p>
          </div>

          <div className="mt-6">
            <button onClick={placeOrderHandler}>
              <a className="flex justify-center items-center px-6 py-3 border cursor-pointer border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                Continue paying
              </a>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(PlaceOrder), { ssr: false });
