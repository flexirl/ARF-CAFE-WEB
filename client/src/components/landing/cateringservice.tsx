import { motion } from "framer-motion";
import cateringFood from "@/assets/catering-food.webp";

const CateringSection = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-display text-tmg-cream">BIG EVENT?</h2>
            <h3 className="text-3xl md:text-4xl font-display text-primary mt-2">
              WE'VE GOT YOU, GUEY.
            </h3>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Order catering straight from the kitchen that knows how to party. Tacos My Guey style.
            </p>
            <p className="text-muted-foreground text-xs mt-2 italic">
              * Only for select locations
            </p>
            <a
              href="#"
              className="inline-block mt-6 bg-primary text-primary-foreground font-display text-xl px-8 py-3 rounded-sm hover:bg-primary/90 transition-colors tracking-wider"
            >
              BOOK YOUR CATERING
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-lg overflow-hidden shadow-xl"
          >
            <img
              src={cateringFood}
              alt="Catering food spread from Tacos My Guey"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CateringSection;
