import React from 'react'

function ForgetPassword() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center items-center">
    <div className="w-11/12 sm:w-5/12 lg:w-4/12 xl:w-4/12 max-w-lg bg-white shadow sm:rounded-lg flex justify-center">
      <div className="w-full p-4 sm:p-8">
        <div>
          <img src={logo} className="max-w-full h-auto mx-auto" style={{ maxWidth: '100px' }} alt="Logo" />
        </div>
        <form className="mx-auto max-w-xs" onSubmit={verifyOtp}>
          <div className="mb-4">
            <input
              className="w-full px-6 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-xs focus:outline-none focus:border-gray-400 focus:bg-white mb-4"
              type="text"
              name="otp"
              placeholder="Enter Mail OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="mt-4 tracking-wide font-semibold bg-green-400 text-white w-full py-3 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
          >
            <span className="ml-2">Verify</span>
          </button>
          {message && <p className="text-red-500 mt-2">{message}</p>}
          <div className="flex justify-end mt-3">
            <Link to="/register">
              <button
                className="text-black hover:text-white bg-gray-400 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-green-100 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-green-100"
              >
                Back
              </button>
            </Link>
          </div>
        </form>
      </div>
      <div className="flex-1 bg-green-100 text-center hidden lg:flex">
                  <div
                      className="m-8 xl:m-12 w-[80%] bg-contain bg-center bg-no-repeat"
                  ></div>
              </div>
    </div>
  </div>
);
}
  

export default ForgetPassword