"use client";
import React, { useContext, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Mail,
  User,
  Calendar,
  Shield,
  Image,
  LogOut,
  CheckCircle,
  XCircle,
  RefreshCw,
  Key,
} from "lucide-react";
import { motion } from "framer-motion";
import { AuthContext } from "@/Provider/AuthProvider";

export default function Profile() {
  const auth = useContext(AuthContext);
  const user = auth?.user;
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1488CC] to-[#2B32B2] flex items-center justify-center">
        <div className="text-white text-center">
          <p>Please sign in to view your profile</p>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const handleLogout = () => {
    if (auth?.logOut) {
      auth.logOut();
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

 

  return (
    <>
      <motion.div
        className="min-h-screen bg-gradient-to-br from-[#1488CC] to-[#2B32B2] py-8 px-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div variants={itemVariants}>
            <Card className="bg-white/95 backdrop-blur-md border-0 shadow-2xl">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#1488CC] to-[#2B32B2] bg-clip-text text-transparent">
                  Profile Information
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-8">
                {/* Profile Header */}
                <motion.div
                  className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b"
                  variants={itemVariants}
                >
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                      <AvatarImage
                        src={user.photoURL || ""}
                        alt={user.displayName || "User"}
                      />
                      <AvatarFallback className="bg-gradient-to-r from-[#1488CC] to-[#2B32B2] text-white text-2xl">
                        {user.displayName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <motion.div
                      className="absolute -bottom-2 -right-2 bg-gradient-to-r from-[#1488CC] to-[#2B32B2] rounded-full p-1"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Image className="h-4 w-4 text-white" />
                    </motion.div>
                  </motion.div>

                  <div className="text-center md:text-left">
                    <motion.h1
                      className="text-2xl font-bold text-gray-800"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {user.displayName || "User"}
                    </motion.h1>
                    <motion.p
                      className="text-gray-600"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {user.email}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Badge className="mt-2 bg-gradient-to-r from-[#1488CC] to-[#2B32B2] text-white">
                        {user.providerId}
                      </Badge>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Account Details Grid */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  variants={containerVariants}
                >
                  {/* Personal Information Card */}
                  <motion.div variants={cardVariants}>
                    <Card className="bg-gray-50 border-0 hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-700">
                          <User className="h-5 w-5" />
                          Personal Information
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm text-gray-500">
                              Display Name
                            </span>
                            <p className="font-medium">
                              {user.displayName || "Not set"}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">
                              User ID
                            </span>
                            <p className="font-medium text-sm text-gray-600 truncate">
                              {user.uid}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Contact Information Card */}
                  <motion.div variants={cardVariants}>
                    <Card className="bg-gray-50 border-0 hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-700">
                          <Mail className="h-5 w-5" />
                          Contact Information
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm text-gray-500">
                              Email Address
                            </span>
                            <p className="font-medium">{user.email}</p>
                          </div>
                         
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Account Activity Card */}
                  <motion.div variants={cardVariants}>
                    <Card className="bg-gray-50 border-0 hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-700">
                          <Calendar className="h-5 w-5" />
                          Account Activity
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm text-gray-500">
                              Account Created
                            </span>
                            <p className="font-medium">
                              {user.metadata?.creationTime
                                ? new Date(
                                    user.metadata.creationTime
                                  ).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">
                              Last Login
                            </span>
                            <p className="font-medium">
                              {user.metadata?.lastSignInTime
                                ? new Date(
                                    user.metadata.lastSignInTime
                                  ).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Security Card */}
                  <motion.div variants={cardVariants}>
                    <Card className="bg-gray-50 border-0 hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-700">
                          <Shield className="h-5 w-5" />
                          Security
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm text-gray-500">
                              Account Status
                            </span>
                            <Badge className="bg-green-500">Active</Badge>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">
                              Authentication
                            </span>
                            <p className="font-medium">
                              {user.providerData?.[0]?.providerId ||
                                "Email/Password"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 pt-6 border-t"
                  variants={itemVariants}
                >
                  <Button
                    className="bg-gradient-to-r from-[#1488CC] to-[#2B32B2] hover:from-[#2B32B2] hover:to-[#1488CC] transition-all"
                    onClick={handleRefresh}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Profile
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setResetPasswordOpen(true)}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Reset Password
                  </Button>
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
