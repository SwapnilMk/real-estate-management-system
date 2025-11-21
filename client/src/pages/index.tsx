import { motion } from "framer-motion";
import {
  ArrowRight,
  Search,
  Heart,
  TrendingUp,
  Shield,
  Users,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Hero from "@/assets/hero.png";
import Background from "@/assets/background.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const Home = () => {
  return (
    <>
      {/* HERO SECTION */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <img
          src={Background}
          alt="Real estate background"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent"></div>

        <div className="container max-w-7xl relative z-10 grid md:grid-cols-2 gap-8 items-center mx-auto px-4">
          {/* LEFT TEXT */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
              Discover Your Perfect Property Today
            </h1>

            <p className="text-lg text-white max-w-md">
              Browse thousands of verified listings, connect with trusted
              agents, and find your dream home with our comprehensive real
              estate platform.
            </p>

            <p className="text-lg text-gray-200">
              From residential homes to commercial properties, we provide a
              seamless experience for buyers, sellers, and agents alike.
            </p>

            <div className="flex flex-wrap gap-4 mt-6">
              <Link to="/listings">
                <Button className="group text-md px-6 py-6 bg-primary text-white hover:bg-primary/90">
                  Browse Listings
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>

              <Link to="/sign-in">
                <Button className="group text-md px-6 py-6 bg-primary text-white hover:bg-primary/90">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* RIGHT IMAGE CARD */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="relative mx-auto w-full max-w-2xl"
          >
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/20 to-primary/40 blur-md"></div>

            <div className="relative overflow-hidden rounded-xl bg-white shadow-lg">
              <img
                src={Hero}
                alt="Real Estate"
                className="w-full object-cover"
              />

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-6 text-white">
                <h3 className="font-bold text-center text-lg">
                  Your Trusted Real Estate Platform
                </h3>

                <div className="mt-2 flex items-center justify-center gap-6 text-sm">
                  <span>🏠 1000+ Properties</span>
                  <span>✓ Verified Listings</span>
                  <span>👥 Expert Agents</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-16 bg-muted/50 px-4">
        <motion.div
          className="container mx-auto max-w-3xl text-center space-y-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="text-3xl font-bold">
            Your Complete Real Estate Solution
          </h2>

          <p className="text-lg text-muted-foreground">
            Our platform connects property seekers with verified listings and
            professional agents, making real estate transactions transparent,
            efficient, and hassle-free.
          </p>

          <p className="text-lg text-muted-foreground">
            Whether you're buying your first home, selling a property, or
            managing listings as an agent, we provide all the tools you need in
            one place.
          </p>
        </motion.div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
              PLATFORM FEATURES
            </h2>

            <h3 className="mt-2 text-3xl font-bold">
              Everything You Need in One Place
            </h3>

            <p className="mt-4 mx-auto max-w-2xl text-lg text-muted-foreground">
              Our comprehensive platform offers powerful features for property
              seekers, sellers, and agents to streamline the entire real estate
              process.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "Advanced Property Search",
                description:
                  "Filter by location, price, type, and amenities to find exactly what you're looking for from our extensive database.",
              },
              {
                icon: Heart,
                title: "Save & Track Favorites",
                description:
                  "Create your personalized wishlist, track properties, and get instant notifications when prices change.",
              },
              {
                icon: Building2,
                title: "Agent Listings Management",
                description:
                  "Agents can easily list, update, and manage properties with our intuitive dashboard and analytics tools.",
              },
              {
                icon: Users,
                title: "Direct Agent Connection",
                description:
                  "Express interest and connect directly with verified agents to schedule viewings and get expert guidance.",
              },
              {
                icon: TrendingUp,
                title: "Market Insights",
                description:
                  "Access real-time property valuations, market trends, and neighborhood data to make informed decisions.",
              },
              {
                icon: Shield,
                title: "Verified Listings",
                description:
                  "All properties are verified by our team to ensure accuracy, legitimacy, and up-to-date information.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm hover:shadow-md transition-all"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative">
                  <item.icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="py-16 bg-black text-white px-4">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-sm font-semibold uppercase">WHY CHOOSE US</h2>
            <h3 className="mt-2 text-3xl font-bold">
              The Smart Way to Buy, Sell & Manage Properties
            </h3>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              className="space-y-6"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              {[
                {
                  title: "Comprehensive Database",
                  desc: "Access thousands of verified property listings with detailed information, photos, and accurate pricing.",
                },
                {
                  title: "User-Friendly Platform",
                  desc: "Intuitive interface designed for both property seekers and agents, making navigation and management effortless.",
                },
                {
                  title: "Secure & Transparent",
                  desc: "All listings are verified, and transactions are tracked to ensure complete transparency and security.",
                },
                {
                  title: "Professional Agent Network",
                  desc: "Connect with experienced, verified agents who provide expert guidance throughout your real estate journey.",
                },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <h4 className="text-xl font-bold flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    {item.title}
                  </h4>
                  <p className="text-gray-300 pl-7">{item.desc}</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              className="flex flex-col gap-4 justify-center"
            >
              <Link to="/listings" className="w-full">
                <Button className="group text-lg px-8 py-6 bg-white text-black hover:bg-white/90 w-full">
                  Explore Properties
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>

              <Link to="/sign-up" className="w-full">
                <Button className="group text-lg px-8 py-6 bg-white text-black hover:bg-white/90 w-full">
                  Create Account
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="py-16 bg-muted/50 px-4">
        <motion.div
          className="container mx-auto max-w-3xl text-center space-y-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="text-3xl font-bold">
            Ready to Find Your Dream Property?
          </h2>

          <p className="text-lg text-muted-foreground">
            Join thousands of satisfied users who have found their perfect homes
            through our platform. Start your real estate journey today.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mt-6">
            <Link to="/sign-up">
              <Button className="group text-md px-6 py-6 bg-black text-white hover:bg-black/90">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>

            <Link to="/listings">
              <Button variant="outline" className="text-md px-6 py-6">
                View All Listings
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default Home;
