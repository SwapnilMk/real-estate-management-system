"use client";

import { ContactForm } from "./components/contact-form";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.2 },
  },
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mt-10 sm:mt-16 max-w-xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {/* Header */}
          <motion.div className="text-center mb-10 space-y-2" variants={fadeUp}>
            <h2 className="text-2xl sm:text-3xl font-bold">Contact Us</h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              I&apos;m here to help! Fill out the form below and I&apos;ll get
              back to you as soon as possible.
            </p>
          </motion.div>

          {/* Contact Form */}
          <motion.div variants={fadeUp}>
            <ContactForm />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
