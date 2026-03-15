import React from 'react';
import { Link } from 'react-router-dom';
import { PartyPopperIcon } from 'lucide-react';

export function NotFoundPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-24 h-24 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-6">
          <PartyPopperIcon className="w-12 h-12 text-brand-blue" />
        </div>
        <h1 className="font-heading font-extrabold text-6xl text-brand-navy mb-4">404</h1>
        <h2 className="font-heading font-bold text-2xl text-brand-navy mb-3">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Looks like this page went on a party of its own. Let's get you back to the fun!
        </p>
        <Link
          to="/"
          className="inline-block px-8 py-4 bg-gradient-brand text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}