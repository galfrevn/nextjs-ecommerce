import { Fragment, useContext } from "react";
import {
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  CurrencyDollarIcon,
  LinkIcon,
  LocationMarkerIcon,
  PencilIcon,
} from "@heroicons/react/solid";
import { Menu, Transition } from "@headlessui/react";
import { Store } from "../utils/Store";
import { CashIcon, MapIcon, SunIcon } from "@heroicons/react/outline";
import Moment from "react-moment";
import Link from "next/link";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Heading() {
  const { state, dispatch } = useContext(Store);
  const {
    cart: { shippingAddress },
  } = state;

  return (
    <div className="lg:flex lg:items-center max-w-7xl mx-auto lg:justify-between mt-10 ">
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Place your order
        </h2>
        <p className="text-sm text-gray-400 mb-3" >Please, check your information</p>
        <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
          <div className="mt-2 flex items-center text-sm text-gray-800">
            <MapIcon
              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-800"
              aria-hidden="true"
            />
            {shippingAddress.state}
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-800">
            <LocationMarkerIcon
              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-800"
              aria-hidden="true"
            />
            {shippingAddress.city} ({shippingAddress.postalCode})
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-800">
            <SunIcon
              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-800"
              aria-hidden="true"
            />
            {shippingAddress.address}
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-800">
            <CalendarIcon
              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-800"
              aria-hidden="true"
            />
            <Moment interval={0} format="DD/MM/YYYY">
              {Date.now()}
            </Moment>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-800">
            <CashIcon
              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-800"
              aria-hidden="true"
            />
            {shippingAddress.payment}
          </div>
        </div>
      </div>
      <div className="mt-5 flex lg:mt-0 -ml-3">
        <span className="hidden sm:block">
          <Link href="/shipping">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PencilIcon
                className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                aria-hidden="true"
              />
              Edit
            </button>
          </Link>
        </span>

        {/* Dropdown */}
        <Menu as="span" className="ml-3 relative sm:hidden">
          <Menu.Button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            More
            <ChevronDownIcon
              className="-mr-1 ml-2 h-5 w-5 text-gray-500"
              aria-hidden="true"
            />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="origin-top-left absolute left-0 mt-2 -mr-1 w-42 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <Link href="/shipping">
                    <a
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm text-gray-700"
                      )}
                    >
                      Edit
                    </a>
                  </Link>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}
