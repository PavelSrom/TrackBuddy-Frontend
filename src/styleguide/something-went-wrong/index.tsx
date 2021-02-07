import React from 'react'

export const SomethingWentWrong: React.FC = () => (
  <div className="w-full text-center bg-transparent">
    <img
      src="/images/server-down.svg"
      alt="error"
      className="max-w-full h-auto"
    />
    <p className="text-xl font-semibold mt-4">
      Oops! Looks like we&apos;re having problems...
    </p>
    <p className="mt-2 text-base">We apologize for the inconvenience.</p>
  </div>
)
