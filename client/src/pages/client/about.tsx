"use client";

import { ContactForm } from "./components/contact-form";
import Background from "@/assets/background.jpg";
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

export default function About() {
  return (
    <main className="container mx-auto max-w-7xl py-10 px-4 sm:px-6 lg:px-8">
      {/* Top Section */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {/* Text Section */}
        <motion.div className="space-y-6" variants={fadeUp}>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            About Real Estate
          </h1>

          <motion.div className="prose max-w-none space-y-4">
            <motion.p variants={fadeUp}>
              Hi! I&apos;m Real Estate, a dedicated realtor in Surrey with a
              passion for helping people find their perfect home. With years of
              experience in the local real estate market, I understand that
              buying or selling a property is one of life&apos;s biggest
              decisions.
            </motion.p>

            <motion.p variants={fadeUp}>
              My approach combines in-depth market knowledge with personalized
              service. Whether you&apos;re a first-time buyer, looking to
              upgrade, or selling your property, I&apos;m here to guide you
              through every step of the process.
            </motion.p>

            <motion.p variants={fadeUp}>
              As part of the Real Estate team, I have access to extensive
              resources and a network of professionals to ensure your real
              estate journey is smooth and successful. I believe in building
              lasting relationships with my clients through trust, transparency,
              and dedication to their needs.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Image Section */}
        <motion.div
          className="relative"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="relative overflow-hidden rounded-lg h-[300px] sm:h-[380px] md:h-[420px] bg-muted"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.img
              src={Background}
              alt="About image"
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1 }}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Contact Section */}
      <motion.div
        className="mt-20 max-w-2xl mx-auto px-2"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <div className="text-center mb-10">
          <motion.h2
            variants={fadeUp}
            className="text-2xl sm:text-3xl font-bold"
          >
            Have a Question?
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-muted-foreground mt-2 text-sm sm:text-base"
          >
            I&apos;m here to help! Fill out the form below and I&apos;ll get
            back to you as soon as possible.
          </motion.p>
        </div>

        <motion.div variants={fadeUp}>
          <ContactForm />
        </motion.div>
      </motion.div>
    </main>
  );
}
