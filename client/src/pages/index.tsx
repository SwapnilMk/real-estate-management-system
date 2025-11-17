import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
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
              Find Your Dream Home With Real Estate Realtors
            </h1>

            <p className="text-lg text-white max-w-md">
              Whether you're buying your first home or looking for a premium
              investment property, we make real estate simple and stress-free.
            </p>

            <p className="text-lg text-gray-200">
              Explore top residential locations, compare properties, and get
              expert guidance to make the right real estate decisions with
              confidence.
            </p>

            <Button className="group text-md px-6 py-6 bg-black text-white mt-4">
              Schedule a Call
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
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
                <h3 className="font-bold text-center">
                  Your Trusted Real Estate Consultant
                </h3>

                <div className="mt-2 flex items-center justify-between gap-4">
                  <span className="text-sm">📞 7057332679</span>
                  <span className="text-xs">📩 mswapnil218@gmail.com</span>
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
            Trusted Real Estate Expertise You Can Rely On
          </h2>

          <p className="text-lg text-muted-foreground">
            With years of experience in residential real estate, Real Estate
            helps clients buy, sell, and invest in top properties with complete
            transparency and market expertise.
          </p>

          <p className="text-lg text-muted-foreground">
            From property search to closing, we ensure a smooth, professional,
            and personalized experience for every client.
          </p>
        </motion.div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
              SERVICES
            </h2>

            <h3 className="mt-2 text-3xl font-bold">
              Real Estate Services We Offer
            </h3>

            <p className="mt-4 mx-auto max-w-2xl text-lg text-muted-foreground">
              Buying or selling a home can be overwhelming—our team ensures you
              get the right guidance and support every step of the way.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Buy a Home",
                description:
                  "Find your ideal property with expert market insights, verified listings, and step-by-step guidance.",
              },
              {
                title: "Sell Your Property",
                description:
                  "Sell faster and at the best price with strategic marketing, negotiation skills, and professional staging.",
              },
              {
                title: "Market Insights",
                description:
                  "Get accurate property valuations and market trends to make informed investment decisions.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm hover:shadow-md"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="mt-2 text-muted-foreground">{item.description}</p>

                <div className="mt-4 flex items-center text-primary">
                  <span className="text-sm font-medium">Learn more</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE ME SECTION */}
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
              Why Clients Trust Real Estate
            </h3>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              className="space-y-8"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              {[
                {
                  title: "Honest Guidance",
                  desc: "We believe in transparency and ensure you get unbiased advice at every step.",
                },
                {
                  title: "Financial Assistance",
                  desc: "Get support with home loan options, EMI planning, and trusted mortgage partners.",
                },
                {
                  title: "Strong Network",
                  desc: "Work with experienced legal advisors, inspectors, and real estate specialists.",
                },
                {
                  title: "Expert Negotiation",
                  desc: "We negotiate the best deals for you—whether buying or selling.",
                },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xl font-bold">{item.title}</h4>
                    <ChevronDown className="h-5 w-5" />
                  </div>
                  <p className="text-gray-300">{item.desc}</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              className="flex justify-center"
            >
              <Button className="group text-lg px-8 py-6 bg-white text-black hover:bg-white/90">
                Book A Consultation
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
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
            Let’s Help You Buy or Sell Your Property With Ease
          </h2>

          <p className="text-lg text-muted-foreground">
            Your real estate goals deserve expert support. Work with a
            professional who puts your needs first.
          </p>

          <p className="text-lg">
            Contact us today and get end-to-end assistance for buying, selling,
            or investing in premium properties.
          </p>

          <Button className="group text-md px-6 py-6 bg-black text-white">
            Partner With Us
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </section>
    </>
  );
};

export default Home;
