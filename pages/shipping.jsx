import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { Store } from "../utils/Store";
import Layout from "../components/Layout";

import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

export default function Shipping() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  console.log(errors);

  useEffect(() => {
    if (!userInfo) {
      router.push("/login?redirect=/shipping");
    }
    setValue("name", userInfo.name);
    setValue("email", userInfo.email);
    setValue("address", shippingAddress.address);
    setValue("city", shippingAddress.city);
    setValue("postalCode", shippingAddress.postalCode);
    setValue("state", shippingAddress.state);
    setValue("country", shippingAddress.country);
    setValue("payment", shippingAddress.payment);
  }, []);

  const submitHandler = ({
    fullName,
    address,
    city,
    postalCode,
    state,
    country,
    payment,
  }) => {
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { fullName, address, city, postalCode, country, state, payment },
    });
    Cookies.set(
      "shippingAddress",
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
        state,
        payment,
      })
    );
    router.push("/payment");
  };

  return (
    <Layout>
      <div className="mt-14 mb-24">
        <form onSubmit={handleSubmit(submitHandler)}>
          <div>
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <div className="px-4 sm:px-0">
                  <h3 className="text-xl font-extrabold text-gray-900">
                    Contact information
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    This information will be displayed publicly so be careful
                    what you share.
                  </p>
                </div>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div>
                  <div className="shadow sm:rounded-md sm:overflow-hidden">
                    <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                      <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-3 sm:col-span-2">
                          <label
                            htmlFor="company-website"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Email adress
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <input
                              type="text"
                              required
                              className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                              placeholder="example@gmail.com"
                              {...register("email", {
                                required: true,
                                pattern: /^\S+@\S+$/i,
                              })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden sm:block" aria-hidden="true">
            <div className="py-5">
              <div className="border-t border-gray-200" />
            </div>
          </div>

          <div className="mt-10 sm:mt-0">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <div className="px-4 sm:px-0">
                  <h3 className="text-xl font-extrabold text-gray-900">
                    Shipping information
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Use a permanent address where you can receive mail.
                  </p>
                </div>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div action="#" method="POST">
                  <div className="shadow overflow-hidden sm:rounded-md">
                    <div className="px-4 py-5 bg-white sm:p-6">
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Full name
                          </label>
                          <input
                            type="text"
                            required
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            placeholder=""
                            {...register("name", {
                              required: true,
                              maxLength: 16,
                            })}
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="country"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Country
                          </label>

                          <select
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            {...register("country", { required: true })}
                          >
                            <option value="United States">United States</option>
                            <option value="Canada"> Canada</option>
                            <option value="Argentina"> Argentina</option>
                          </select>
                        </div>

                        <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                          <label
                            htmlFor="city"
                            className="block text-sm font-medium text-gray-700"
                          >
                            City
                          </label>
                          <input
                            required
                            type="text"
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            placeholder=""
                            {...register("city", {
                              required: true,
                              min: 6,
                              maxLength: 80,
                            })}
                          />
                        </div>

                        <div className="col-span-6">
                          <label
                            htmlFor="street-address"
                            className="block text-sm font-medium text-gray-700"
                          >
                            State / Province
                          </label>
                          <input
                            required
                            type="text"
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            placeholder=""
                            {...register("state", {
                              required: true,
                              min: 6,
                            })}
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                          <label
                            htmlFor="region"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Street address
                          </label>
                          <input
                            required
                            type="text"
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            placeholder=""
                            {...register("address", { required: true, min: 6 })}
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                          <label
                            htmlFor="postal-code"
                            className="block text-sm font-medium text-gray-700"
                          >
                            ZIP / Postal code
                          </label>
                          <input
                            required
                            type="text"
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            placeholder=""
                            {...register("postalCode", {
                              required: true,
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden sm:block" aria-hidden="true">
            <div className="py-5">
              <div className="border-t border-gray-200" />
            </div>
          </div>

          <div className="mt-10 sm:mt-0">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <div className="px-4 sm:px-0">
                  <h3 className="text-xl font-extrabold text-gray-900">
                    Payment information
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Decide which communications you'd like to receive and how.
                  </p>
                </div>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div action="#" method="POST">
                  <div className="shadow overflow-hidden sm:rounded-md">
                    <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                      <fieldset>
                        <div>
                          <legend className="text-base font-medium text-gray-900">
                            Payment method
                          </legend>
                          <p className="text-sm text-gray-500">
                            These are delivered via SMS to your mobile phone.
                          </p>
                        </div>
                        <div className="mt-4 space-y-4">
                          <div className="flex items-center">
                            <input
                              {...register}
                              type="radio"
                              required
                              name="push-notifications"
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                              value="Paypal"
                            />
                            <label
                              htmlFor="push-everything"
                              className="ml-3 block text-sm font-medium text-gray-700"
                            >
                              Paypal
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              {...register}
                              type="radio"
                              required
                              name="push-notifications"
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                              value="Stripe"
                            />
                            <label
                              htmlFor="push-email"
                              className="ml-3 block text-sm font-medium text-gray-700"
                            >
                              Stripe
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              {...register}
                              type="radio"
                              required
                              name="push-notifications"
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                              value="Cash"
                            />
                            <label
                              htmlFor="push-nothing"
                              className="ml-3 block text-sm font-medium text-gray-700"
                            >
                              Cash
                            </label>
                          </div>
                        </div>
                      </fieldset>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
