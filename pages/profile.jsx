import React, { useEffect, useContext, useReducer } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import dynamic from "next/dynamic";
import { getError } from "../utils/error";
import { Store } from "../utils/Store";
import Layout from "../components/Layout";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";

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

const people = [
  {
    name: "Jane Cooper",
    title: "Regional Paradigm Technician",
    department: "Optimization",
    role: "Admin",
    email: "jane.cooper@example.com",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
  },
  // More people...
];

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
  }, []);

  return (
    <div>
      <Layout>
        {loading ? (
          <div className="max-w-4xl pt-10 w-full h-full mx-auto">
            <Skeleton count={5} />
          </div>
        ) : (
          <div>
            {orders.map((o) => (
              <div>
                <h1>{o.totalPrice} </h1>
                <h1>{o.isPaid ? 'true' : 'false'} </h1>
                <h1>{o.createdAt} </h1>
                <h1>{o.user} </h1>
              </div>
            ))}
          </div>
        )}
      </Layout>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Profile), { ssr: false });
