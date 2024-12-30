"use client";

import React from 'react';
import { ShieldX, ArrowLeft, Mail, Home } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import Link from 'next/link';

const UnauthorizedPage: React.FC = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const iconAnimation = {
    initial: { scale: 0.8, rotate: -10 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    }
  };

  // Handlers
  const handleGoBack = () => window.history.back();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
    >
      {/* Animated background decorations */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-grid-gray-100 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
      />
      
      <motion.div variants={fadeIn}>
        <Card className="max-w-lg w-full  backdrop-blur-sm rounded-xl shadow-xl relative">
          <CardContent className="p-8">
            {/* Animated top line */}
            <motion.div
              animate={{
                background: ['linear-gradient(to right, #ef4444, #f87171, #ef4444)'],
                backgroundSize: ['200% 100%'],
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
            />
            
            {/* Icon */}
            <motion.div
              className="flex justify-center mb-8"
              variants={iconAnimation}
              initial="initial"
              animate="animate"
            >
              <div className="p-4 bg-red-50 rounded-full">
                <ShieldX className="h-16 w-16 text-red-500" />
              </div>
            </motion.div>
            
            {/* Content */}
            <motion.div variants={fadeIn}>
              <motion.h1
                variants={fadeIn}
                className="text-4xl font-bold  mb-3 text-center"
              >
                Access Denied
              </motion.h1>
              
              <motion.p
                variants={fadeIn}
                className="text-gray-600 text-lg mb-4 text-center"
              >
                You don&apos;t have permission to access this page.
              </motion.p>
              
              <motion.p
                variants={fadeIn}
                className="text-gray-500 text-sm mb-8 text-center"
              >
                If you believe this is a mistake, please contact your system administrator.
              </motion.p>
            </motion.div>
            
            {/* Buttons */}
            <motion.div variants={fadeIn} className="space-y-4">
              <motion.button
                onClick={handleGoBack}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="flex items-center justify-center w-full gap-2 bg-white/80 hover:bg-gray-50 
                         text-gray-700 font-semibold py-4 px-6 rounded-xl border border-gray-200 
                         shadow-sm transition-all duration-200 hover:shadow-md group"
              >
                <motion.div
                  whileHover={{ x: -4 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <ArrowLeft className="h-5 w-5" />
                </motion.div>
                Go Back
              </motion.button>
              
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Link
                  href="/"
                  className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 
                           hover:from-blue-700 hover:to-blue-800 text-white font-semibold 
                           py-4 px-6 rounded-xl shadow-sm transition-all duration-200 
                           hover:shadow-md text-center"
                >
                  Return to Home
                </Link>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Footer elements */}
      <motion.div
        variants={fadeIn}
        className="mt-8 flex items-center justify-center gap-2 text-gray-500 
                   hover:text-gray-600 transition-colors duration-200"
      >
        <motion.div
          whileHover={{ rotate: 15 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Mail className="h-4 w-4" />
        </motion.div>
        <a href="/support" className="text-sm font-medium hover:underline">
          Contact Support Team
        </a>
      </motion.div>
      
      <motion.div
        variants={fadeIn}
        className="mt-4 text-sm text-gray-400"
      >
        Error Code: 401
      </motion.div>
    </motion.div>
  );
};

export default UnauthorizedPage;