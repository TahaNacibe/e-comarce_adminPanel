"use client";

import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const NotFoundPage: React.FC = () => {
  // Constants
  const IMAGE_SIZE = 300;
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // Handlers
  const handleGoBack = () => window.history.back();

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col items-center justify-center px-6 py-12"
    >
      {/* Illustration */}
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="mb-12"
      >
        <Image
          src="/404_error.svg"
          alt="Page Not Found Illustration"
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}
          priority
          className="drop-shadow-xl"
        />
      </motion.div>

      {/* Content Container */}
      <motion.div 
        variants={itemVariants}
        className="text-center max-w-md"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-bold text-gray-900 mb-4"
        >
          Oops! Page Not Found
        </motion.h1>
        
        <motion.p
          variants={itemVariants}
          className="text-gray-600 mb-8 text-lg"
        >
          The page you're looking for doesn't exist or has been moved to a new address.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            onClick={handleGoBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto px-6 py-3 border border-gray-200 
                     rounded-lg text-gray-700 hover:bg-gray-50 
                     transition-colors duration-200 flex items-center 
                     justify-center gap-2 hover:border-gray-300 
                     hover:shadow-sm group"
          >
            <motion.div
              whileHover={{ x: -4 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <ArrowLeft className="h-4 w-4" />
            </motion.div>
            Go Back
          </motion.button>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 
                       text-white rounded-lg hover:bg-blue-700 
                       transition-colors duration-200 flex items-center 
                       justify-center gap-2 hover:shadow-md group"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.4 }}
              >
                <Home className="h-4 w-4" />
              </motion.div>
              Return Home
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.main>
  );
};

export default NotFoundPage;